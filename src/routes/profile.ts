const express = require("express");
const { UserAuth } = require("../middlewares/auth");
import { Request, Response, NextFunction } from "express";
import { userModel } from "../models/user";
import { log } from "node:console";
const { validateProfileEditData } = require("../utils/validation");
const profileRouter = express.Router();

//profile api
profileRouter.get(
  "/profile/view",
  UserAuth,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        throw new Error("User does not exist!");
      }
      res.send(user);
    } catch (error) {
      res.send("ERROR!:" + error);
    }
  },
);

//update data of an user
profileRouter.patch(
  "/profile/edit",
  UserAuth,
  async (req: Request, res: Response) => {
    try {
      if (!validateProfileEditData(req)) {
        throw new Error("Invalid edit request!");
      }

      const loggedInUser = (req as any).user;

      Object.keys(req.body).forEach(
        (key) => (loggedInUser[key] = req.body[key]),
      );

      await loggedInUser.save() ;

      console.log(loggedInUser);

      res.send("Profile updated successfully!")
    } catch (err) {
      res.send("ERROR! : " + err);
    }
  },
);

module.exports = profileRouter;
