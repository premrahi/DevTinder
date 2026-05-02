const express = require("express");
import { NextFunction, Request, Response } from "express";

const app = express();

app.get(
  "/user",
  (req: Request, res: Response, next: NextFunction) => {
    //Route handler
    // res.send("Route handler 1");
    next();
  },
  (req: Request, res: Response, next: NextFunction) => {
    // res.send("Route handler 2");
    next();
  },
  (req: Request, res: Response, next: NextFunction) => {
    res.send("Route handler 3");
    next();
  },
  (req: Request, res: Response, next: NextFunction) => {
    res.send("Route handler 4");
    next();
  },

  (req: Request, res: Response, next: NextFunction) => {
    res.send("Route handler 5");
    next();
  },
  (req: Request, res: Response, next: NextFunction) => {
    res.send("Route handler 6");
  }
);

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
