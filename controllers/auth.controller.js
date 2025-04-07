import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {JWT_SECRET , JWT_EXPIRES_IN} from '../config/env.js';
import User from '../models/users.models.js';

export const signUp = async (req,res,next) =>{
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const {name,email,password} = req.body;

        //check if user already exists

        const existingUser = await User.findOne({ email });

        if(existingUser){
            const error = new Error('User Already Exists');
            error.statusCode = 409;
            throw error;
        }

        //hash the password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(String(password),salt);

        //create a new user

        const newUsers = await User.create([{name,email,password : hashedPassword}] , {session});
        const token = jwt.sign({userId : newUsers[0]._id} , JWT_SECRET , {expiresIn : JWT_EXPIRES_IN});


        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User successfully created',
            data:{
                token,
                user: newUsers[0]
            }
        })
    }catch(err){
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
}

export const signIn = async (req,res,next) =>{
    try{
        const {email,password} = req.body;
        const user  = await User.findOne({email});

        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            const error = new Error('Invalid Password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({userId : user._id} , JWT_SECRET , {expiresIn: JWT_EXPIRES_IN});

        res.status(200).json({
            success: true,
            message: 'User successfully logged in',
            data:{
                token,
                user,
            }

        });
    }catch(error){
        next(error);
    }
}

// export const signOut = async (req,res,next) =>{}

