const express = require("express");
const router = express.Router();
const {
  addAddons,
  editAddons,
  getAllAddons,
  deleteAddons,
  getAddonsbyService,
} = require("../../controllers/Admin/addons.controller");
const { singleFileUpload } = require("../../helper/imageUpload");
const verifyAdminToken = require("../../helper/verifyAdminToken");

router.post(
  "/addaddons",
  verifyAdminToken,
  singleFileUpload("public/addonsimg", ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg", "image/svg+xml"], 1024 * 1024, "image"),
  addAddons
);
router.post(
  "/editaddons",
  verifyAdminToken,
  singleFileUpload("public/addonsimg", ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg", "image/svg+xml"], 1024 * 1024, "image"),
  editAddons
);
router.get("/getalladdons", verifyAdminToken, getAllAddons);
router.post("/deleteaddons", verifyAdminToken, deleteAddons);
router.post("/getaddonsbyService", verifyAdminToken, getAddonsbyService);
module.exports = router;
