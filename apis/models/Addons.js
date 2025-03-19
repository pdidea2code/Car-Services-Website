const mongoose = require("mongoose");

const AddonsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    serviceid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    price: {
      type: Number,
    },
    time: {
      type: Number,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Addons = mongoose.model("Addons", AddonsSchema);

module.exports = Addons;
