
const router = require("express").Router();
const {
  getAdminTheme,
  editAdminTheme,
  addAdminTheme,
} = require("../../controllers/Admin/theme.controller");
const verifyAdminToken = require("../../helper/verifyAdminToken");

router.get("/getadmintheme", verifyAdminToken, getAdminTheme);
router.post("/addadmintheme", verifyAdminToken, addAdminTheme);
router.post("/editadmintheme", verifyAdminToken, editAdminTheme);

module.exports = router;
