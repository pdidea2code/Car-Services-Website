const express = require("express");
const router = express.Router();
const {
  addShowcase,
  editShowcase,
  getAllShowcase,
  deleteShowcase,
} = require("../../controllers/Admin/showcase.controller");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const { singleFileUpload } = require("../../helper/imageUpload");

router.post(
  "/addshowcase",
  verifyAdminToken,
  singleFileUpload("public/showcaseimg", ["image/png", "image/jpeg", "image/jpg", "image/webp"], 1024 * 1024, "image"),
  addShowcase
);
router.post(
  "/editshowcase",
  verifyAdminToken,
  singleFileUpload("public/showcaseimg", ["image/png", "image/jpeg", "image/jpg", "image/webp"], 1024 * 1024, "image"),
  editShowcase
);
router.get("/getallshowcase", verifyAdminToken, getAllShowcase);
router.post("/deleteshowcase", verifyAdminToken, deleteShowcase);

module.exports = router;
