const express = require("express");
const router = express.Router();
const {
  getAllReviews,
  changeReviewStatus,
  deleteReview,
  deleteMultipleReview,
} = require("../../controllers/Admin/review.controller");
const verifyAdminToken = require("../../helper/verifyAdminToken");

router.get("/getallreviews", verifyAdminToken, getAllReviews);
router.post("/changereviewstatus", verifyAdminToken, changeReviewStatus);
router.post("/deletereview", verifyAdminToken, deleteReview);
router.post("/deletemultiplereview", verifyAdminToken, deleteMultipleReview);

module.exports = router;
