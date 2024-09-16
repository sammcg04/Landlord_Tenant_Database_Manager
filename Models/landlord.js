const mongoose = require("mongoose");

const landlordSchema = new mongoose.Schema({
  title: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  homeAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address" }, // Reference to Address schema
  dateOfBirth: { type: Date, required: true },
  councilPermission: { type: Boolean, required: true },
  contactPermission: { type: Boolean, required: true },
});

module.exports = mongoose.model("Landlord", landlordSchema);
