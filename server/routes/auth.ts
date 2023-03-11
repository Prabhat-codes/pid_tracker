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

import User from '../models/User'


const JWT_SECRET = 'Harryisagoodb$oy';

// Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
  body('username', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req:express.Request, res:express.Response) => {
  // If there are errors, return Bad request and the errors
  
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
try {
            //const file = req.file
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            const user = {
                UserName: req.body.username,
                email:req.body.email,
                password:secPass,
                currently_reviewing:false,
            }
            const userUploadService = new UserUploadService(user)

            //const fileUploadService = new FileUploadService(file)
            const fileId = await userUploadService.createFileUpload();
            
            if (fileId === 0) {
                
                return res.status(500).json({
                    success: false,
                    message: 'Error uploading file'
                })
            }
            
                const data = {
                    user:{
                        id:fileId
                    }
                }
                // res.json(fileId)
                const authtoken = jwt.sign(data, JWT_SECRET);
                res.json({success:true,authtoken})
        } catch (error) {
            console.log(error)
            res.json({
                success: false,
                message: error
            })
        }
//   try {
//     // Check whether the user with this email exists already
//     // let user = await User.findOne({ email: req.body.email });
//     // if (user) {
//     //   return res.status(400).json({ error: "Sorry a user with this email already exists" })
//     // }
//     const salt = await bcrypt.genSalt(10);
//     const secPass = await bcrypt.hash(req.body.password, salt);

//     // Create a new user
//     let user = await new Promise((resolve, reject) => {
//         connection.query(
//             "INSERT INTO user (user_name,email,password,unique_file_name) VALUES (?,?,?,?)",
//             [
//                 req.body.username,
//                 req.body.email,
//                 req.body.password,
//                 req.body.uniquelink,

//             ],
//             (error, results) => {
//                 if (error) {
//                     console.log(error.message)
//                     reject(0)
//                 }
//                 resolve(results.insertId)
//             }
//         )
//     })
//     // const data = {
//     //   user:{
//     //     id: user.id
//     //   }
//     // }
//     // const authtoken = jwt.sign(data, JWT_SECRET);
    

//     // res.json(user)
//     //res.json({authtoken})
//     res.json({id:user});
    
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
})


// Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [ 
  body('email', 'Enter a valid email').isEmail(), 
  body('password', 'Password cannot be blank').exists(), 
], async (req:express.Request, res:express.Response) => {

  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  let success = false;
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password} = req.body;
  try {
    //const userRetrievalRepo = new UserRetrievalRepo();
    const user = await UserRetrievalRepo.findUserBymail(email);
    //console.log(user)
    if(!user){
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }

    const data = {
      user:{
        id: user.user_id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }


})

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', async (req, res) => {
  const token = req.header('auth-token');
  if (!token) {
      res.status(401).send({ error: "Please authenticate using a valid token" })
  }
  try {
    
    const data = jwt.verify(token, JWT_SECRET);
    //console.log(data);
    
    //const userId = req.user.id;
    const user = await UserRetrievalRepo.findUserById(data.user.id)
    //console.log(user);
    //const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})
module.exports = router


