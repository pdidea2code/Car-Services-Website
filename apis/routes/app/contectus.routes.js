const express = require("express");
const router = express.Router();
const {
  getAddress,
  addContent,
} = require("../../controllers/App/contectus.controller");

router.get("/getaddress", getAddress);
router.post("/addcontent", addContent);
module.exports = router;
