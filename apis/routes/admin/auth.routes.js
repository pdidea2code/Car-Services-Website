const express = require("express");
const router = express.Router();
const { createAdmin, loginAdmin, RefreshToken } = require("../../controllers/Admin/auth.controller");

router.post("/createadmin", createAdmin);
router.post("/login", loginAdmin);
router.post("/refreshtoken", RefreshToken);

module.exports = router;
