import { timeStamp } from "node:console";

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
  lastName: {
    trim: true,
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate(value: string) {
      if (!["male", "female", "other"].includes(value)) {
        throw new Error("Gender data is not valid");
      }
    },
  },
  photoUrl: {
    type: String,
  },
  about: {
    type: String,
    default: "hey there! lets talk tech!",
  },
  skills: {
    type: [String],
  },
},{
  timestamps:true,
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
