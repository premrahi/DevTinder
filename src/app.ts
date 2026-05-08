const express = require("express");
import { NextFunction, Request, Response, ErrorRequestHandler } from "express";

const app = express();

app.get("/getUserData", (req: Request, res: Response) => {
  throw new Error("nfnnao");
  res.send("user data sent");
});

app.use("/", (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
