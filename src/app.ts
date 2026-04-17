const express = require('express');
import { Request, Response } from 'express';


const app = express();



app.get("/user/:userID/:userName/:password", (req: Request, res: Response) => {
    console.log(req.params) ;
    res.send("test test test!");
});



app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});