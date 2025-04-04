// models/PromoCode.js
const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FIXED"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    maxUses: {
      type: Number,
      default: -1, // -1 for unlimited uses
      min: -1,
    },
    usesCount: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    minimumOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    user_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming you have a User model
      },
    ],
    totalDiscountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("PromoCode", promoCodeSchema);
