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
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    deletedAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  { timestamps: true, versionKey: false }
);

AddonsSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

AddonsSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

AddonsSchema.pre("findOneAndUpdate", function () {
  this.where({ isDeleted: false });
});

AddonsSchema.statics.softDelete = async function (id) {
  return this.findOneAndUpdate(
    { _id: id },
    {
      isDeleted: true,
      deletedAt: new Date(),
    },
    { new: true }
  );
};

// Custom method to restore soft-deleted document
AddonsSchema.statics.restore = async function (id) {
  return this.findOneAndUpdate(
    { _id: id },
    {
      isDeleted: false,
      deletedAt: null,
    },
    { new: true }
  );
};

AddonsSchema.statics.findDeleted = async function () {
  return this.find({ isDeleted: true });
};

const Addons = mongoose.model("Addons", AddonsSchema);

module.exports = Addons;
