//importing Validator package
const Validator = require("validator");
//importing contants
var constMessage = require("../constants");

module.exports.validateUser = async (data) => {
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
  data.role = !isEmpty(data.role) ? data.role : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";

  if (!data.name) {
    errors.message = constMessage.Name;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.role) {
    errors.message = constMessage.Role;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.password) {
    errors.message = constMessage.Password;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (data.password) {
    const regex = /(?=.*\d)/g;
    const re = /^(?=.*\d)/g;
    const found = data.password.match(regex);
    if (found == null) {
      errors.message = constMessage.PasswordTwo;
      errors.statusCode = constMessage.STATUS_CODE_400;
      errors.data = [];
      return {
        errors,
        isValid: isEmpty(errors),
      };
    }
    var num = parseInt(data.password.toString().length);
    if (num < 8) {
      errors.message = constMessage.PasswordTwos;
      errors.statusCode = constMessage.STATUS_CODE_400;
      errors.data = [];
      return {
        errors,
        isValid: isEmpty(errors),
      };
    }
  }
  if (data.phone) {
    const regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
    const found = data.password.match(regex);

    console.log("found------------------------ ", data.phone.length);
  }
  if (!data.email) {
    errors.message = constMessage.Email;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.phone) {
    errors.message = constMessage.Phone;
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
module.exports.validateContactUs = async (data) => {
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
  data.subject = !isEmpty(data.subject) ? data.subject : "";
  data.message = !isEmpty(data.message) ? data.message : "";
  data.email = !isEmpty(data.email) ? data.email : "";

  if (!data.name) {
    errors.message = constMessage.Name;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.subject) {
    errors.message = constMessage.Role;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.message) {
    errors.message = constMessage.Password;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }

  if (!data.email) {
    errors.message = constMessage.Email;
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
module.exports.validateUserEmail = async (data) => {
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
  data.password = !isEmpty(data.password) ? data.password : "";
  data.email = !isEmpty(data.email) ? data.email : "";

  if (!data.password) {
    errors.message = constMessage.Password;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (data.password) {
    const regex = /(?=.*\d)/g;
    const re = /^(?=.*\d)/g;
    const found = data.password.match(regex);
    if (found == null) {
      errors.message = constMessage.PasswordTwo;
      errors.statusCode = constMessage.STATUS_CODE_400;
      errors.data = [];
      return {
        errors,
        isValid: isEmpty(errors),
      };
    }
    var num = parseInt(data.password.toString().length);
    if (num < 8) {
      errors.message = constMessage.PasswordTwos;
      errors.statusCode = constMessage.STATUS_CODE_400;
      errors.data = [];
      return {
        errors,
        isValid: isEmpty(errors),
      };
    }
  }

  if (!data.email) {
    errors.message = constMessage.Email;
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
