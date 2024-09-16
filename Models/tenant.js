const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  title: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  homeAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address" }, // Reference to Address schema
});

module.exports = mongoose.model("Tenant", tenantSchema);


// WIndows 11 Chrome Latest Version

// access atlas:  sampmcgrath@gmail.com     Sammcgrath2004??