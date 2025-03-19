const express = require("express");
const router = express.Router();
const {
  Register,
  verifyEmail,
  login,
  checkEmailId,
  verifyOtp,
  ForgotPassword,
  editProfile,
} = require("../../controllers/App/auth.controller");
const { singleFileUpload } = require("../../helper/imageUpload");
const verifyAppToken = require("../../helper/verifyAppToken");
router.post("/register", Register);
router.post("/verifyemail", verifyEmail);
router.post("/login", login);
router.post("/checkemailid", checkEmailId);
router.post("/verifyotp", verifyOtp);
router.post("/forgotpassword", ForgotPassword);
router.post(
  "/editprofile",
  verifyAppToken,
  singleFileUpload("public/userprofileimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  editProfile
);
module.exports = router;
