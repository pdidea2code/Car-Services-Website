const express = require("express");
const router = express.Router();
const { addFaq, editFaq, getAllFaq, deleteFaq } = require("../../controllers/Admin/faq.controller");
const verifyAdminToken = require("../../helper/verifyAdminToken");

router.post("/addfaq", verifyAdminToken, addFaq);
router.post("/editfaq", verifyAdminToken, editFaq);
router.get("/getallfaq", verifyAdminToken, getAllFaq);
router.post("/deletefaq", verifyAdminToken, deleteFaq);

module.exports = router;
