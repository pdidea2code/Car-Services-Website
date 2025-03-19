const Addons = require("../../models/Addons");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const deleteFiles = require("../../helper/deleteFiles");
const Service = require("../../models/Service");
const addAddons = async (req, res, next) => {
  try {
    const addons = await Addons.create({
      name: req.body.name,
      image: req?.file?.filename,
      serviceid: req.body.serviceid,
      price: req.body.price,
      time: req.body.time,
    });
    successResponse(res, addons);
  } catch (error) {
    next(error);
  }
};

const editAddons = async (req, res, next) => {
  try {
    const { id } = req.body;
  
    const addons = await Addons.findOne({ _id: id });
    if (!addons) {
      return queryErrorRelatedResponse(res, 404, "Addons not found");
    }
    addons.name = req.body.name ? req.body.name : addons.name;
   
    addons.serviceid = req.body.serviceid ? req.body.serviceid : addons.serviceid;
    addons.price = req.body.price ? req.body.price : addons.price;
    addons.name = req.body.name ? req.body.name : addons.name;
    if (req.file && req.file.filename) {
      
      if (addons.image) {
        deleteFiles(process.env.ADDONS_PATH + addons.image);
      }
      addons.image = req.file.filename;
    }
    addons.serviceid = req.body.serviceid ? req.body.serviceid : addons.serviceid;
    addons.price = req.body.price ? req.body.price : addons.price;
    addons.time = req.body.time ? req.body.time : addons.time;
    if (req.body.status !== undefined) {
      addons.status = req.body.status === "true" || req.body.status === true;
    }
    await addons.save();
    successResponse(res, addons);
  } catch (error) {
    next(error);
  }
};

const getAllAddons = async (req, res, next) => {
  try {
    const addons = await Addons.find().populate("serviceid");
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.ADDONS_PATH;
    const addonsData = addons.map((addon) => {
      return {
        ...addon.toObject(),
        image: baseUrl + addon.image,
        servicename: addon.serviceid.name,
      };
    });
    successResponse(res, addonsData);
  } catch (error) {
    next(error);
  }
};

const deleteAddons = async (req, res, next) => {
  try {
    const { id } = req.body;
    const addons = await Addons.findOne({ _id: id });
    if (!addons) {
      return queryErrorRelatedResponse(res, 404, "Addons not found");
    }
    deleteFiles(process.env.ADDONS_PATH + addons.image);
    await addons.deleteOne();
    successResponse(res, "Addons deleted successfully");
  } catch (error) {
    next(error);
  }
};

const getAddonsbyService = async (req, res, next) => {
  try {
    const addons = await Addons.find({ serviceid: req.body.serviceid }).populate("serviceid");
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.ADDONS_PATH;
    const addonsData = addons.map((addon) => {
      return {
        ...addon.toObject(),
        image: baseUrl + addon.image,
        servicename: addon.serviceid.name,  
      };
    });

    successResponse(res, addonsData);
  } catch (error) {
    next(error);
  }
};
module.exports = { addAddons, editAddons, getAllAddons, deleteAddons, getAddonsbyService };
