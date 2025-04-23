const User = require("../../models/User");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");

const getalluser = async (req, res, next) => {
  try {
    const users = await User.find();
    const baseUrl = req.protocol + "://" + req.get("host") + "/userprofileimg/";
    const userData = users.map((user) => {
      return {
        ...user.toObject(),
        image: user.image ? baseUrl + user.image : null,
      };
    });
    successResponse(res, userData);
  } catch (error) {
    next(error);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    const { userid, status } = req.body;
    const user = await User.findById(userid);
    if (!user) {
      return queryErrorRelatedResponse(res, 404, "User not found");
    }
    user.status = status;

    await user.save();
    const data = {
      _id: user._id,
      name: user.name,
      email: user.email,
      status: user.status,
      image: user.image,
    };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getalluser, changeStatus };
