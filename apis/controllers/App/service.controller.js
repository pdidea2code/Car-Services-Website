const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Service = require("../../models/Service");
const getAllService = async (req, res, next) => {
  try {
    const service = await Service.find({status: true});
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.SERVICE_PATH;
    const serviceData = service.map((item) => {
      return {
        _id: item._id,
        name:item.name,
        title: item.title,
        description: item.description,
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
    const service = await Service.findOne({_id: req.body.id, status: true});
    if (!service) {
      return queryErrorRelatedResponse(res, 404, "Service not found");
    }
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.SERVICE_PATH;
    const serviceData = {
      ...service.toObject(),
      whyChooseqImage: service.whyChooseqImage ? baseUrl + service.whyChooseqImage : null,
      image: service.image ? baseUrl + service.image : null,
      iconimage: service.iconimage ? baseUrl + service.iconimage : null,
    };
    successResponse(res, serviceData);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllService, getServiceById };   