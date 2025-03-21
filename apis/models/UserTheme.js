const mongoose = require("mongoose");

const userThemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color1: {
    type: String,
    required: true,
  },
  color2: {
    type: String,
    required: true,
  },
  color3: {
    type: String,
    required: true,
  },
  mainimage: {
    type: String,
    required: true,
  },
  headerimage: {
    type: String,
    required: true,
  },
  workingimage: {
    type: String,
    required: true,
  },
  springimage: {
    type: String,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true ,versionKey: false});

const UserTheme = mongoose.model("UserTheme", userThemeSchema);
module.exports = UserTheme;