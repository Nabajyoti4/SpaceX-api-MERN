const express = require("express");

const {
  httpPostLaunches,
  httpGetLaunches,
  httpAbortLaunches,
} = require("../../controllers/launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetLaunches);
launchesRouter.post("/", httpPostLaunches);
launchesRouter.delete("/:id", httpAbortLaunches);

module.exports = launchesRouter;
