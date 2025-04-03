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
    isDeleted: { type: Boolean, default: false, select: false },
    deletedAt: { type: Date, default: null, select: false },
  },
  { timestamps: true, versionKey: false }
);

serviceSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

serviceSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

// serviceSchema.pre("findOneAndUpdate", function () {
//   this.where({ isDeleted: false });
// });

serviceSchema.statics.softDelete = async function (id) {
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
serviceSchema.statics.restore = async function (id) {
  return this.findOneAndUpdate(
    { _id: id },
    {
      isDeleted: false,
      deletedAt: null,
    },
    { new: true }
  );
};

// Custom method to get soft-deleted documents (if needed)
serviceSchema.statics.findDeleted = async function () {
  return this.find({ isDeleted: true });
};

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
