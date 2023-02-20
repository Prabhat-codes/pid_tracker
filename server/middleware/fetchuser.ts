var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Harryisagoodb$oy';
import express from 'express';
import User from '../models/User'
import { Request } from "express"
interface IGetUserAuthInfoRequest extends Request {
    user: User // or any other type
  }

const fetchuser = (req:IGetUserAuthInfoRequest, res:express.Response, next:express.NextFunction) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        console.log(data);
        req.user = data.User;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}


export default fetchuser;