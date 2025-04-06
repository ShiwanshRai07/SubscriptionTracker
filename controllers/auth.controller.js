import mongoose from 'mongoose';

export const signUp = async (req,res,next) =>{
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const {name,email,password} = req.body;

        //check if user already exists

        const existingUser = await User.findOne(email);

        if(existingUser){
            const error = new Error('User Already Exists');
            error.statusCode = 409;
            throw error;
        }


        await session.commitTransaction();

    }catch(err){

    }
}

export const signIn = async (req,res,next) =>{}

export const signOut = async (req,res,next) =>{}

