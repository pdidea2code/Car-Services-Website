const router = require("express").Router();
const {
  VerifyPromoCode,
  createOrder,
  getOrder,
} = require("../../controllers/App/booking.controller");
const verifyAppToken = require("../../helper/verifyAppToken");

router.post("/verifypromocode", verifyAppToken, VerifyPromoCode);
router.post("/createorder", verifyAppToken, createOrder);
router.get("/getorder", verifyAppToken, getOrder);
module.exports = router;
