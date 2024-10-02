//importing Validator package
const Validator = require("validator");
//importing contants
var constMessage = require("../constants");

module.exports.validateSpace = async (data) => {
  const isEmpty = (value) =>
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0);
  module.exports = isEmpty;
  var json = data;
  var errors = {};

  data.space = !isEmpty(data.space) ? data.space : "";

  if (!data.space) {
    errors.message = constMessage.SPACE_IS_REQUIRED;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  return {
    errors,
    isValid: true,
  };
};

module.exports.validateGameDetail = async (data) => {
  const isEmpty = (value) =>
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0);
  module.exports = isEmpty;
  var json = data;
  var errors = {};

  if (!data) {
    errors.message = constMessage.DATA_NOT_PROVIDED;
    errors.statusCode = constMessage.STATUS_CODE_400;
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }

  data.name = !isEmpty(data.name) ? data.name : "";
  data.plateform = !isEmpty(data.plateform) ? data.plateform : "";
  // data.bundleId = !isEmpty(data.bundleId) ? data.bundleId : "";

  if (!data.name) {
    errors.message = constMessage.Name;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.plateform) {
    errors.message = constMessage.PLATEFORM;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }

  return {
    errors,
    isValid: true,
  };
};

module.exports.validateSendNotification = async (data) => {
  const isEmpty = (value) =>
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0);
  module.exports = isEmpty;
  var json = data;
  var errors = {};

  if (!data) {
    errors.message = constMessage.DATA_NOT_PROVIDED;
    errors.statusCode = constMessage.STATUS_CODE_400;
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }

  data.id = !isEmpty(data.id) ? data.id : "";

  if (!data.id) {
    errors.message = constMessage.id;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  return {
    errors,
    isValid: true,
  };
};

module.exports.validateSendNotificationToVendors = async (data) => {
  const isEmpty = (value) =>
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0);
  module.exports = isEmpty;
  var json = data;
  var errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.message = !isEmpty(data.message) ? data.message : "";

  if (!data.title) {
    errors.message = constMessage.TITLE;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.message) {
    errors.message = constMessage.MESSAGE;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  return {
    errors,
    isValid: true,
  };
};
