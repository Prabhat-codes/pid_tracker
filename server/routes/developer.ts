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

// Route 1 :(For uploading a new file) Add a NEW file to the server by first finding a user from the table whose currently_reviewing status is false and set it to true 
router.post('/uploadfile', upload.single('file'), async (req, res) => {
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
        // Method to get a user whose currentl_reviewing status is false
        const user = await UserRetrievalRepo.getUserByStatus(data.user.id)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Request'
            })
        }

        // Method to set the current_reviewing status of the reviewer to true
       


        
    } catch (error) {
        
    }
})

// Route 2 : (For Fetching Status Pending FIles) Fetch ALL files from the server which have reviewed == false and developer_id == current_user_id

// Route 3 : (For Fetching Status Approved Files) Fetch ALL files from the server which have reviewed == true and developer_id == current_user_id

// Route 4 : (For adding file to the server which are already reviewed) Add file to the server by making it's reviewed == true and sent it to the same user_id = revieiwer id