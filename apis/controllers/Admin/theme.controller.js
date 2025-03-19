const AdminTheme = require("../../models/AdminTheme");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");

const getAdminTheme = async (req, res, next) => {
  try {
    const adminTheme = await AdminTheme.findOne({});
    successResponse(res, adminTheme);
  } catch (error) {
    next(error);
  }
};

const addAdminTheme = async (req, res, next) => {
  try {
    const adminTheme = await AdminTheme.create({
        color1:req.body.color1,
        color2:req.body.color2,
        color3:req.body.color3,
    });
    successResponse(res, adminTheme);
  } catch (error) {
    next(error);
  }
};
const editAdminTheme = async (req, res, next) => {
  try {
    const adminTheme = await AdminTheme.findOne({});
    if (!adminTheme) {
      return queryErrorRelatedResponse(res, 404, "Admin theme not found");
    }
    adminTheme.color1 = req.body.color1 ? req.body.color1 : adminTheme.color1;
    adminTheme.color2 = req.body.color2 ? req.body.color2 : adminTheme.color2;
    adminTheme.color3 = req.body.color3 ? req.body.color3 : adminTheme.color3;
    
    await adminTheme.save();
    successResponse(res, adminTheme);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminTheme, editAdminTheme, addAdminTheme }; 