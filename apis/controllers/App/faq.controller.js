const Faq = require("../../models/Faq");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");

const getAllFaq = async (req, res, next) => {
  try {
    const faq = await Faq.find({status: true});
    successResponse(res, faq);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllFaq }; 