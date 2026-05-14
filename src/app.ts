const express = require("express");
import { NextFunction, Request, Response } from "express";
const connectDB = require("./config/database");
const userModel = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { UserAuth } = require("./middlewares/auth");
const app = express();
app.use(express.json());
app.use(cookieParser());

//add user to database
app.post("/signup", async (req: Request, res: Response) => {
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

//profile api
app.get("/profile", UserAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      throw new Error("User does not exist!");
    }
    res.send(user);
  } catch (error) {
    res.send("ERROR!:" + error);
  }
});

//login api
app.post("/login", async (req: Request, res: Response) => {
  try {
    const { emailId, password } = req.body;
    //email validation

    const user = await userModel.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    //password check
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //assigning JWT token
      const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "7d",
      });

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

//sendConnectionRequest
app.post(
  "/sendConnectionRequest",
  UserAuth,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      console.log("Connection request sent!");
      res.send(user.firstName + " has sent a Connection request sent!");
    } catch (err) {
      res.send("ERROR!" + err);
    }
  },
);

//update data of an user
app.patch("/updateUser/:userId", async (req: Request, res: Response) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "photoUrl",
      "about",
      "skills",
      "gender",
      "age",
      "password",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );

    if (data?.skills.length > 10) {
      throw new Error("skills can not be more than 10");
    }
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    const user = await userModel.findOneAndUpdate({ _id: userId }, data, {
      ReturnDocument: "before",
      runValidators: true,
    });
    console.log(user);
    res.send("user data updated successfully!");
  } catch (err: any) {
    res.status(400).send("update failed! " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("✅ Database connected successfully");

    userModel
      .syncIndexes()
      .then(() => {
        console.log("💎 Unique indexes are verified and active.");

        // ONLY start the server once indexes are ready
        app.listen(3000, () => {
          console.log("🚀 Server is successfully listening on port 3000");
        });
      })
      .catch((err: Error) => {
        console.error("❌ INDEX SYNC ERROR:", err.message);
        console.log(
          "Tip: If you have duplicate emails in the DB, this will fail!",
        );
      });
  })
  .catch((err: Error) => {
    console.error("❌ DATABASE CONNECTION ERROR:", err.message);
  });
