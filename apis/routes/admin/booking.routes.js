const express = require("express");
const router = express.Router();
const {
  getOrder,
  updateOrderStatus,
} = require("../../controllers/Admin/booking.controller");
const verifyAdminToken = require("../../helper/verifyAdminToken");

router.get("/getorder", verifyAdminToken, getOrder);
router.post("/updateOrderStatus", verifyAdminToken, updateOrderStatus);

module.exports = router;
