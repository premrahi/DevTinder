const express = require("express");
import { Request, Response } from "express";
import { UserAuth } from "../middlewares/auth";
import connectionRequestModel from "../models/connectionRequest";
import { userModel } from "../models/user";

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

userRouter.get(
  "/feed", 
  UserAuth, 
  async (req: Request, res: Response) => {
  try {
    // the user should see all the user cards except ->
    // 0. his own card
    // 1. his connections
    // 2. ignored people
    // 3. already send connection request to

    const loggedInUser = req.user;
    const page = parseInt(req.query.page as any) || 1;
    let limit = parseInt(req.query.limit as any) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    //find all the connection request (send + received)
    const connectionRequest: any = await connectionRequestModel
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");

    const hideUserFromFeed: any = new Set();
    connectionRequest.forEach((req: any) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const users = await userModel
      .find({
        $and: [
          { _id: { $nin: Array.from(hideUserFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    // .select("firstName").populate("fromUserId" ,"firstName").populate("toUserId" ,"firstName")

    res.json({data : users});
  } catch (err: any) {
    res.status(400).json({ message: "Error: " + err });
  }
  }
);

export default userRouter;
