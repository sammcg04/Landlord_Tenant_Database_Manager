const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
  contractDate: { type: Date, required: true },
  propertyAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  }, // Reference to Address schema
  tenants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
  ],
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Landlord",
    required: true,
  },
  feeMonthly: { type: Number, required: true },
  propertyDoorNumber: String,
  contractLength: {
    type: String,
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Contract", contractSchema);
