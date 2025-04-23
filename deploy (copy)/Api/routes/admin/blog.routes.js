const router = require("express").Router();
const { createBlog, getAllBlog ,getBlogById,updateBlog,updateStatus,deleteBlog  } = require("../../controllers/Admin/blog.controller");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const { multiDiffFileUpload } = require("../../helper/imageUpload");

router.post(
  "/createblog",
  verifyAdminToken,
  multiDiffFileUpload("public/blogimg/", [
    {
      name: "mainimage",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
    {
      name: "images",
      maxCount: 100,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
  ]),
  createBlog
);
router.post(
    "/updateblog",
    verifyAdminToken,
    multiDiffFileUpload("public/blogimg/", [
      {
        name: "mainimage",
        maxCount: 1,
        allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
      },
      {
        name: "images",
        maxCount: 100,
        allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
      },
    ]),
    updateBlog
  );
router.get("/getallblog",verifyAdminToken, getAllBlog);
router.post("/getblogbyid",verifyAdminToken, getBlogById);
router.post("/updatestatus",verifyAdminToken, updateStatus);
router.post("/deleteblog",verifyAdminToken, deleteBlog);
module.exports = router;
