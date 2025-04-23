const mongoose = require("mongoose");

const showcaseSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Showcase = mongoose.model("Showcase", showcaseSchema);

module.exports = Showcase;
