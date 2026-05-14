const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
import { userModel } from "./models/user";

app.use(express.json());
app.use(cookieParser());


const authRouter =require("./routes/auth") ;
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")


app.use("/" ,authRouter) ;
app.use("/" ,profileRouter) ;
app.use("/" ,requestRouter) ;





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
