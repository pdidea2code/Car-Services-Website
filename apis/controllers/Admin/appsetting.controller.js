const AppSetting = require("../../models/AppSetting");
const {
  successResponse,
  queryErrorRelatedResponse,
} = require("../../helper/sendResponse");
const deleteFiles = require("../../helper/deleteFiles");

const addAppSetting = async (req, res, next) => {
  try {
    const appSetting = await AppSetting.create({
      name: req.body.name,
      currency: req.body.currency,
      currency_symbol: req.body.currency_symbol,
      logo: req?.files?.logo[0]?.filename,
      footerlogo: req?.files?.footerlogo[0]?.filename,
      favicon: req?.files?.favicon[0]?.filename,
      workinghours: req.body.workinghours,
      facebook: req.body.facebook,
      instagram: req.body.instagram,
      twitter: req.body.twitter,
      youtube: req.body.youtube,
      copyright: req.body.copyright,
      google_map_api_key: req.body.google_map_api_key,
      smtp_mail: req.body.smtp_mail,
      smtp_password: req.body.smtp_password,
      smtp_service: req.body.smtp_service,
      google_client_id: req.body.google_client_id,
      service_tax: req.body.service_tax,
      stripe_secret_key: req.body.stripe_secret_key,
      stripe_publishable_key: req.body.stripe_publishable_key,
      stripe_webhook_secret: req.body.stripe_webhook_secret,
    });
    successResponse(res, appSetting);
  } catch (error) {
    next(error);
  }
};

const editAppSetting = async (req, res, next) => {
  try {
    const appSetting = await AppSetting.findOne({});
    if (!appSetting) {
      return queryErrorRelatedResponse(res, 404, "App setting not found");
    }
    appSetting.name = req.body.name ? req.body.name : appSetting.name;
    appSetting.currency = req.body.currency
      ? req.body.currency
      : appSetting.currency;
    appSetting.currency_symbol = req.body.currency_symbol
      ? req.body.currency_symbol
      : appSetting.currency_symbol;
    appSetting.workinghours = req.body.workinghours
      ? req.body.workinghours
      : appSetting.workinghours;
    appSetting.facebook = req.body.facebook
      ? req.body.facebook
      : appSetting.facebook;
    appSetting.instagram = req.body.instagram
      ? req.body.instagram
      : appSetting.instagram;
    appSetting.twitter = req.body.twitter
      ? req.body.twitter
      : appSetting.twitter;
    appSetting.youtube = req.body.youtube
      ? req.body.youtube
      : appSetting.youtube;
    appSetting.copyright = req.body.copyright
      ? req.body.copyright
      : appSetting.copyright;
    appSetting.google_map_api_key = req.body.google_map_api_key
      ? req.body.google_map_api_key
      : appSetting.google_map_api_key;
    appSetting.smtp_mail = req.body.smtp_mail
      ? req.body.smtp_mail
      : appSetting.smtp_mail;
    appSetting.smtp_password = req.body.smtp_password
      ? req.body.smtp_password
      : appSetting.smtp_password;
    appSetting.smtp_service = req.body.smtp_service
      ? req.body.smtp_service
      : appSetting.smtp_service;
    appSetting.google_client_id = req.body.google_client_id
      ? req.body.google_client_id
      : appSetting.google_client_id;
    appSetting.service_tax = req.body.service_tax
      ? req.body.service_tax
      : appSetting.service_tax;
    appSetting.stripe_secret_key = req.body.stripe_secret_key
      ? req.body.stripe_secret_key
      : appSetting.stripe_secret_key;
    appSetting.stripe_publishable_key = req.body.stripe_publishable_key
      ? req.body.stripe_publishable_key
      : appSetting.stripe_publishable_key;
    appSetting.stripe_webhook_secret = req.body.stripe_webhook_secret
      ? req.body.stripe_webhook_secret
      : appSetting.stripe_webhook_secret;

    if (req?.files?.logo && req?.files?.logo[0]?.filename) {
      if (appSetting.logo) {
        deleteFiles(process.env.APPSETTING_IMAGE_URL + appSetting.logo);
      }
      appSetting.logo = req?.files?.logo[0]?.filename;
    }
    if (req?.files?.footerlogo && req?.files?.footerlogo[0]?.filename) {
      if (appSetting.footerlogo) {
        deleteFiles(process.env.APPSETTING_IMAGE_URL + appSetting.footerlogo);
      }
      appSetting.footerlogo = req?.files?.footerlogo[0]?.filename;
    }
    if (req?.files?.favicon && req?.files?.favicon[0]?.filename) {
      if (appSetting.favicon) {
        deleteFiles(process.env.APPSETTING_IMAGE_URL + appSetting.favicon);
      }
      appSetting.favicon = req?.files?.favicon[0]?.filename;
    }
    await appSetting.save();
    successResponse(res, appSetting);
  } catch (error) {
    next(error);
  }
};

const getAppSetting = async (req, res, next) => {
  try {
    const appSetting = await AppSetting.findOne({});
    if (!appSetting) {
      return queryErrorRelatedResponse(res, 404, "App setting not found");
    }
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;

    const baseUrl =
      protocol + "://" + req.get("host") + process.env.APPSETTING_IMAGE_URL;
    appSetting.logo = baseUrl + "/" + appSetting.logo;
    appSetting.footerlogo = baseUrl + "/" + appSetting.footerlogo;
    appSetting.favicon = baseUrl + "/" + appSetting.favicon;
    successResponse(res, appSetting);
  } catch (error) {
    next(error);
  }
};

module.exports = { addAppSetting, editAppSetting, getAppSetting };
