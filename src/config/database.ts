import mongoose from "mongoose";
require("dotenv").config();


if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}
const db_uri: string = process.env.MONGODB_URI;


const connectDB = async () => {
  await mongoose.connect(db_uri);
};

module.exports = connectDB;
