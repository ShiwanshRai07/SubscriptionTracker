import mongoose from 'mongoose';
import {DB_URI , NODE_ENV} from '../config/env.js';

if(!DB_URI){
    throw new Error('Please define a valid DB_URI inside .env.<development/production>.local');
}

const connectToDatabase = async () => {
    try{
        await mongoose.connect(DB_URI);
        console.log(`MongoDB Connected in ${NODE_ENV} mode!`);
    }
    catch(error){
        console.error('Error Connecting to database : ',error);

        process.exit(1);
    }
}


export default connectToDatabase;

