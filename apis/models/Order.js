const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    order_id: {
      type: String,
      required: true,
      unique: true,
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    addons_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Addon",
      },
    ],
    cartype_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cartype",
    },
    promocode_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PromoCode",
    },
    address_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    additionalinfo: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    service_amount: {
      type: Number,
      required: true,
    },
    tax_amount: {
      type: Number,
      required: true,
    },
    discount_amount: {
      type: Number,
      default: 0, // Optional, defaults to 0 if not provided
    },
    total_amount: {
      type: Number,
      required: true,
    },
    pickupanddrop: {
      type: Boolean,
      required: true,
    },
    carname: {
      type: String,
      required: true,
    },
    carnumber: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    colony: {
      type: String,
      default: "",
    },
    house_no: {
      type: String,
      default: "",
    },
    paymentmode: {
      type: String,
      required: true,
      enum: ["COD", "ONLINE"],
    },
    paymentstatus: {
      type: String,
      required: true,
      enum: ["PENDING", "SUCCESS", "FAILED"],
    },
    order_status: {
      type: String,
      required: true,
      enum: ["PENDING", "COMPLETED", "CANCELLED"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Order", orderSchema);
