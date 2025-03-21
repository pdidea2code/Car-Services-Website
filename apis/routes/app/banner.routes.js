const express = require("express");
const router = express.Router();
const { getAllBanner } = require("../../controllers/App/banner.controller");

router.get("/getallbanner", getAllBanner);

module.exports = router;