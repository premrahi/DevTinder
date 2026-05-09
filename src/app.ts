const express = require("express");
import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
const connectDB = require("./config/database");
const userModel = require("./models/user");

const app = express();

app.post("/signup", async (req: Request, res: Response) => {
  //creating a new instance of user model
  const user = new userModel({
    firstName: "virat",
    lastName: "Kohli",
    emailId: "viratkohli@gmail.com",
    password: "Prahi@123",
  });

  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.send("something went wrong" + err);
  }
});

connectDB()
  .then(() => {
    (console.log("database connected successfully"),
      app.listen(3000, () => {
        console.log("Server is successfully listening on port 3000");
      }));
  })
  .catch((err: Error) => {
    console.log("database cannot be connected!!!");
  });
