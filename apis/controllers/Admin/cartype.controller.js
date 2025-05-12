const Cartype = require("../../models/Cartype");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");

const addCartype = async (req, res, next) => {
  try {
    const { name } = req.body;
    const cartype = await Cartype.create({ name });
    successResponse(res, cartype);
  } catch (error) {
    next(error);
  }
};

const editCartype = async (req, res, next) => {
  try {
    const { id, name } = req.body;
    const cartype = await Cartype.findById(id);
    if (!cartype) {
      return queryErrorRelatedResponse(res, 404, "Cartype not found");
    }
    cartype.name = name ? name : cartype.name;
    if (req.body.status !== undefined) {
      cartype.status = req.body.status === "true" || req.body.status === true;
    }
    await cartype.save();
    successResponse(res, cartype);
  } catch (error) {
    next(error);
  }
};

const getAllCartype = async (req, res, next) => {
  try {
    const cartype = await Cartype.find();
    successResponse(res, cartype);
  } catch (error) {
    next(error);
  }
};

const deleteCartype = async (req, res, next) => {
  try {
    const { id } = req.body;
    const cartype = await Cartype.findById(id);
    if (!cartype) {
      return queryErrorRelatedResponse(res, 404, "Cartype not found");
    }
    await Cartype.deleteOne({ _id: id });
    successResponse(res, "Cartype deleted successfully");
  } catch (error) {
    next(error);
  }
};

const deleteMultipleCartype = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return queryErrorRelatedResponse(res, 400, "Invalid or empty IDs array");
    }

    const cartypes = await Cartype.find({ _id: { $in: ids } });
    if (cartypes.length !== ids.length) {
      return queryErrorRelatedResponse(res, 404, "One or more cartypes not found");
    }

    await Cartype.deleteMany({ _id: { $in: ids } });

    successResponse(res, "Multiple cartypes deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { addCartype, editCartype, getAllCartype, deleteCartype, deleteMultipleCartype };
