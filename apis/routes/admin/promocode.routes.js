// routes/Admin/promoCode.route.js
const express = require("express");
const router = express.Router();
const {
  addPromoCode,
  editPromoCode,
  getAllPromoCode,
  deletePromoCode,
  deleteMultiplePromoCode,
} = require("../../controllers/Admin/promocode.controller");
const verifyAdminToken = require("../../helper/verifyAdminToken");

router.post("/addpromocode", verifyAdminToken, addPromoCode);
router.post("/editpromocode", verifyAdminToken, editPromoCode);
router.get("/getallpromocode", verifyAdminToken, getAllPromoCode);
router.post("/deletepromocode", verifyAdminToken, deletePromoCode);
router.post("/deletemultiplepromoCode", verifyAdminToken, deleteMultiplePromoCode);

module.exports = router;
