const config = require("./config");
const mongoose = require("mongoose");

module.exports = () => {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.set("debug", true);

    mongoose.connection
      .on("error", (error) => reject(error))
      .on("close", () => console.log("db connection closed"))
      .once("open", () => resolve(mongoose.connections));

    mongoose.connect(config.mongourl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
};
