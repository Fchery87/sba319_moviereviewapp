import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI);
    console.log("Connected to database");
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1); // Exit the process if the database connection fails
  }
};

connectDB();

export default mongoose;
