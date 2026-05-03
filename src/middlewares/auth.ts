import { Request,Response,NextFunction } from "express";

const adminAuth = (req:Request , res:Response , next:NextFunction) => {
    const authToken = "xyz" ;
    const isAdminAuthorized = authToken === "xyz" ;
    console.log("Admin auth is getting checked");

    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized Request")
    }
    else{
        next() ;
    }
};
 
const UserAuth = (req:Request , res:Response , next:NextFunction) => {
    const authToken = "xyz" ;
    const isAdminAuthorized = authToken === "xyz" ;
    console.log("User auth is getting checked");

    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized Request")
    }
    else{
        next() ;
    }
};
 
module.exports = {
    adminAuth,
    UserAuth,
}