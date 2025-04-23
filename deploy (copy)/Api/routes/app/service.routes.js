const express = require("express");
const router = express.Router();
const {
  getAllService,
  getServiceById,
  getAddonbyService,
  getCarType,
} = require("../../controllers/App/service.controller");

router.get("/getallservice", getAllService);
router.post("/getservicebyid", getServiceById);
router.post("/getaddonbyserviceid", getAddonbyService);
router.get("/getcartype", getCarType);
module.exports = router;
