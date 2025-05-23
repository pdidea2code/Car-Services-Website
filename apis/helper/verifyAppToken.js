const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { queryErrorRelatedResponse } = require("./sendResponse");

module.exports = async function (req, res, next) {
  let token = req.header("Authorization");

  if (token) {
    token = req.header("Authorization").replace("Bearer ", "");
  }
  if (!token) return queryErrorRelatedResponse(res, 402, "Access Denied.");
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let user = await User.findOne({ _id: verified._id });
    if (!user) {
      return queryErrorRelatedResponse(res, 402, "Access Denied.");
    }
    if (user.status === false) {
      return queryErrorRelatedResponse(
        res,
        403,
        "User is blocked please contact admin"
      );
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    queryErrorRelatedResponse(res, 402, "Invalid Token.");
  }
};
