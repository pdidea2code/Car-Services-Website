const express = require("express");
const router = express.Router();
const {
  addReview,
  displayReview,
} = require("../../controllers/App/review.controller");
const verifyAppToken = require("../../helper/verifyAppToken");

router.post("/addreview", verifyAppToken, addReview);
router.get("/displayreview", displayReview);
module.exports = router;
