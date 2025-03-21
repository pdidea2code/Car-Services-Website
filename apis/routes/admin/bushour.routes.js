const router = require("express").Router();
const { createBusinessHour, getAllBusinessHour, updateBusinessHour, deleteBusinessHour   } = require("../../controllers/Admin/bushour.controller");
const verifyAdminToken = require("../../helper/verifyAdminToken");

router.post("/createbusinesshour", verifyAdminToken, createBusinessHour);
router.get("/getallbusinesshour", verifyAdminToken, getAllBusinessHour);
router.post("/updatebusinesshour", verifyAdminToken, updateBusinessHour);
router.post("/deletebusinesshour", verifyAdminToken, deleteBusinessHour);
module.exports = router;