const AppSetting = require("../../models/AppSetting");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
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
    appSetting.currency = req.body.currency ? req.body.currency : appSetting.currency;
    appSetting.currency_symbol = req.body.currency_symbol ? req.body.currency_symbol : appSetting.currency_symbol;
    appSetting.workinghours = req.body.workinghours ? req.body.workinghours : appSetting.workinghours;
    appSetting.facebook = req.body.facebook ? req.body.facebook : appSetting.facebook;
    appSetting.instagram = req.body.instagram ? req.body.instagram : appSetting.instagram;
    appSetting.twitter = req.body.twitter ? req.body.twitter : appSetting.twitter;
    appSetting.youtube = req.body.youtube ? req.body.youtube : appSetting.youtube;
    appSetting.copyright = req.body.copyright ? req.body.copyright : appSetting.copyright;


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
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.APPSETTING_IMAGE_URL;
    appSetting.logo = baseUrl + "/" + appSetting.logo;
    appSetting.footerlogo = baseUrl + "/" + appSetting.footerlogo;
    appSetting.favicon = baseUrl + "/" + appSetting.favicon;
    successResponse(res, appSetting);

  } catch (error) {
    next(error);
  }
};

module.exports = { addAppSetting, editAppSetting, getAppSetting };
