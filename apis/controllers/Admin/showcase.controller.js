const Showcase = require("../../models/Showcase");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const deleteFiles = require("../../helper/deleteFiles");

const addShowcase = async (req, res, next) => {
  try {
    const showcase = await Showcase.create({
      image: req.file ? req.file.filename : null,
    });
    successResponse(res, showcase);
  } catch (error) {
    next(error);
  }
};

const editShowcase = async (req, res, next) => {
  try {
    const { id } = req.body;
    const showcase = await Showcase.findById(id);
    if (!showcase) {
      return queryErrorRelatedResponse(res, 404, "Showcase not found");
    }
    if (req.file && req.file.filename) {
      if (showcase.image) {
        deleteFiles(process.env.SHOWCASE_PATH + showcase.image);
      }
      showcase.image = req.file.filename;
    }

    if (req.body.status !== undefined) {
      showcase.status = req.body.status === "true" || req.body.status === true;
    }
    await showcase.save();
    successResponse(res, showcase);
  } catch (error) {
    next(error);
  }
};

const getAllShowcase = async (req, res, next) => {
  try {
    const showcase = await Showcase.find();
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.SHOWCASE_PATH;
    const showcaseData = showcase.map((item) => {
      return {
        ...item.toObject(),
        image: item.image ? baseUrl + item.image : null,
      };
    });
    successResponse(res, showcaseData);
  } catch (error) {
    next(error);
  }
};

const deleteShowcase = async (req, res, next) => {
  try {
    const { id } = req.body;
    const showcase = await Showcase.findById(id);
    if (!showcase) {
      return queryErrorRelatedResponse(res, 404, "Showcase not found");
    }
    if (showcase.image) {
      deleteFiles(process.env.SHOWCASE_PATH + showcase.image);
    }
    await Showcase.findByIdAndDelete(id);
    successResponse(res, "Showcase deleted successfully");
  } catch (error) {
    next(error);
  }
};

const deleteMultipleShowcase = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return queryErrorRelatedResponse(res, 400, "Invalid or empty IDs array");
    }

    const showcases = await Showcase.find({ _id: { $in: ids } });
    if (showcases.length !== ids.length) {
      return queryErrorRelatedResponse(res, 404, "One or more showcases not found");
    }

    showcases.forEach((showcase) => {
      if (showcase.image) {
        deleteFiles(process.env.SHOWCASE_PATH + showcase.image);
      }
    });

    await Showcase.deleteMany({ _id: { $in: ids } });

    successResponse(res, "Multiple showcases deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { addShowcase, editShowcase, getAllShowcase, deleteShowcase, deleteMultipleShowcase };
