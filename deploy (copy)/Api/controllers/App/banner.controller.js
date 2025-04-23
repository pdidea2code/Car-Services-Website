const Banner = require("../../models/Showcase");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");

const getAllBanner = async (req, res, next) => {
  try {
    const banner = await Banner.find({status: true});
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.BANNER_PATH;
    const bannerData = banner.map((item) => {
      return {
        ...item.toObject(),
        image: item.image ? baseUrl + item.image : null,
      };
    });
    successResponse(res, bannerData);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllBanner };