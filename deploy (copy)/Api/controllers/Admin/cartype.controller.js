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

module.exports = { addCartype, editCartype, getAllCartype, deleteCartype };
