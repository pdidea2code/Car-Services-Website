const mongoose = require("mongoose");

const PopimageSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    mobileimage: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Popimage", PopimageSchema);
