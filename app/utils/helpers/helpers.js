const bCrypt = require("bcrypt-nodejs");
const _ = require("lodash");
const { isEmpty, isString } = require("../validator");

/**
 * @param {Object} res // admin
 * @param {String} status ok | error
 * @param {String} msg Response message
 * @param {Object|Array} payload Array or Object
 * @param {Object} other This can be other object that user wants to add
 */
exports.createResponse = (res, status, message, payload, statusCode) => {
  if (status) statusCode = 200;
  else statusCode = statusCode || 400;
  res.json({
    status,
    message,
    data: payload,
    statusCode,
  });
};

exports.getKeyByValue = (object, value) => {
  try {
    return Object.keys(object).find((key) => object[key] === value);
  } catch (err) {
    console.log("getKeyByValuelog err?.message:::", err?.message);
  }
};

/**
 * @param {Object} res
 * @param {Object} error
 * @param {Object} options
 */
exports.createError = (res, error) => {
  const message =
    (error && error.message) ||
    (isString(error) && error) ||
    "Internal Server Error";
  const stackTrace = error || message;

  console.error("ERROR:", message, stackTrace);

  res.locals.errorStr = message;

  res.status(500).json({
    status: false,
    statusCode: 500,
    message,
  });
};

/**
 * @param {Object} res
 * @param {String} message
 * @param {Object} options
 */
exports.createServiceUnavailableError = (res, message, options = undefined) => {
  if (!options) options = {};
  if (!options.other) options.other = {};

  console.error("Service unavailable error:", message);

  return res.status(503).json({
    status: "error",
    message,
    ...options.other,
  });
};

/**
 * @param {Object} res
 * @param {Object} errors
 */
exports.createValidationResponse = (res, errors) =>
  res.status(400).json({
    status: "error",
    message: errors[Object.keys(errors)[0]],
    errors: {
      ...errors,
    },
  });

/**
 * @description Generate Hashed password
 * @param {String} password
 */
exports.generateHash = (password) =>
  bCrypt.hashSync(password, bCrypt.genSaltSync(8));

/**
 * @descs Compare encrypted passwords
 * @param {*} userpass
 * @param {*} password
 */
exports.comparePassword = (password, DbPassword) =>
  bCrypt.compareSync(password, DbPassword);

/**
 * @description Get Array From String
 * @param {String} str
 */
exports.arrayFromString = (str) => {
  const newStr = str.slice(2, str.length - 2);
  const replacedStr = newStr.replace(/“|”|"/g, "");
  const array = replacedStr.split(",").map(String);
  return array;
};

/**
 * @description Convert String to Object Key
 * @param {String} str
 */
exports.stringToKey = (str) => {
  const newStr = str.replace(/ /g, "_");
  return newStr;
};

/**
 * @description Create valid Object Key
 * @param {String} str
 */
exports.createValidKey = (str) => {
  const newStr = str.replace(/-| |_/g, "_");
  return newStr;
};

/**
 * @description Get Default sort Order
 * @param sortOrder
 */
exports.getDefaultSortOrder = (sortOrder) => {
  const order =
    !isEmpty(sortOrder) && ["ASC", "DESC"].indexOf(sortOrder) !== -1
      ? sortOrder
      : "DESC";
  return order;
};

/**
 * @description encode string to base64 string
 * @param data string
 */
exports.encodingToBase64 = (data) => {
  if (!data) return data;
  const buff = new Buffer.from(data);
  return buff.toString("base64");
};

/**
 * @description decode base64 to string
 * @param data base64 string
 */
exports.decodeBase64ToString = (data) => {
  if (!data) return data;
  const buff = new Buffer.from(data, "base64");
  return buff.toString("utf8");
};

exports.isEmail = (value) => {
  // eslint-disable-next-line max-len
  const myRegEx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValid = myRegEx.test(value);
  return !!isValid;
};
