const http = require("http");
const { mongoConnect } = require("./services/mongo");
const { loadLaunchesData } = require("./models/launches.modal");

const app = require("./app");

const server = http.createServer(app);

const PORT = 8000;

const startServer = async () => {
  await mongoConnect();
  //await loadLaunchesData();

  server.listen(PORT, () => {
    console.log("Server Running");
  });
};

startServer();
