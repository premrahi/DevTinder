const express = require("express");
const { UserAuth } = require("../middlewares/auth");
import { Request, Response, NextFunction } from "express";
import { userModel } from "../models/user";


const profileRouter = express.Router();


//profile api
profileRouter.get("/profile", UserAuth, async (req: Request, res: Response) => {
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

//update data of an user
profileRouter.patch("/updateUser/:userId", async (req: Request, res: Response) => {
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
    res.send("user data updated successfully!");
  } catch (err: any) {
    res.status(400).send("update failed! " + err.message);
  }
});



module.exports = profileRouter;
