import UserUploadService from '../service/UserUploadService'
import connection from "../db";
import express from 'express';
import UserRepo from '../repository/UserRepo';
//const UserUploadService = require('../service/UserUploadService')
const router = express.Router();
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
var jwt = require('jsonwebtoken');
import UserRetrievalRepo from '../repository/UserRetrievalRepo';
import fetchuser from '../middleware/fetchuser';
import path from 'path'
import { validateFileSize, validateFileType } from '../service/fileValidatorService'
import FileUploadService from '../service/fileUploadService'
import multer from 'multer'
import FileRetrievalRepo from '../repository/FileRetrievalRepo';
const upload = multer()
const nodemailer = require("nodemailer");

import User from '../models/User'
const JWT_SECRET = 'Harryisagoodb$oy';

async function sendMail(senderMail:string,receiverMail:string,pass:string,comment:string):Promise<boolean>  {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  try {
      let transporter = nodemailer.createTransport({
          host: "smtp-mail.outlook.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: senderMail, // generated ethereal user
            pass: pass, // generated ethereal password
          },
        });
      
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: `"Wells Fargo" <${senderMail}>`, // sender address
          to: `${receiverMail}`, // list of receivers
          subject: "PID Review Done", // Subject line
          text: "Hey,your PID Review is Done", // plain text body
          html: `<b>${comment}</b>`, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return true;
      
  } catch (error) {

      console.log(error);
      return false;
  }
  
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


// Route 1 :(For Current Pending Review) Fetching a file from the server which has reviewed == false and reviewer_id(of uploaded_file) == user_id(of user)

router.get('/pendingreview',upload.none(),  async (req, res) => {
    const token = req.header('auth-token');
  if (!token) {
      res.status(401).send({ error: "Please authenticate using a valid token" })
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    const files = await FileRetrievalRepo.findPendingFilesforReview(data.user.id)
    var str = JSON.stringify(files)
    var json = JSON.parse(str)
    console.log("Reviewer Pending")
    console.log(json)
    res.send(json)
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

// Route 2 :(For history of all reviews the guy has done) Fetching ALL files from the server which has reviewed == true and sent_to_reviewer_id(of uploaded_file) == user_id(of user)

router.get('/reviewerhistory',upload.none(),  async (req, res) => {
    const token = req.header('auth-token');
  if (!token) {
      res.status(401).send({ error: "Please authenticate using a valid token" })
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    const files = FileRetrievalRepo.findReviewedFiles(data.user.id)
    var str = JSON.stringify(files)
    var json = JSON.parse(str)
    res.send(json)
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

// Route 3 :(Effectively sending to developer) ADD a file to the server and make it's reviewed == false (file_field) to true and send to developer_id (and then delete the current file which has reviewed==false) . Also set currently_reviewing to true (actually no, it will depend on the developer if or not he wants to close the current file review process , if implemented this way then there's gonnna the the reviewer will be blocked from reviewing other files but if not implemented this way then there wont be one to one communication for a certain PID between dev and reviewer. One alternative is for a queue of pending reviews for the reviewer which will defeat the point single request :') ).

router.post('/uploadfile', upload.single('file'), async (req, res) => {
  console.log("rev hello")
  const token = req.header('auth-token');
  if (!token) {
      res.status(401).send({ error: "Please authenticate using a valid token" })
  }
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
      const data = jwt.verify(token, JWT_SECRET);
      const file = req.file
      const comment = req.body.comment
      const pass = req.body.pass
      const fid = req.body.fid
      console.log("rev hello:"+fid)
      const validFileType = await validateFileType(path.extname(file.originalname))
      const validFileSize = await validateFileSize(file.size)
      if (!validFileType.isValid || !validFileSize.isValid) {
          return res.status(400).json({
              success: false,
              message: 'Invalid Request'
          })
      }
      const dev = await FileRetrievalRepo.findFileById(fid)
      if (!dev) {
          return res.status(400).json({
              success: false,
              message: 'Could not find file with the specific dev'
          })
      }
      const reviewer = await UserRetrievalRepo.findUserById(data.user.id)
      // Method to get a user whose currentl_reviewing status is false
      // const reviewer = await UserRetrievalRepo.getUserByStatus(data.user.id)
      if (!reviewer) {
          return res.status(400).json({
              success: false,
              message: 'Could not find reviewer'
          })
      }
      // console.log("Got a user")
      // Method to set the current_reviewing status of the reviewer to false
     const success = await UserRetrievalRepo.changeUserStatus(data.user.id, false)
     if (!success) {
      return res.status(400).json({
          success: false,
          message: 'Failed to change user status'
      })
     }
     console.log("Marked reviewer status to false")

     const receiver = await UserRetrievalRepo.findUserById(dev.developerID)
     if (!receiver) {
      return res.status(400).json({
          success: false,
          message: 'Could not find reviewer'
      })
    }
    // Method to chage the reviewed status of the file to true
    const filechanged = await FileRetrievalRepo.deleteFileById(fid)
    if(filechanged == false)
    {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete file'
    })
    }
     const fileUploadService = new FileUploadService(file)
     const userfileId = await fileUploadService.createFileUpload2(dev.developerID,data.user.id,comment,true)
     //const reviewerfileId = await fileUploadService.createFileUpload2(reviewer.user_id,comment)
      if (userfileId === 0) {
          return res.status(500).json({
              success: false,
              message: 'Error uploading file'
          })
      }
      // If there are errors, return Bad request and the errors
      
      const sendingMail = await sendMail(reviewer.email,receiver.email,pass,comment);
      if(sendingMail == false){
          console.log('error sending mail')
      }
      console.log("file uploaded")
      res.json({
          success: true,
          userfileId
      })
      
  } catch (error) {
      console.log(error)
  }
})



module.exports = router