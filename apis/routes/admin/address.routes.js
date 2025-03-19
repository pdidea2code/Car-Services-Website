const express = require("express");
const router = express.Router();
const {
  createAddress,
  editAddress,
  getAllAddress,
  deleteAddress,
} = require("../../controllers/Admin/address.controller");
const verifyAdminToken = require("../../helper/verifyAdminToken");

router.post("/addaddress", verifyAdminToken, createAddress);
router.post("/editaddress", verifyAdminToken, editAddress);
router.get("/getalladdress", verifyAdminToken, getAllAddress);
router.post("/deleteaddress", verifyAdminToken, deleteAddress);

module.exports = router;
