const validate = require("validator")
import { Request } from "express";

const validateSignupData = (req: Request) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validate.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validate.isStrongPassword(password)) {
    throw new Error("password is not valid!");
  }
};

module.exports = { validateSignupData } ;