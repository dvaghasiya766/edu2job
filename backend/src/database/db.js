import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_DB_URI;
    await mongoose.connect(uri);
    return "Server is successfully connected to the database!";
  } catch (err) {
    console.error("❌ Database Connection Error:", err);
    throw err; // important: throw error so index.js knows connection failed
  }
};
