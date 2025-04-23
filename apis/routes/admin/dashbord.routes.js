const express = require("express");
const router = express.Router();
const {
  getKPIMetrics,
  getRecentActivity,
  getOrderStatusBreakdown,
  getTopServicesAndAddons,
  getSystemHealthAlerts,
} = require("../../controllers/Admin/dashbord.controller");
const verifyAdminToken = require("../../helper/verifyAdminToken");

router.get("/kpimetrics", verifyAdminToken, getKPIMetrics);
router.get("/recentactivity", verifyAdminToken, getRecentActivity);
router.get("/orderstatusbreakdown", verifyAdminToken, getOrderStatusBreakdown);
router.get("/topservicesandaddons", verifyAdminToken, getTopServicesAndAddons);
router.get("/systemhealthalerts", verifyAdminToken, getSystemHealthAlerts);
module.exports = router;
