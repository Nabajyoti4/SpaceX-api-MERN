const LaunchDB = require("./launches.mongo");
const planetDB = require("./planets.mongo");
const axios = require("axios");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

//load launches data from spaceX api
const loadLaunchesData = async () => {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    throw new Error("Launch Data Download Failed");
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };

    await addSpaceData(launch);
  }
};

const addSpaceData = async (launch) => {
  try {
    const res = await LaunchDB.findOneAndUpdate(
      { flightNumber: launch.flightNumber },
      launch,
      {
        upsert: true,
      }
    );
    console.log(res);
  } catch (err) {
    throw new Error("Launch Data Add Failed" + err);
  }
};

//add new launch
const addNewLaunch = async (launchData) => {
  const planetExists = await planetDB.findOne({
    keplerName: launchData.target,
  });

  if (!planetExists) {
    throw new Error("Planet Name Not Found");
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launchData, {
    success: true,
    upcoming: true,
    customers: ["NASA", "SPACE-X"],
    flightNumber: newFlightNumber,
  });
  const res = await LaunchDB.findOneAndUpdate(
    { flightNumber: newLaunch.flightNumber },
    newLaunch,
    {
      upsert: true,
    }
  );
  return res;
};

// get all launch data
const getAllLaunches = async (skip, limit) => {
  try {
    return await LaunchDB.find({}, { __v: 0, _id: 0 })
      .sort({ flightNumber: 1 })
      .skip(skip)
      .limit(limit);
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * @param  {} id
 *
 */
const abortLaunch = async (id) => {
  const aborted = await LaunchDB.updateOne(
    {
      flightNumber: id,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.ok === 1 && aborted.nModified === 1;
};

//check if aluanch exists with flight number
const existsLaunchWithId = async (id) => {
  return await LaunchDB.findOne({
    flightNumber: id,
  });
};

//get latest flight number
const getLatestFlightNumber = async () => {
  const latestLaunch = await LaunchDB.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
};

module.exports = {
  loadLaunchesData,
  addNewLaunch,
  getAllLaunches,
  abortLaunch,
  existsLaunchWithId,
};
