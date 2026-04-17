const express = require('express');
import { Request, Response } from 'express';


const app = express();



app.use("/test", (req: Request, res: Response) => {
    res.send("test test test!");
});

app.use("/hello", (req: Request, res: Response) => {
    res.send("hello hello hello!");
});

app.use("/bye", (req: Request, res: Response) => {
    res.send("bye bye bye!");
});
app.use("/", (req: Request, res: Response) => {
    res.send("hello from the dashboard!");
});


app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});