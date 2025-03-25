const express = require("express");
const router = express.Router();
const { getAppSetting, themeSetting, getBusinessHour     } = require("../../controllers/App/appsetting.controller");

router.get("/getappsetting", getAppSetting);
router.get("/gettheme", themeSetting);
router.get("/getbusinesshour", getBusinessHour);
module.exports = router;