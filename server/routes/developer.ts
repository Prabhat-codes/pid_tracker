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


async function sendMail(senderMail:string,receiverMail:string,pass:string):Promise<boolean>  {
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
            subject: "PID Review Pending", // Subject line
            text: "Hey,your PID Review is Pending", // plain text body
            html: "<b>Hey,your PID Review is Pending</b>", // html body
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


// Route 1 :(For uploading a new file) Add a NEW file to the server by first finding a user from the table whose currently_reviewing status is false and set it to true 
router.post('/uploadfile', upload.single('file'), async (req, res) => {
    console.log("dev hello")
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
        const validFileType = await validateFileType(path.extname(file.originalname))
        const validFileSize = await validateFileSize(file.size)
        if (!validFileType.isValid || !validFileSize.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Request'
            })
        }
        const sender = await UserRetrievalRepo.findUserById(data.user.id)
        // Method to get a user whose currentl_reviewing status is false
        const reviewer = await UserRetrievalRepo.getUserByStatus(data.user.id)
        if (!reviewer) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Request'
            })
        }
        console.log("Got a user")
        // Method to set the current_reviewing status of the reviewer to true
       const success = await UserRetrievalRepo.changeUserStatus(reviewer.user_id?reviewer.user_id:-1, true)
       if (!success) {
        return res.status(400).json({
            success: false,
            message: 'Failed to change user status'
        })
       }
       console.log("Marked reviewer status to true")
       const fileUploadService = new FileUploadService(file)
       const userfileId = await fileUploadService.createFileUpload2(data.user.id,reviewer.user_id?reviewer.user_id:-1,comment,false)
       //const reviewerfileId = await fileUploadService.createFileUpload2(reviewer.user_id,comment)
        if (userfileId === 0) {
            return res.status(500).json({
                success: false,
                message: 'Error uploading file'
            })
        }
        // If there are errors, return Bad request and the errors
        if(sender == false)
        {
            return res.status(500).json({
                success: false,
                message: 'Error uploading file'
            })
        }
        const sendingMail = await sendMail(sender.email,reviewer.email,pass);
        if(sendingMail == false){
            console.log('error sending mail')
        }
        console.log("file uploaded")
        res.json({
            success: true,
            userfileId
        })
        
    } catch (error) {
        
    }
})

// Route 2 : (For Fetching Status Pending FIles) Fetch ALL files from the server which have reviewed == true and developer_id == current_user_id
router.get('/approved',upload.none(),  async (req, res) => {
    const token = req.header('auth-token');
  if (!token) {
      res.status(401).send({ error: "Please authenticate using a valid token" })
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    const files = await FileRetrievalRepo.findFilesforDev(data.user.id,true)
    var str = JSON.stringify(files)
    var json = JSON.parse(str)
    console.log("Developer Approved")
    console.log(json)
    res.send(json)
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

// Route 3 : (For Fetching Status Approved Files) Fetch ALL files from the server which have reviewed == false and developer_id == current_user_id
router.get('/pendingreview',upload.none(),  async (req, res) => {
    const token = req.header('auth-token');
  if (!token) {
      res.status(401).send({ error: "Please authenticate using a valid token" })
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    const files = await FileRetrievalRepo.findFilesforDev(data.user.id,false)
    var str = JSON.stringify(files)
    var json = JSON.parse(str)
    console.log("Developer Pending")
    console.log(json)
    res.send(json)
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})
// Route 4 : (For adding file to the server which are already reviewed) Add file to the server by making it's reviewed == true and sent it to the same user_id = revieiwer id




module.exports = router