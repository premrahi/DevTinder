const express = require('express');
import { Request, Response } from 'express';


const app = express();



app.get("/test", (req: Request, res: Response) => {
    res.send("test test test!");
});

app.post("/posting" , async (req: Request , res: Response) => {
    res.send("this is a post api call")
})

app.get("/hello", (req: Request, res: Response) => {
    res.send("hello hello hello!");
});

app.delete("/del", (req: Request, res: Response) => {
    res.send("bye bye bye!");
});
app.get("/", (req: Request, res: Response) => {
    res.send("hello from the dashboard!");
});


app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});