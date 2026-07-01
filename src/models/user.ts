const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    lastName: {
      trim: true,
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate(value: any) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid Email address " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required:true,
      min: 18,
    },
    gender: {
      type: String,
      required:true,
      validate(value: string) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.citypng.com/public/uploads/preview/profile-user-round-white-icon-symbol-png-701751695033499brrbuebohc.png",
      validate(value: any) {
        if (!validator.isURL(value)) {
          throw new Error("invalid photo url");
        }
      },
    },
    about: {
      type: String,
      default: "hey there! lets talk tech!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (
  passwordInputByUser: string,
) {
  const user = this;

  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash ,
  );

  return isPasswordValid  ;
};

export const userModel = mongoose.model("User", userSchema);
// module.exports = userModel;
