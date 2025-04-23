const express = require("express");
const router = express.Router();
const {
  getOrder,
  updateOrderStatus,
  getUpcomingOrder,
  getPastOrder,
  getTodayOrder,
} = require("../../controllers/Admin/booking.controller");
const verifyAdminToken = require("../../helper/verifyAdminToken");

router.get("/getorder", verifyAdminToken, getOrder);
router.post("/updateOrderStatus", verifyAdminToken, updateOrderStatus);
router.get("/getupcomingorder", verifyAdminToken, getUpcomingOrder);
router.get("/getpastorder", verifyAdminToken, getPastOrder);
router.get("/gettodayorder", verifyAdminToken, getTodayOrder);
module.exports = router;
