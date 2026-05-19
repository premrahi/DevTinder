const express = require("express");
import { Request, Response } from "express";
import { UserAuth } from "../middlewares/auth";
import connectionRequestModel from "../models/connectionRequest";

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl about skills gender  ";

//get all the connection request for the loggedIn user
userRouter.get(
  "/user/requests/received",
  UserAuth,
  async (req: Request, res: Response) => {
    try {
      const loggedInUser = req.user;

      const connectionRequest = await connectionRequestModel
        .find({
          toUserId: loggedInUser._id,
          status: "interested",
        })
        .populate("fromUserId", USER_SAFE_DATA);

      res.json({
        message: `here are all the connection request(s)(${connectionRequest.length}) of ${loggedInUser.firstName}`,
        data: connectionRequest,
      });
    } catch (err) {
      res.send("Error! : " + err);
    }
  },
);

// connection api
userRouter.get(
  "/user/connections",
  UserAuth,
  async (req: Request, res: Response) => {
    try {
      const loggedInUser = req.user;

      const connectionRequest = await connectionRequestModel
        .find({
          $or: [
            { toUserId: loggedInUser._id, status: "accepted" },
            { fromUserId: loggedInUser._id, status: "accepted" },
          ],
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

      const data = connectionRequest.map((row: any) => {
        if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
          return row.toUserId;
        }
        return row.fromUserId;
      });

      res.json({ data });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
);

export default userRouter;
