const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

const Content = mongoose.model("Contact", contentSchema);

module.exports = Content;
