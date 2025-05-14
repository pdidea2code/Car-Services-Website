const Banner = require("../../models/Showcase");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");

const getAllBanner = async (req, res, next) => {
  try {
    const banner = await Banner.find({ status: true });
    const baseUrl = process.env.BASE_URL + process.env.BANNER_PATH;
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
