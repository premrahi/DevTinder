const express = require("express");
import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import { ReturnDocument } from "mongodb";
const connectDB = require("./config/database");
const userModel = require("./models/user");

const app = express();
app.use(express.json());

//add user to database
app.post("/signup", async (req: Request, res: Response) => {
  //creating a new instance of user model
  const user = new userModel(req.body);

  try {
    await user.save();
    res.send("user added successfully!");
  } catch (err) {
    res.send("something went wrong " + err);
  }
});

// get data of one user
app.get("/getUser", async (req: Request, res: Response) => {
  const userEmail = req.body.emailId;
  try {
    const users = await userModel.find({
      emailId: userEmail,
    });
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.send(err + "something went wrong");
  }
});

//feed api - GET/FEED - get all the users from the database
app.get("/feed", async (req: Request, res: Response) => {
  try {
    const users = await userModel.find({});
    res.send(users);
  } catch {
    res.send("something went wrong");
  }
});

//deleting a user by id
app.delete("/deleteUser", async (req: Request, res: Response) => {
  const userId = req.body.userId;

  try {
    const user = await userModel.findByIdAndDelete(userId);
    res.send("user deleted successfully!");
  } catch (err) {
    res.send("something went wrong");
  }
});

//update data of an user
app.patch("/updateUser/:userId", async (req: Request, res: Response) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "photoUrl",
      "about",
      "skills",
      "gender",
      "age",
      "password",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if(data?.skills.length > 10){
      throw new Error("skills can not be more than 10") ;
    }
    if(!isUpdateAllowed){
      throw new Error("Update not allowed")
    }

    const user = await userModel.findOneAndUpdate({_id: userId }, data, {
      ReturnDocument: "before",
      runValidators: true,
    });
    console.log(user);
    res.send("user data updated successfully!");
  } catch (err: any) {
    res.status(400).send("update failed! " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("✅ Database connected successfully");

    userModel
      .syncIndexes()
      .then(() => {
        console.log("💎 Unique indexes are verified and active.");

        // ONLY start the server once indexes are ready
        app.listen(3000, () => {
          console.log("🚀 Server is successfully listening on port 3000");
        });
      })
      .catch((err: Error) => {
        console.error("❌ INDEX SYNC ERROR:", err.message);
        console.log(
          "Tip: If you have duplicate emails in the DB, this will fail!",
        );
      });
  })
  .catch((err: Error) => {
    console.error("❌ DATABASE CONNECTION ERROR:", err.message);
  });
