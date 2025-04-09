const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const bannerRoutes = require("./banner.routes");
const serviceRoutes = require("./service.routes");
const blogRoutes = require("./blog.routes");
const faqRoutes = require("./faq.routes");
const appSettingRoutes = require("./appsetting.routes");
const contectusRoutes = require("./contectus.routes");
const bookingRoutes = require("./booking.routes");
const cardRoutes = require("./card.routes");

router.use("/auth", authRoutes);
router.use("/banner", bannerRoutes);
router.use("/service", serviceRoutes);
router.use("/blog", blogRoutes);
router.use("/faq", faqRoutes);
router.use("/appsetting", appSettingRoutes);
router.use("/contectus", contectusRoutes);
router.use("/booking", bookingRoutes);
router.use("/card", cardRoutes);

module.exports = router;
