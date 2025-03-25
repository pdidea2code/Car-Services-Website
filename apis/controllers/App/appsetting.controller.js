const AppSetting = require("../../models/AppSetting");
const UserTheme = require("../../models/UserTheme");
const BusinessHour = require("../../models/BusinessHour");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Showcase = require("../../models/Showcase");

const getAppSetting = async (req, res, next) => {
  try {
    const appSetting = await AppSetting.findOne({});
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.APPSETTING_IMAGE_URL;
    appSetting.logo = baseUrl + "/" + appSetting.logo;
    appSetting.footerlogo = baseUrl + "/" + appSetting.footerlogo;
    appSetting.favicon = baseUrl + "/" + appSetting.favicon;
   
    const data={
        name: appSetting.name,
        logo: appSetting.logo,
        footerlogo: appSetting.footerlogo,
        favicon: appSetting.favicon,
        workinghours: appSetting.workinghours,
        facebook: appSetting.facebook,
        instagram: appSetting.instagram,
        twitter: appSetting.twitter,
        youtube: appSetting.youtube,    
        copyright: appSetting.copyright,
        google_map_api_key: appSetting.google_map_api_key,
        currency_symbol: appSetting.currency_symbol,
        currency: appSetting.currency,
    }
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const themeSetting = async (req, res, next) => {
    try {
        const themeSetting = await UserTheme.findOne({is_active: true});   
        const baseUrl = req.protocol + "://" + req.get("host") + process.env.USER_THEME_PATH;
        themeSetting.mainimage = baseUrl + "/" + themeSetting.mainimage;
        themeSetting.headerimage = baseUrl + "/" + themeSetting.headerimage;
        themeSetting.workingimage = baseUrl + "/" + themeSetting.workingimage;
        themeSetting.springimage = baseUrl + "/" + themeSetting.springimage;
        successResponse(res, themeSetting);
    } catch (error) {
        next(error);
    }
}

const getBusinessHour=async(req,res,next)=>{
  try {
    const businessHour=await BusinessHour.find({});
    successResponse(res, businessHour);
  } catch (error) {
    next(error);
  }
}

const  getBanner=async(req,res,next)=>{
  try {
    const banner=await Showcase.find({status: true});
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.SHOWCASE_PATH;
    banner.forEach(item => {
      item.image = baseUrl + "/" + item.image;
    });
    successResponse(res, banner);
  } catch (error) {
    next(error);
  }
}
module.exports = { getAppSetting, themeSetting, getBusinessHour, getBanner };