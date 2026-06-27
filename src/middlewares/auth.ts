import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
require("dotenv").config();
import { userModel } from "../models/user";

declare global {
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}

export const UserAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //read the token from req. cookies
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!")
    }

    //validate the token
    const decodedMessage = await jwt.verify(token, process.env.SECRET_KEY);

    const { _id } = decodedMessage;

    const user = await userModel.findById({_id:_id});
    if (!user) {
      throw new Error("user does not exist!");
    }
   
    req.user = user;
    // console.log(user,"userAuth completed")
    next();
  } catch (err) {
    res.status(404).send("ERROR!!!"+err);
  }
};

// module.exports = {
//   UserAuth,
// };
