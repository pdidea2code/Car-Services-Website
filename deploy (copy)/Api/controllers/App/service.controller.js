const {
  successResponse,
  queryErrorRelatedResponse,
} = require("../../helper/sendResponse");
const Service = require("../../models/Service");
const Addon = require("../../models/Addons");
const Cartype = require("../../models/Cartype");
const getAllService = async (req, res, next) => {
  try {
    const service = await Service.find({ status: true }).sort({
      createdAt: -1,
    });
    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.SERVICE_PATH;
    const serviceData = service.map((item) => {
      return {
        _id: item._id,
        name: item.name,
        title: item.title,
        description: item.description,
        price: item.price,
        time: item.time,
        image: item.image ? baseUrl + item.image : null,
        iconimage: item.iconimage ? baseUrl + item.iconimage : null,
      };
    });
    successResponse(res, serviceData);
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findOne({ _id: req.body.id, status: true });
    if (!service) {
      return queryErrorRelatedResponse(res, 404, "Service not found");
    }
    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.SERVICE_PATH;
    const serviceData = {
      ...service.toObject(),
      whyChooseqImage: service.whyChooseqImage
        ? baseUrl + service.whyChooseqImage
        : null,
      image: service.image ? baseUrl + service.image : null,
      iconimage: service.iconimage ? baseUrl + service.iconimage : null,
    };
    successResponse(res, serviceData);
  } catch (error) {
    next(error);
  }
};

const getAddonbyService = async (req, res, next) => {
  try {
    const addon = await Addon.find({
      serviceid: req.body.serviceid,
      status: true,
    });
    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.ADDONS_PATH;
    const addonData = addon.map((item) => {
      return {
        ...item.toObject(),
        image: item.image ? baseUrl + item.image : null,
      };
    });
    successResponse(res, addonData);
  } catch (error) {
    next(error);
  }
};

const getCarType = async (req, res, next) => {
  try {
    const carType = await Cartype.find({ status: true });
    successResponse(res, carType);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllService,
  getServiceById,
  getAddonbyService,
  getCarType,
};
