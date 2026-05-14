const express = require("express") ;
import { Request,Response,NextFunction } from "express";
const bcrypt = require("bcrypt") ;
import { userModel } from "../models/user";
const { validateSignupData } = require("../utils/validation");



const authRouter = express.Router() ;

//add user to database
authRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    //validation
    validateSignupData(req);

    //Encryption of password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);

    //creating a new instance of user model
    const user = new userModel({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("user added successfully!");
  } catch (err) {
    res.send("something went wrong " + err);
  }
});

//login api
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { emailId, password } = req.body;
    //email validation

    const user = await userModel.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    //password check
    const isPasswordValid = await user.validatePassword(password) ;

    if (isPasswordValid) {
      //assigning JWT token
      const token =await user.getJWT() ;

      //sending JWT token in cookie
      res.cookie("token", token);

      res.send("user login successful!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.send("ERROR!: " + err);
  }
});






module.exports = authRouter;