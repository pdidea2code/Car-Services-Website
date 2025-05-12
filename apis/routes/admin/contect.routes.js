const express = require("express");
const router = express.Router();
const {
  getContent,
  deleteContent,
  updateContent,
  deleteMultipleContent,
} = require("../../controllers/Admin/constect.controller");
const verifyAdminToken = require("../../helper/verifyAdminToken");

router.get("/getcontent", verifyAdminToken, getContent);
router.post("/deletecontent", verifyAdminToken, deleteContent);
router.post("/updatecontent", verifyAdminToken, updateContent);
router.post("/deletemultiplecontent", verifyAdminToken, deleteMultipleContent);
module.exports = router;
