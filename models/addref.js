const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  code: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Addref", schema);
