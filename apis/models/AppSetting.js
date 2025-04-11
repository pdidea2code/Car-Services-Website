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
  google_client_id: { type: String, required: false },
  smtp_mail: { type: String, required: false },
  smtp_password: { type: String, required: false },
  smtp_service: { type: String, required: false },
  service_tax: { type: Number, required: false },
  stripe_secret_key: { type: String, required: false },
  stripe_publishable_key: { type: String, required: false },
  stripe_webhook_secret: { type: String, required: false },
});
const AppSetting = mongoose.model("AppSetting", appSettingSchema);

module.exports = AppSetting;
