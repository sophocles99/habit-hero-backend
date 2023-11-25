const express = require("express");
const apiRouter = express.Router();
const habitRouter = require("./habit.route");
const userRouter = require("./user.route");
const endpoints = require("../endpoints.json");

apiRouter.use("/habits", habitRouter);
apiRouter.use("/users", userRouter);
apiRouter.get("/", (req, res) => res.send({ endpoints }));

module.exports = apiRouter;
