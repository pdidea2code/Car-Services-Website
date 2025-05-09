const Admin = require("../../models/Admin");
const { queryErrorRelatedResponse, successResponse } = require("../../helper/sendResponse");
const jwt = require("jsonwebtoken");

const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const admin = await Admin.create({ name, email, password });
    successResponse(res, "Admin created successfully");
  } catch (error) {
    next(error);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return queryErrorRelatedResponse(res, 401, "Admin not found");
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return queryErrorRelatedResponse(res, 401, "Invalid password");
    }

    const token = await admin.generateAuthToken({ email: admin.email });
    const refreshToken = await admin.generateRefreshToken({
      email: admin.email,
    });
    admin.token = token;
    await admin.save();

    successResponse(res, { token, refreshToken, admin });
  } catch (error) {
    next(error);
  }
};

const RefreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return queryErrorRelatedResponse(res, 401, "Access Denied. No refresh token provided");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const admin = await Admin.findOne({ email: decoded.email });
    if (!admin) {
      return queryErrorRelatedResponse(res, 401, "Invalid Admin!");
    }

    const accessToken = admin.generateAuthToken({ email: admin.email });
    admin.token = accessToken;
    await admin.save();

    successResponse(res, accessToken);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { password, newPassword, confirmPassword } = req.body;

    const admin = await Admin.findById(req.admin._id);
    if (!admin) return queryErrorRelatedResponse(res, 401, "Admin not found. Please try again.");

    const verifyPassword = await admin.comparePassword(password);
    if (!verifyPassword) return queryErrorRelatedResponse(res, 401, "Incorrect current password. Please try again.");

    if (newPassword !== confirmPassword) {
      return queryErrorRelatedResponse(
        res,
        404,
        "New password and confirm password do not match. Please check and try again."
      );
    }

    admin.password = newPassword;

    await admin.save();
    successResponse(res, "Your password has been successfully updated!");
  } catch (error) {
    next(error);
  }
};

module.exports = { createAdmin, loginAdmin, RefreshToken, changePassword };
