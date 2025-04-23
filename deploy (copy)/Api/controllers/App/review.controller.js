const Review = require("../../models/Review");
const {
  successResponse,
  queryErrorRelatedResponse,
} = require("../../helper/sendResponse");

const addReview = async (req, res, next) => {
  try {
    const { service_id, review, name, email, designation, order_id } = req.body;
    const createReview = await Review.create({
      service_id,
      review,
      order_id,
      name,
      email,
      designation,
      user_id: req.user._id,
    });
    successResponse(res, createReview);
  } catch (error) {
    next(error);
  }
};

const displayReview = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      status: true,
    }).populate("user_id");
    const baseUrl = req.protocol + "://" + req.get("host") + "/userprofileimg/";
    const data = reviews.map((review) => ({
      _id: review._id,
      name: review.name,
      // email: review.email,
      review: review.review,
      designation: review.designation,
      image: review.user_id.image ? baseUrl + review.user_id.image : null,
    }));
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};
module.exports = { addReview, displayReview };
