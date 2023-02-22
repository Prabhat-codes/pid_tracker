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

// ROUTE 1: Get All the files using: GET "/api/auth/getuser". Login required
router.get('/fetchfiles',upload.none(), async (req, res) => {
  const token = req.header('auth-token');
  if (!token) {
      res.status(401).send({ error: "Please authenticate using a valid token" })
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    //console.log(data);
    
    //const userId = req.user.id;
    const files = await FileRetrievalRepo.findFileByUid(data.user.id)
    //console.log('hello world')
    //console.log(files)
    var str = JSON.stringify(files)
    var json = JSON.parse(str)
    //console.log(json);
    //console.log(files=== false ? {} : files);
    //const user = await User.findById(userId).select("-password")
    res.send(json)
  } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 2: Add a new Note using: POST "/api/auth/addnote". Login required
router.post('/addfile',upload.single('file'), async (req, res) => {
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

            const validFileType = await validateFileType(path.extname(file.originalname))
            const validFileSize = await validateFileSize(file.size)
            if (!validFileType.isValid || !validFileSize.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid Request'
                })
            }

            const fileUploadService = new FileUploadService(file)
            const fileId = await fileUploadService.createFileUpload2(data.user.id)
            if (fileId === 0) {
                return res.status(500).json({
                    success: false,
                    message: 'Error uploading file'
                })
            }
            // If there are errors, return Bad request and the errors
            res.json({
                success: true,
                fileId
            })
            

            //res.json(savedNote)

        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    })

    module.exports = router