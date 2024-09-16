const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, required: true },
  addressLine2: String,
  town: { type: String, required: true },
  county: { type: String, required: true },
  eircode: { type: String, unique: true},
});

module.exports = mongoose.model("Address", addressSchema);
