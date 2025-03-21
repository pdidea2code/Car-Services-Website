const BusinessHour = require("../../models/BusinessHour");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");

const createBusinessHour = async (req, res, next) => {
  try {

    const { day, open, close, is_closed, duration } = req.body;

    const businessHour = await BusinessHour.create({ day, open, close, is_closed, duration });

    successResponse(res, "Business hour created successfully");
  } catch (error) {
    next(error);
  }
};

const getAllBusinessHour = async (req, res, next) => {
  try {
    const businessHour = await BusinessHour.find();

    successResponse(res, businessHour);
  } catch (error) {
    next(error);
  }
};

const updateBusinessHour = async (req, res, next) => {  
  try {
  
    const { day, open, close, is_closed, duration } = req.body;
    
    const businessHour = await BusinessHour.findOne({_id: req.body.id});
    if (!businessHour) {
      return queryErrorRelatedResponse(res, 404, "Business hour not found");
    }
    businessHour.day = day?day:businessHour.day;
    businessHour.open = open?open:businessHour.open;
    businessHour.close = close?close:businessHour.close;
    businessHour.is_closed = is_closed?is_closed:businessHour.is_closed;
    businessHour.duration = duration?duration:businessHour.duration;
    await businessHour.save();
    successResponse(res, "Business hour updated successfully", businessHour);
  } catch (error) {
    next(error);
  }
};

const deleteBusinessHour = async (req, res, next) => {
  try {
    const businessHour = await BusinessHour.findOne({_id: req.body.id});
    if (!businessHour) {
      return queryErrorRelatedResponse(res, 404, "Business hour not found");
    }   
    await businessHour.deleteOne();
    successResponse(res, "Business hour deleted successfully");
  } catch (error) {
    next(error);
  }
};
module.exports = { createBusinessHour, getAllBusinessHour, updateBusinessHour, deleteBusinessHour };
