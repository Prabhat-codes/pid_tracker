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

import User from '../models/User'
const JWT_SECRET = 'Harryisagoodb$oy';

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
    console.log("Revieiwer Pending")
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


module.exports = router