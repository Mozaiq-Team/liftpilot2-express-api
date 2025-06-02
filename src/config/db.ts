import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("MongoDB connected successfully");
};
