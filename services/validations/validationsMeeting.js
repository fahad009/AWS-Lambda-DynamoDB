//importing Validator package
const Validator = require("validator");
//importing contants
var constMessage = require("../constants");

module.exports.validateCreateMeeting = async (data) => {
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
  data.hostEmail = !isEmpty(data.hostEmail) ? data.hostEmail : "";
  data.hostName = !isEmpty(data.hostName) ? data.hostName : "";
  data.attendees = !isEmpty(data.attendees) ? data.attendees : "";
  data.space = !isEmpty(data.space) ? data.space : "";

  if (!data.hostEmail) {
    errors.message = constMessage.emailIsRequired;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.hostName) {
    errors.message = constMessage.Name;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.attendees || data.attendees.length == 0) {
    errors.message = constMessage.attendees;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.space || data.space.length == 0) {
    errors.message = constMessage.SPACE_IS_REQUIRED;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (data.attendees.length > 0) {
    for (var i = 0; i < data.attendees.length; i++) {
      if (data.attendees[i].email == null || data.attendees[i] == undefined) {
        //throw error
        errors.message = constMessage.attendeesEmailMissing;
        errors.statusCode = constMessage.STATUS_CODE_400;
        errors.data = [];
        return {
          errors,
          isValid: isEmpty(errors),
        };
      }
    }
  }

  return {
    errors,
    isValid: true,
  };
};
