import jwt from 'jsonwebtoken';
import User from '../models/users.models.js';
import {JWT_SECRET } from '../config/env.js';

const authorize =  async (req,res,next) => {
    try{
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token) return res.status(401).json({message: 'No token provided'});

        const decoded = await jwt.verify(token,JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if(!user) return res.status(401).json({message: 'UNAUTHORIZED'});

        req.user = user;
        next();

    }catch(error){
    res.status(401).json({error: error.message , message :'UNAUTHORIZED'});
    }
}

export default authorize;