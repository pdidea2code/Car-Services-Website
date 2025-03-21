const express = require("express");
const router = express.Router();
const { getAllBlog } = require("../../controllers/App/blog.conrroller");

router.get("/getallblog", getAllBlog);

module.exports = router;