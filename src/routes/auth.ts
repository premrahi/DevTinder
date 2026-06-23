const express = require("express") ;
import { Request,Response,NextFunction } from "express";
const bcrypt = require("bcrypt") ;
import { userModel } from "../models/user";
import { now } from "mongoose";
const { validateSignupData } = require("../utils/validation");
const cookieParser = require("cookie-parser");




const authRouter = express.Router() ;

authRouter.use(cookieParser());


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
      return res.status(404).send("Invalid credentials");
    }

    //password check
    const isPasswordValid = await user.validatePassword(password) ;

    if (isPasswordValid) {
      //assigning JWT token
      const token =await user.getJWT() ;

      //sending JWT token in cookie
      res.cookie("token", token);

      res.send(user);
    } else {
      return res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    res.send("ERROR!: " + err);
  }
});

authRouter.post("/logout" ,async(req:Request , res:Response)=>{
    res.cookie("token" ,null ,{
        expires: new Date(Date.now()),
    });
    res.send("Logout successful!") ;
})






module.exports = authRouter;