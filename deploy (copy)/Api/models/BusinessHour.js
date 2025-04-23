const mongoose = require("mongoose");

const businessHourSchema = new mongoose.Schema({
  day: { type: String, required: true },
  open: { type: String, required: false },
  close: { type: String, required: false },
  is_closed: { type: Boolean, required: false ,default: false},
  duration: { type: Number, required: false },
}, { timestamps: true ,versionKey: false});

const BusinessHour = mongoose.model("BusinessHour", businessHourSchema);

module.exports = BusinessHour;