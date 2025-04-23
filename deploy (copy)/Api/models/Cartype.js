const mongoose = require("mongoose");

const cartypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Cartype = mongoose.model("Cartype", cartypeSchema);

module.exports = Cartype;
