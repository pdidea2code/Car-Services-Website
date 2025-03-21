const express = require("express");
const router = express.Router();
const { getAllService, getServiceById } = require("../../controllers/App/service.controller");

router.get("/getallservice", getAllService);
router.post("/getservicebyid", getServiceById);


module.exports = router;