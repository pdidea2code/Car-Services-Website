const {
  queryErrorRelatedResponse,
  successResponse,
} = require("../../helper/sendResponse");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendMail } = require("../../helper/emailSender");
const User = require("../../models/User");
require("dotenv").config();
const AppSetting = require("../../models/AppSetting");
const deleteFiles = require("../../helper/deleteFiles");

const Register = async (req, res, next) => {
  try {
    const { name, email, password, confpassword } = req.body;
    // if (!name || !email || !password || !confpassword) {
    //   return queryErrorRelatedResponse(res, 400, "All fields are required");
    // }
    if (password !== confpassword) {
      return queryErrorRelatedResponse(
        res,
        400,
        "The passwords you entered do not match. Please try again."
      );
    }
    const alreadyUser = await User.findOne({ email });

    if (alreadyUser && alreadyUser.isverified) {
      return queryErrorRelatedResponse(
        res,
        400,
        "This user is already registered. Try another."
      );
    }
    if (alreadyUser && !alreadyUser.isverified) {
      if (alreadyUser.status === false)
        return queryErrorRelatedResponse(
          res,
          401,
          "User is blocked please contact admin"
        );
      const appSetting = await AppSetting.findOne({});
      const otp = crypto.randomInt(1000, 9999);
      const otpExpiry = Date.now() + 1 * 60 * 1000; //otp expire in two minute

      const mail = await sendMail(
        {
          from: appSetting.smtp_mail,
          to: email,
          sub: "Car Auto Wash - Verify Email",
          htmlFile: "./emailTemplate/registationotp.html",
          extraData: {
            otp: otp,
          },
        },
        req,
        res
      );
      alreadyUser.name = name;
      alreadyUser.password = password;
      alreadyUser.otp = otp;
      alreadyUser.otp_expiry = otpExpiry;
      alreadyUser.isverified = false;
      await alreadyUser.save();
      return 1;
    }
    const appSetting = await AppSetting.findOne({});
    const otp = crypto.randomInt(1000, 9999);
    const otpExpiry = Date.now() + 1 * 60 * 1000; //otp expire in two minute

    const mail = await sendMail(
      {
        from: appSetting.smtp_mail,
        to: email,
        sub: "Car Auto Wash - Verify Email",
        htmlFile: "./emailTemplate/registationotp.html",
        extraData: {
          otp: otp,
        },
      },
      req,
      res
    );
    const user = await User.create({
      name,
      email,
      password,
      otp,
      otp_expiry: otpExpiry,
    });
    // successResponse(res, "User registered successfully");
    return 1;
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return queryErrorRelatedResponse(res, 401, "Invalid User");
    if (user.status === false)
      return queryErrorRelatedResponse(
        res,
        401,
        "User is blocked please contact admin"
      );
    if (user.otp_expiry < Date.now())
      return queryErrorRelatedResponse(res, 401, "OTP expired");

    if (user.otp !== otp)
      return queryErrorRelatedResponse(res, 401, "Invalid OTP");
    user.otp_expiry = null;
    user.otp = null;
    user.isverified = true;
    const token = user.generateAuthToken({
      id: user._id,
      email: user.email,
      name: user.name,
    });
    const refreshToken = user.generateRefreshToken({
      id: user._id,
      email: user.email,
      name: user.name,
    });
    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.USER_PROFILE_PATH;
    user.token = token;
    const data = {
      token: token,
      refreshToken: refreshToken,
      user: {
        email: user.email,
        name: user.name,
        phone_number: user?.phone_number || null,
        status: user.status,
        image: user?.image ? baseUrl + user.image : null,
      },
    };
    await user.save();

    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return queryErrorRelatedResponse(res, 401, "Invalid User");
    if (user.status === false)
      return queryErrorRelatedResponse(
        res,
        401,
        "User is blocked please contact admin"
      );
    if (!user.isverified)
      return queryErrorRelatedResponse(
        res,
        401,
        "Email not verified go to Register"
      );
    if (!user.password)
      return queryErrorRelatedResponse(res, 401, "Password not set");
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return queryErrorRelatedResponse(res, 401, "Invalid Password");
    const token = user.generateAuthToken({
      id: user._id,
      email: user.email,
      name: user.name,
    });
    const refreshToken = user.generateRefreshToken({
      id: user._id,
      email: user.email,
      name: user.name,
    });
    user.token = token;
    await user.save();
    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.USER_PROFILE_PATH;
    const data = {
      token: token,
      refreshToken: refreshToken,
      user: {
        email: user.email,
        name: user.name,

        status: user.status,
        phone_number: user?.phone_number || null,
        image: user?.image ? baseUrl + user.image : null,
      },
    };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const socialLogin = async (req, res, next) => {
  try {
    const { email, name, social_id, image } = req.body;
    if (!email) {
      return queryErrorRelatedResponse(res, 400, "Email is required");
    }
    const user = await User.findOne({
      email: email,
      google_id: social_id,
    });

    if (user && user.status === false) {
      return queryErrorRelatedResponse(
        res,
        400,
        "Your account is not active. Please contact the administrator."
      );
    }
    if (!user) {
      const emailExist = await User.findOne({ email: email });
      if (emailExist) {
        return queryErrorRelatedResponse(res, 400, "Email already exists");
      }
      const newUser = await User.create({
        email: email,
        name: name,
        google_id: social_id,
        // image: image,
        isverified: true,
      });
      const token = newUser.generateAuthToken({
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      });
      const refreshToken = newUser.generateRefreshToken({
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      });

      const data = {
        token: token,
        refreshToken: refreshToken,
        user: {
          email: newUser.email,
          name: newUser.name,

          id: newUser._id,
          phone_number: newUser?.phone_number || null,
        },
      };

      return successResponse(res, data);
    }

    await user.save();
    const token = user.generateAuthToken({
      id: user._id,
      email: user.email,
      name: user.name,
    });
    const refreshToken = user.generateRefreshToken({
      id: user._id,
      email: user.email,
      name: user.name,
    });
    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.USER_PROFILE_PATH;
    const data = {
      token: token,
      refreshToken: refreshToken,
      user: {
        email: user.email,
        name: user.name,
        image: user?.image ? baseUrl + user.image : null,
        id: user._id,
        phone_number: user?.phone_number || null,
      },
    };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const checkEmailId = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    const appSetting = await AppSetting.findOne({});
    if (!user) return queryErrorRelatedResponse(res, 401, "Invalid User");
    if (user.status === false)
      return queryErrorRelatedResponse(
        res,
        401,
        "User is blocked please contact admin"
      );
    if (user.isverified === false)
      return queryErrorRelatedResponse(
        res,
        401,
        "Email not verified go to Register"
      );

    const otp = crypto.randomInt(1000, 9999);
    const otpExpiry = Date.now() + 1 * 60 * 1000; //otp expire in one minute
    const mail = await sendMail(
      {
        from: appSetting.smtp_mail,
        to: email,
        sub: "Car Auto Wash - Forgot Password",
        htmlFile: "./emailTemplate/forgotPass.html",
        extraData: {
          otp: otp,
        },
      },
      req,
      res
    );
    user.otp = otp;
    user.otp_expiry = otpExpiry;
    await user.save();
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return queryErrorRelatedResponse(res, 401, "Invalid User");
    if (user.status === false)
      return queryErrorRelatedResponse(
        res,
        401,
        "User is blocked please contact admin"
      );
    if (user.isverified === false)
      return queryErrorRelatedResponse(
        res,
        401,
        "Email not verified go to Register"
      );
    if (user.otp_expiry < Date.now())
      return queryErrorRelatedResponse(res, 401, "OTP expired");
    if (user.otp !== otp)
      return queryErrorRelatedResponse(res, 401, "Invalid OTP");
    user.otp_expiry = null;
    await user.save();
    successResponse(res, "OTP verified successfully");
  } catch (error) {
    next(error);
  }
};

const ForgotPassword = async (req, res, next) => {
  try {
    const { email, password, confpassword, otp } = req.body;
    if (password !== confpassword) {
      return queryErrorRelatedResponse(
        res,
        400,
        "The passwords you entered do not match. Please try again."
      );
    }
    const user = await User.findOne({ email });
    if (user.status === false)
      return queryErrorRelatedResponse(
        res,
        401,
        "User is blocked please contact admin"
      );
    if (user.isverified === false)
      return queryErrorRelatedResponse(
        res,
        401,
        "Email not verified go to Register"
      );
    if (!user) return queryErrorRelatedResponse(res, 401, "Invalid User");
    if (user.otp !== otp)
      return queryErrorRelatedResponse(res, 401, "Invalid OTP");
    user.otp_expiry = null;
    user.otp = null;
    user.password = password;
    await user.save();
    successResponse(res, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};

const editProfile = async (req, res, next) => {
  try {
    const { name, phone_number } = req.body;
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return queryErrorRelatedResponse(res, 401, "Invalid User");
    if (user.status === false)
      return queryErrorRelatedResponse(
        res,
        401,
        "User is blocked please contact admin"
      );
    if (user.isverified === false)
      return queryErrorRelatedResponse(
        res,
        401,
        "Email not verified go to Register"
      );
    if (name) user.name = name;
    if (req.file && req.file.filename) {
      const oldImage = user.image;
      deleteFiles(process.env.USER_PROFILE_PATH + oldImage);
      user.image = req.file.filename;
    }
    if (phone_number) user.phone_number = phone_number;
    const token = user.generateAuthToken({
      id: user._id,
      email: user.email,
      name: user.name,
    });
    const refreshToken = user.generateRefreshToken({
      id: user._id,
      email: user.email,
      name: user.name,
    });
    user.token = token;
    await user.save();
    const baseUrl = req.protocol + "://" + req.get("host") + "/userprofileimg/";
    const data = {
      token: token,
      refreshToken: refreshToken,
      user: {
        email: user.email,
        name: user.name,
        id: user._id,
        status: user.status,
        image: user?.image ? baseUrl + user.image : null,
        phone_number: user?.phone_number || null,
      },
    };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return queryErrorRelatedResponse(res, 401, "Invalid User");
    if (user.status === false)
      return queryErrorRelatedResponse(
        res,
        401,
        "User is blocked please contact admin"
      );
    const baseUrl = req.protocol + "://" + req.get("host") + "/userprofileimg/";
    const data = {
      user: {
        email: user.email,
        name: user.name,
        status: user.status,
        image: user?.image ? baseUrl + user.image : null,
        phone_number: user?.phone_number || null,
      },
    };
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  Register,
  verifyEmail,
  login,
  checkEmailId,
  verifyOtp,
  ForgotPassword,
  editProfile,
  socialLogin,
  getProfile,
};
