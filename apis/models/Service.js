const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    iconimage: { type: String, required: true },
    price: { type: Number, required: true },
    time: { type: Number, required: true },
    include: { type: [String], required: true },
    whyChooseqImage: { type: String, required: true },
    whyChooseqTitle: { type: String, required: true },
    whyChooseqDescription: { type: String, required: true },
    whyChooseqinclude: { type: [String], required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
