const express = require("express");
const router = express.Router();
const verifyAdminToken = require("../../helper/verifyAdminToken");

const { createAdmin, loginAdmin, RefreshToken, changePassword } = require("../../controllers/Admin/auth.controller");

router.post("/createadmin", createAdmin);
router.post("/login", loginAdmin);
router.post("/refreshtoken", RefreshToken);
router.post("/changepassword", verifyAdminToken, changePassword);

module.exports = router;
