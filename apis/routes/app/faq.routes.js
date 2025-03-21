const express = require("express");
const router = express.Router();
const { getAllFaq } = require("../../controllers/App/faq.controller");

router.get("/getallfaq", getAllFaq);

module.exports = router;