const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    review: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"], // Email validation
    },
    status: { type: Boolean, default: false },
    designation: { type: String, required: true, trim: true },
    // is_approved: {
    //   type: "String", // Status of the review (e.g., "pending", "approved", "rejected")
    //   required: true,
    //   enum: ["pending", "approved", "rejected"], // Restrict to specific values
    //   default: "pending",
    // },
  },
  { timestamps: true, versionKey: false }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
