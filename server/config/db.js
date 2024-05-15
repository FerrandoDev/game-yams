import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
        });
        console.log(`Database Connected: ${conn.connection.host}`);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
};

export default connectDB;
