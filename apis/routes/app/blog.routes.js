const express = require("express");
const router = express.Router();
const {
  getAllBlog,
  getBlogById,
} = require("../../controllers/App/blog.controller");

router.post("/getallblog", getAllBlog);
router.get("/getblogbyid/:id", getBlogById);
module.exports = router;
