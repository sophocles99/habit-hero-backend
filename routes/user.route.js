const express = require("express");
const register = require("../controllers/user/register.controller");
const login = require("../controllers/user/login.controller");
const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);

module.exports = userRouter;
