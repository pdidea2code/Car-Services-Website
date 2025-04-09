const router = require("express").Router();
const {
  VerifyPromoCode,
  createOrder,
  getOrder,
  cardpayment,
  verifyPayment,
  refundPayment,
} = require("../../controllers/App/booking.controller");
const verifyAppToken = require("../../helper/verifyAppToken");

router.post("/verifypromocode", verifyAppToken, VerifyPromoCode);
router.post("/createorder", verifyAppToken, createOrder);
router.get("/getorder", verifyAppToken, getOrder);
router.post("/cardpayment", verifyAppToken, cardpayment);
router.post("/verifypayment", verifyAppToken, verifyPayment);
router.post("/refundpayment", verifyAppToken, refundPayment);
module.exports = router;
