const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config/env");

const { createError, createResponse } = require("../utils/helpers");

module.exports.auth = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");

    if (!jwtToken) {
      return createError(res, { message: "Not Authorized!" });
    }
    const payload = jwt.verify(jwtToken, config.SECRET_JWT);
    const adminData = await User.findById(payload.user);

    if (!adminData) return createError(res, { message: "Not Authorized!" });

    req.user = {
      id: adminData._id,
    };
    next();
  } catch (err) {
    return createError(res, err);
  }
};

module.exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.header("refreshToken");

    if (!token) {
      return createError(res, { message: "Not Authorized!" });
    }

    const payload = jwt.verify(token, config.SECRET_JWT);

    const userData = await User.findById(payload.user);

    if (!userData) return createError(res, { message: "Not Authorized!" });

    req.user = {
      id: userData._id,
    };
    next();
  } catch (err) {
    return { status: false, message: "Not Authorized! Invalid token" };
  }
};
