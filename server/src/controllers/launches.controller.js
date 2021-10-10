const {
  addNewLaunch,
  getAllLaunches,
  existsLaunchWithId,
  abortLaunch,
} = require("../models/launches.modal");

const { getPagination } = require("../services/query");

// get all launches
const httpGetLaunches = async (req, res) => {
  const { skip, limit } = getPagination(req.query);
  try {
    return res.status(200).json(await getAllLaunches(skip, limit));
  } catch (err) {
    console.log(err);
  }
};

// add new launches
const httpPostLaunches = async (req, res) => {
  const launch = req.body;

  console.log(req.body);
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing Required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch Date",
    });
  }

  try {
    const postData = await addNewLaunch(launch);
    res.status(201).json(postData);
  } catch (err) {
    console.log(err);
  }
};

// abort a mission
const httpAbortLaunches = async (req, res) => {
  const launchId = Number(req.params.id);

  const launchExists = await existsLaunchWithId(launchId);
  if (!launchExists) {
    return res.status(400).json({
      error: "Launch Not Found",
    });
  }

  const aborted = await abortLaunch(launchId);

  if (!aborted) {
    return res.status(400).json({
      error: "Launch Not Aborted",
    });
  }
  res.status(200).json({
    ok: true,
  });
};

module.exports = {
  httpPostLaunches,
  httpGetLaunches,
  httpAbortLaunches,
};
