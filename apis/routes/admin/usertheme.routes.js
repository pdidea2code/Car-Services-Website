const express = require("express");
const router = express.Router();
const { getAllUserTheme, addUserTheme, updateUserTheme, deleteUserTheme, setActiveUserTheme } = require("../../controllers/Admin/usertheme.controller");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const { multiDiffFileUpload } = require("../../helper/imageUpload");

router.get("/getallusertheme", verifyAdminToken, getAllUserTheme);
router.post("/addusertheme", verifyAdminToken, multiDiffFileUpload("public/userthemeimg/", [
    {
      name: "mainimage",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
    {
      name: "headerimage",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },

    {
      name: "workingimage",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
    {
      name: "springimage",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },  

  ]),
  addUserTheme
);
router.post("/updateusertheme", verifyAdminToken, multiDiffFileUpload("public/userthemeimg/", [
        {
      name: "mainimage",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
    {
      name: "headerimage",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
    {
      name: "workingimage",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },  
  
    {
      name: "springimage",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },  
    
  ]),
   updateUserTheme);
router.post("/deleteusertheme", verifyAdminToken, deleteUserTheme);     
router.post("/setactiveusertheme", verifyAdminToken, setActiveUserTheme);
module.exports = router;