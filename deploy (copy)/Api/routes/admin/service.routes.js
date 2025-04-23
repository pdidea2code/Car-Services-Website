const router = require("express").Router();
const {
  addService,
  editService,
  getAllService,
  softDeleteService,
  servicebyid,
} = require("../../controllers/Admin/service.controller");
const { multiDiffFileUpload } = require("../../helper/imageUpload");
const verifyAdminToken = require("../../helper/verifyAdminToken");
router.post(
  "/addservice",
  verifyAdminToken,
  multiDiffFileUpload("public/serviceimg/", [
    {
      name: "image",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
    {
      name: "iconimage",
      maxCount: 1,
      allowedMimes: ["image/svg", "image/svg+xml"],
    },
    {
      name: "whyChooseqImage",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
  ]),
  addService
);
router.post(
  "/editservice",
  verifyAdminToken,
  multiDiffFileUpload("public/serviceimg/", [
    {
      name: "image",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
    {
      name: "iconimage",
      maxCount: 1,
      allowedMimes: ["image/svg", "image/svg+xml"],
    },
    {
      name: "whyChooseqImage",
      maxCount: 1,
      allowedMimes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    },
  ]),
  editService
);
router.get("/allservice", verifyAdminToken, getAllService);
router.post("/softdeleteservice", verifyAdminToken, softDeleteService);
router.post("/servicebyid", verifyAdminToken, servicebyid);
module.exports = router;
