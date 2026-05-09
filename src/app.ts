const express = require("express");
import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
const connectDB = require("./config/database");
const userModel = require("./models/user");

const app = express();
app.use((express.json()))
app.post("/signup", async (req: Request, res: Response) => {
  
  
  //creating a new instance of user model
  const user = new userModel(req.body);

  try {
    await user.save();
    res.send("user added successfully!");
  } catch (err) {
    res.send("something went wrong" + err);
  }
});

app.get("/getUser" , async (req:Request , res:Response)=>{

  const userEmail = req.body.emailId ;
  try {
    const users = await userModel.find({
      emailId : userEmail
    })
    if(users.length === 0){
      res.status(404).send("user not found")
    }
    else{
      res.send(users) ;
    } 
  }
  catch(err) {
    res.send(err + "something went wrong")
  }
})

//feed api - GET/FEED - get all the users from the database
app.get("/feed" ,async(req:Request , res:Response)=>{
  try{
    const users = await userModel.find({}) ;
    res.send(users) ;  
  }
  catch{
    res.send("something went wrong")
  } 
})



connectDB()
  .then(() => {
    (console.log("database connected successfully"),
      app.listen(3000, () => {
        console.log("Server is successfully listening on port 3000");
      }));
  })
  .catch((err: Error) => {
    console.log("database cannot be connected!!!");
  });
