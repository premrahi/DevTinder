const express = require("express") ;
const { UserAuth } = require("../middlewares/auth");
import { Request, Response, NextFunction } from "express";


const requestRouter = express.Router() ;


//sendConnectionRequest
requestRouter.post(
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


module.exports = requestRouter ;