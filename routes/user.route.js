const express = require("express");
const { checkEmail, register, login } = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.post("/checkemail", checkEmail);
userRouter.post("/register", register);
userRouter.post("/login", login);

module.exports = userRouter;
