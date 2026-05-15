const express = require("express");
const { UserAuth } = require("../middlewares/auth");
import { Request, Response, NextFunction } from "express";
import connectionRequestModel from "../models/connectionRequest";
import { userModel } from "../models/user";

const requestRouter = express.Router();

//sendConnectionRequest
requestRouter.post(
  "/request/send/:status/:toUserId",
  UserAuth,
  async (req: Request, res: Response) => {
    try {
      const fromUser: any = (req as any).user;
      const fromUserId: any = (req as any).user._id;
      const toUserId: any = req.params?.toUserId;
      const status: any = req.params?.status;

      const toUser = await userModel.findById(toUserId);
      if(!toUser){
        return res.status(404).json({ message : "user not found!`"})
      }

      if(fromUserId == toUserId){
        return res.send({message:"cannot send connection request to yourself!"})
      }


      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "invalid status type : " + status,
        });
      }

      const existingConnectionRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        res.status(400).json({
          message: "connection request already exists!",
        });
      }

      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: `${fromUser.firstName}  ${status} the request successfully!`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR!: " + err);
    }
  },
);

module.exports = requestRouter;
