const { getPlanetsData } = require("../models/planets.modal");

const httpGetAllPlanets = async (req, res) => {
  const planetsData = await getPlanetsData();
  return res.status(200).json(planetsData);
};

module.exports = {
  httpGetAllPlanets,
};
