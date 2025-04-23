const Content = require("../../models/Contect");
const {
  successResponse,
  queryErrorRelatedResponse,
} = require("../../helper/sendResponse");

const getContent = async (req, res, next) => {
  try {
    const content = await Content.find().sort({ createdAt: -1 });
    successResponse(res, content);
  } catch (error) {
    next(error);
  }
};

const updateContent = async (req, res, next) => {
  try {
    const { id, status } = req.body;

    const content = await Content.findOne({ _id: id });
    if (!content) {
      return queryErrorRelatedResponse(res, 404, "Content not found");
    }
    if (status !== undefined) {
      content.seen = status === "true" || status === true;
    }
    await content.save();
    successResponse(res, content);
  } catch (error) {
    next(error);
  }
};
const deleteContent = async (req, res, next) => {
  try {
    const { id } = req.body;
    const content = await Content.findOne({ _id: id });
    if (!content) {
      return queryErrorRelatedResponse(res, 404, "Content not found");
    }
    await content.deleteOne();
    successResponse(res, "Content deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { getContent, deleteContent, updateContent };
