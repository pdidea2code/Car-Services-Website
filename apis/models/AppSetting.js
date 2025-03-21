const mongoose = require("mongoose");

const appSettingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  currency_symbol: {
    type: String,
    required: true,
  },
  logo: { type: String, required: false },
  footerlogo: { type: String, required: false },
  favicon: { type: String, required: false },
  workinghours: { type: String, required: false },
  facebook: { type: String, required: false },
  instagram: { type: String, required: false },
  twitter: { type: String, required: false },
  youtube: { type: String, required: false },
  copyright: { type: String, required: false },
  google_map_api_key: { type: String, required: false },
});

const AppSetting = mongoose.model("AppSetting", appSettingSchema);

module.exports = AppSetting;
