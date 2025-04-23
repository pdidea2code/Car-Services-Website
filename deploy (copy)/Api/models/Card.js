const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethodId: { type: String, required: true },
    last4: { type: String, required: true },
    cardholderName: { type: String, required: true },
    expiryMonth: { type: String, required: true },
    expiryYear: { type: String, required: true },
    cardType: { type: String, required: true },
    status: { type: Boolean, default: true },
    isdeleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

cardSchema.pre("find", function () {
  this.where({ isdeleted: false });
});

cardSchema.pre("findOne", function () {
  this.where({ isdeleted: false });
});

cardSchema.statics.softDelete = async function (id) {
  return this.findOneAndUpdate(
    { _id: id },
    {
      isdeleted: true,
      deleted_at: new Date(),
    },
    { new: true }
  );
};

cardSchema.statics.restore = async function (id) {
  return this.findOneAndUpdate(
    { _id: id },
    {
      isdeleted: false,
      deleted_at: null,
    },
    { new: true }
  );
};

cardSchema.statics.findDeleted = async function () {
  return this.find({ isdeleted: true });
};

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
