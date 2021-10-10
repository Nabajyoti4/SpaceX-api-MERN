const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://naba-admin:0JGz9vSyU2llxRid@nasa-cluster.m85tv.mongodb.net/nasaDB?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("Mongodb connection ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

const mongoConnect = async () => {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
};

const mongoDisconnect = async () => {
  await mongoose.disconnect();
};

module.exports = {
  mongoDisconnect,
  mongoConnect,
};
