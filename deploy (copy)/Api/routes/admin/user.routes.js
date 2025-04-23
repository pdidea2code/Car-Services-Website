const express = require("express");
const router = express.Router();
const { getalluser, changeStatus } = require("../../controllers/Admin/user.controller");
const verifyAdminToken = require("../../helper/verifyAdminToken");

router.get("/getalluser", verifyAdminToken, getalluser);
router.post("/changestatus", verifyAdminToken, changeStatus);

module.exports = router;
