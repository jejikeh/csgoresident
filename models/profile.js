const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  SteamID: {
    type: String,
    require: true,
  },
  bonusbalance: {
    type: Number,
  },
  actbalance: {
    type: Number,
  },
  allreadyref: {
    type: Boolean,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
});

module.exports = mongoose.model("profile", schema);
