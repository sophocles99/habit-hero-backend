const express = require("express");
const apiRouter = express.Router();
const habitsRouter = require("./habits.router")
const usersRouter = require("./users.router");
const endpoints = require("../endpoints.json");
const authenticate = require("../middleware/authenticate");

apiRouter.use("/habits", authenticate, habitsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.get("/", (req, res) => res.send({ endpoints }));

module.exports = apiRouter;
