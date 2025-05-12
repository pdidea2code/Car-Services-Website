const express = require("express");
const router = express.Router();
const {
  addCartype,
  editCartype,
  getAllCartype,
  deleteCartype,
  deleteMultipleCartype,
} = require("../../controllers/Admin/cartype.controller");
const verifyAdminToken = require("../../helper/verifyAdminToken");

router.post("/addcartype", verifyAdminToken, addCartype);
router.post("/editcartype", verifyAdminToken, editCartype);
router.get("/getallcartype", verifyAdminToken, getAllCartype);
router.post("/deletecartype", verifyAdminToken, deleteCartype);
router.post("/deletemultiplecartype", verifyAdminToken, deleteMultipleCartype);

module.exports = router;
