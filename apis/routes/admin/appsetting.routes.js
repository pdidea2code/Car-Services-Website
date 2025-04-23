const router = require("express").Router();
const {
  addAppSetting,
  editAppSetting,
  getAppSetting,
} = require("../../controllers/Admin/appsetting.controller");
const { multiDiffFileUpload } = require("../../helper/imageUpload");
const verifyAdminToken = require("../../helper/verifyAdminToken");

router.post(
  "/addappsetting",
  verifyAdminToken,
  multiDiffFileUpload("public/appsettingimg", [
    {
      name: "logo",
      maxCount: 1,
      allowedMimes: [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "image/svg",
        "image/svg+xml",
      ],
    },
    {
      name: "footerlogo",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg", "image/svg+xml"],
    },
    {
      name: "favicon",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
    
  ]),
  addAppSetting
);
router.post(
  "/editappsetting",
  verifyAdminToken,
  multiDiffFileUpload("public/appsettingimg", [
    {
      name: "logo",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg", "image/svg+xml"],
    },
    {
      name: "footerlogo",
      maxCount: 1,  
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg", "image/svg+xml"],
    },
    {
      name: "favicon",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },  
  ]),
  editAppSetting
);
router.get("/getappsetting", getAppSetting);

module.exports = router;
