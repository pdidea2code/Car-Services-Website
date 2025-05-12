const Review = require("../../models/Review");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({}).populate("user_id").populate("order_id").sort({ createdAt: -1 });
    const baseUrl = req.protocol + "://" + req.get("host") + "/userprofileimg/";
    const data = reviews.map((review) => ({
      _id: review._id,
      name: review.name,
      email: review.email,
      review: review.review,
      createdAt: review.createdAt,
      designation: review.designation,
      user_id: review.user_id._id,
      service_id: review.service_id,
      order_id: review.order_id.order_id,
      status: review.status,
      image: review.user_id.image ? baseUrl + review.user_id.image : null,
    }));
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const changeReviewStatus = async (req, res, next) => {
  try {
    const { review_id, status } = req.body;
    const review = await Review.findOne({ _id: review_id });
    if (!review) {
      return queryErrorRelatedResponse(res, 404, "Review not found");
    }
    if (req.body.status !== undefined) {
      review.status = req.body.status === "true" || req.body.status === true;
    }
    await review.save();
    successResponse(res, review);
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { review_id } = req.body;
    const review = await Review.findOne({ _id: review_id });
    if (!review) {
      return queryErrorRelatedResponse(res, 404, "Review not found");
    }
    await review.deleteOne();
    successResponse(res, "Review deleted successfully");
  } catch (error) {
    next(error);
  }
};

const deleteMultipleReview = async (req, res, next) => {
  try {
    const { review_ids } = req.body;

    if (!Array.isArray(review_ids) || review_ids.length === 0) {
      return queryErrorRelatedResponse(res, 400, "Invalid or empty review IDs array");
    }

    const reviews = await Review.find({ _id: { $in: review_ids } });
    if (reviews.length !== review_ids.length) {
      return queryErrorRelatedResponse(res, 404, "One or more reviews not found");
    }

    await Review.deleteMany({ _id: { $in: review_ids } });

    successResponse(res, "Multiple reviews deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllReviews, changeReviewStatus, deleteReview, deleteMultipleReview };
