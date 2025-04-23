const express = require("express");
const router = express.Router();
const {
  addCard,
  saveCard,
  getCard,
  deleteCard,
} = require("../../controllers/App/card.controller");
const verifyAppToken = require("../../helper/verifyAppToken");

router.post("/addcard", verifyAppToken, addCard);
router.post("/savecard", verifyAppToken, saveCard);
router.get("/getcard", verifyAppToken, getCard);
router.post("/deletecard", verifyAppToken, deleteCard);
module.exports = router;
