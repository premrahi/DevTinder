const express = require("express");
import { NextFunction, Request, Response } from "express";

const app = express();

const {adminAuth , UserAuth} = require("./middlewares/auth")

// this will take care of all the auth middle ware for GET,POST... 
app.use("/admin" ,adminAuth );

app.get("/user" , UserAuth ,(req:Request , res:Response)=> {
    res.send("user data send") ;
})

app.get("/admin/getAllData" , (req:Request ,res:Response,next:NextFunction)=>{
    res.send("got all the Data") ;
});

app.get("/admin/DeleteUser" , (req:Request ,res:Response,next:NextFunction)=>{
    res.send("Deleted a user") ;
});


app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
