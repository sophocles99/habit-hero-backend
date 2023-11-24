const express = require("express");
const apiRouter = express.Router();
const userRouter = require("./user.route");
const endpoints = require("../endpoints.json");

apiRouter.use("/user", userRouter);
apiRouter.get("/", (req, res) => res.send({ endpoints }));

module.exports = apiRouter;
