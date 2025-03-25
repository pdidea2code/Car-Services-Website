const express = require("express");
const router = express.Router();
const { getAppSetting, themeSetting, getBusinessHour, getBanner } = require("../../controllers/App/appsetting.controller");

router.get("/getappsetting", getAppSetting);
router.get("/gettheme", themeSetting);
router.get("/getbusinesshour", getBusinessHour);
router.get("/getbanner", getBanner);
module.exports = router;