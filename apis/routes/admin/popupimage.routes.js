const express = require("express");
const router = express.Router();
const verifyAdminToken = require("../../helper/verifyAdminToken");
const { multiDiffFileUpload } = require("../../helper/imageUpload");
const { addPopupImage, getPopupImage, updatePopupImage } = require("../../controllers/Admin/popupimage.controller");

router.post(
  "/addpopupimage",
  verifyAdminToken,
  multiDiffFileUpload("public/popupimage", [
    {
      name: "image",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
    {
      name: "mobileimage",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
  ]),
  addPopupImage
);
router.get("/getpopupimage", getPopupImage);
router.post(
  "/updatepopupimage",
  verifyAdminToken,
  multiDiffFileUpload(
    "public/popupimage",
    [
      {
        name: "image",
        maxCount: 1,
        allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
      },
      {
        name: "mobileimage",
        maxCount: 1,
        allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
      },
    ],
    "image"
  ),
  updatePopupImage
);

module.exports = router;
