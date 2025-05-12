const Service = require("../../models/Service");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const deleteFiles = require("../../helper/deleteFiles");
const Addon = require("../../models/Addons");
const Order = require("../../models/Order");
const Review = require("../../models/Review");
const addService = async (req, res, next) => {
  try {
    const service = await Service.create({
      name: req.body.name,
      title: req.body.title,
      description: req.body.description,
      image: req?.files?.image[0]?.filename,
      price: req.body.price,
      time: req.body.time,
      include: req.body.include,
      whyChooseqImage: req?.files?.whyChooseqImage[0]?.filename,
      whyChooseqTitle: req.body.whyChooseqTitle,
      whyChooseqDescription: req.body.whyChooseqDescription,
      whyChooseqinclude: req.body.whyChooseqinclude,
      iconimage: req?.files?.iconimage[0]?.filename,
    });
    successResponse(res, service);
  } catch (error) {
    next(error);
  }
};

const editService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.body.id);
    if (!service) {
      return queryErrorRelatedResponse(res, 404, "Service not found");
    }
    service.name = req.body.name ? req.body.name : service.name;
    service.title = req.body.title ? req.body.title : service.title;
    service.description = req.body.description ? req.body.description : service.description;
    service.price = req.body.price ? req.body.price : service.price;
    service.time = req.body.time ? req.body.time : service.time;
    service.include = req.body.include ? req.body.include : service.include;
    service.whyChooseqTitle = req.body.whyChooseqTitle ? req.body.whyChooseqTitle : service.whyChooseqTitle;
    service.whyChooseqDescription = req.body.whyChooseqDescription
      ? req.body.whyChooseqDescription
      : service.whyChooseqDescription;
    service.whyChooseqinclude = req.body.whyChooseqinclude ? req.body.whyChooseqinclude : service.whyChooseqinclude;
    if (req.files?.image && req.files?.image[0]?.filename) {
      if (service.image) {
        deleteFiles(process.env.SERVICE_PATH + service.image);
      }
      service.image = req.files?.image[0]?.filename;
    }
    if (req.files?.whyChooseqImage && req.files?.whyChooseqImage[0]?.filename) {
      if (service.whyChooseqImage) {
        deleteFiles(process.env.SERVICE_PATH + service.whyChooseqImage);
      }
      service.whyChooseqImage = req.files?.whyChooseqImage[0]?.filename;
    }
    if (req.files?.iconimage && req.files?.iconimage[0]?.filename) {
      if (service.iconimage) {
        deleteFiles(process.env.SERVICE_PATH + service.iconimage);
      }
      service.iconimage = req.files?.iconimage[0]?.filename;
    }
    if (req.body.status !== undefined) {
      service.status = req.body.status === "true" || req.body.status === true;
    }
    await service.save();
    successResponse(res, service);
  } catch (error) {
    next(error);
  }
};
const getAllService = async (req, res, next) => {
  try {
    const service = await Service.find();
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.SERVICE_PATH;
    const serviceData = service.map((item) => {
      return {
        ...item.toObject(),
        image: item.image ? baseUrl + item.image : null,
        whyChooseqImage: item.whyChooseqImage ? baseUrl + item.whyChooseqImage : null,
        iconimage: item.iconimage ? baseUrl + item.iconimage : null,
      };
    });
    successResponse(res, serviceData);
  } catch (error) {
    next(error);
  }
};

const softDeleteService = async (req, res, next) => {
  try {
    const service = await Service.findOne({ _id: req.body.id });
    if (!service) {
      return queryErrorRelatedResponse(res, "Service not found");
    }
    const addons = await Addon.find({ serviceid: service._id });
    if (addons.length > 0) {
      await Promise.all(
        addons.map(async (addon) => {
          await Addon.softDelete(addon._id);
        })
      );
    }
    await Service.softDelete(req.body.id);
    successResponse(res, "Service deleted successfully");
  } catch (error) {
    next(error);
  }
};

const servicebyid = async (req, res, next) => {
  try {
    const service = await Service.findById(req.body.id);
    if (!service) {
      return queryErrorRelatedResponse(res, "Service not found");
    }
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.SERVICE_PATH;
    const serviceData = {
      ...service.toObject(),
      iconimage: service.iconimage ? baseUrl + service.iconimage : null,
      image: service.image ? baseUrl + service.image : null,
      whyChooseqImage: service.whyChooseqImage ? baseUrl + service.whyChooseqImage : null,
    };
    const addonBaseUrl = req.protocol + "://" + req.get("host") + process.env.ADDONS_PATH;

    const addon = await Addon.find({ serviceid: service._id });
    const addonData = addon.map((item) => {
      return {
        ...item.toObject(),
        image: item.image ? addonBaseUrl + item.image : null,
      };
    });

    const order = await Order.find({ service_id: service._id });
    const review = await Review.find({ service_id: service._id });
    serviceData.addon = addonData;
    serviceData.order = order;
    serviceData.review = review;

    successResponse(res, serviceData);
  } catch (error) {
    next(error);
  }
};

const deleteMultipleService = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return queryErrorRelatedResponse(res, 400, "Invalid or empty IDs array");
    }

    const services = await Service.find({ _id: { $in: ids } });
    if (services.length !== ids.length) {
      return queryErrorRelatedResponse(res, 404, "One or more services not found");
    }

    for (const service of services) {
      if (service.image) {
        deleteFiles(process.env.SERVICE_PATH + service.image);
      }
      if (service.whyChooseqImage) {
        deleteFiles(process.env.SERVICE_PATH + service.whyChooseqImage);
      }
      if (service.iconimage) {
        deleteFiles(process.env.SERVICE_PATH + service.iconimage);
      }

      // await Addon.deleteMany({ serviceid: service._id });
    }

    await Service.deleteMany({ _id: { $in: ids } });

    successResponse(res, "Multiple services deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addService,
  editService,
  getAllService,
  softDeleteService,
  servicebyid,
  deleteMultipleService,
};
