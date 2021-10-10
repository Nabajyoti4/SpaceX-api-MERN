const Planet = require("./planets.mongo");

const planets = [
  {
    keplerName: "kepler-452b",
  },
  {
    keplerName: "kepler-186f",
  },
  {
    keplerName: "TRAPPIST-1f",
  },
  {
    keplerName: "TRAPPIST-1d",
  },
  {
    keplerName: "kepler-452b",
  },
];

const getPlanetsData = async () => {
  const res = await Planet.find({}, { __v: 0, _id: 0 });
  return res;
};

module.exports = {
  getPlanetsData,
};
