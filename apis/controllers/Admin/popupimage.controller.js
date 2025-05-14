const Popimage = require("../../models/Popimage");
const deleteFile = require("../../helper/deleteFiles");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const addPopupImage = async (req, res, next) => {
  try {
    const popupimage = await Popimage.create({
      image: req.files?.image[0]?.filename,
      mobileimage: req.files?.mobileimage[0]?.filename,
    });
    successResponse(res, popupimage);
  } catch (error) {
    next(error);
  }
};

const getPopupImage = async (req, res, next) => {
  try {
    const popupimage = await Popimage.findOne({});

    const baseUrl = process.env.BASE_URL + process.env.POPUP_IMAGE;
    popupimage.image = baseUrl + popupimage.image;
    popupimage.mobileimage = baseUrl + popupimage.mobileimage;

    successResponse(res, popupimage);
  } catch (error) {
    next(error);
  }
};

const updatePopupImage = async (req, res, next) => {
  try {
    const popupimage = await Popimage.findOne({ _id: req.body.id });
    if (!popupimage) {
      return queryErrorRelatedResponse(res, 404, "Popup image not found.");
    }
    if (req.files?.image && Array.isArray(req.files.image) && req.files.image[0]?.filename) {
      if (popupimage.image) {
        deleteFile(process.env.POPUP_IMAGE + popupimage.image);
      }
      popupimage.image = req.files?.image[0]?.filename;
    }
    if (req.files?.mobileimage && Array.isArray(req.files.mobileimage) && req.files.mobileimage[0]?.filename) {
      if (popupimage.mobileimage) {
        deleteFile(process.env.POPUP_IMAGE + popupimage.mobileimage);
      }
      popupimage.mobileimage = req.files?.mobileimage[0]?.filename;
    }
    if (req.body.status !== undefined) {
      popupimage.status = req.body.status === "true" || req.body.status === true;
    }
    await popupimage.save();
    successResponse(res, popupimage);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addPopupImage,
  getPopupImage,
  updatePopupImage,
};
