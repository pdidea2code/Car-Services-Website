const Address = require("../../models/Address");
const { successResponse } = require("../../helper/sendResponse");
const Content = require("../../models/Contect");
const getAddress = async (req, res, next) => {
  try {
    const address = await Address.find({ status: true });
    successResponse(res, address);
  } catch (error) {
    next(error);
  }
};

const addContent = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    const content = await Content.create({ name, email, message });
    successResponse(res, content);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAddress,
  addContent,
};
