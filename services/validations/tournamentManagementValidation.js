//importing Validator package
const Validator = require("validator");
//importing contants
var constMessage = require("../constants");

module.exports.unRegisterTeamValidation = async (data) => {
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

  data.tournamentId = !isEmpty(data.tournamentId) ? data.tournamentId : "";
  data.teamId = !isEmpty(data.teamId) ? data.teamId : "";

  if (!data.tournamentId) {
    errors.message = constMessage.unRegisterValidation.tournamentId;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.teamId) {
    errors.message = constMessage.unRegisterValidation.teamId;
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
module.exports.registerTeamsValidation = async (data) => {
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
  data.link = !isEmpty(data.link) ? data.link : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.tournamentId = !isEmpty(data.tournamentId) ? data.tournamentId : "";
  data.registrationTime = !isEmpty(data.registrationTime)
    ? data.registrationTime
    : "";
  data.teamLead = !isEmpty(data.teamLead) ? data.teamLead : "";
  data.players = !isEmpty(data.players) ? data.players : "";

  if (!data.name) {
    errors.message = constMessage.Name;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.link) {
    errors.message = constMessage.link;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.status) {
    errors.message = constMessage.status;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.tournamentId) {
    errors.message = constMessage.unRegisterValidation.tournamentId;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.registrationTime) {
    errors.message = constMessage.registrationTime;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  console.log(
    "-------------------------- typ is  ",
    data.registrationTime,
    "   ",
    typeof data.registrationTime
  );
  if (data.registrationTime && typeof data.registrationTime != "number") {
    errors.message = constMessage.registrationTime2;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.teamLead) {
    errors.message = constMessage.teamLead;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.players) {
    errors.message = constMessage.players;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (data.players.length > 0) {
    for (var i = 0; i < data.players.length; i++) {
      if (data.players[i].email == undefined) {
        errors.message = constMessage.players2;
        errors.statusCode = constMessage.STATUS_CODE_400;
        errors.data = [];
        return {
          errors,
          isValid: isEmpty(errors),
        };
        break;
      }
    }
  }

  return {
    errors,
    isValid: true,
  };
};
module.exports.updateTeamValidation = async (data) => {
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
  data.link = !isEmpty(data.link) ? data.link : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.tournamentId = !isEmpty(data.tournamentId) ? data.tournamentId : "";
  data.teamId = !isEmpty(data.teamId) ? data.teamId : "";
  data.teamLead = !isEmpty(data.teamLead) ? data.teamLead : "";
  data.players = !isEmpty(data.players) ? data.players : "";

  if (!data.name) {
    errors.message = constMessage.Name;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.link) {
    errors.message = constMessage.link;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.status) {
    errors.message = constMessage.status;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.tournamentId) {
    errors.message = constMessage.unRegisterValidation.tournamentId;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.teamId) {
    errors.message = constMessage.unRegisterValidation.teamId;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.teamLead) {
    errors.message = constMessage.teamLead;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.players) {
    errors.message = constMessage.players;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (data.players.length > 0) {
    for (var i = 0; i < data.players.length; i++) {
      if (data.players[i].email == undefined) {
        errors.message = constMessage.players2;
        errors.statusCode = constMessage.STATUS_CODE_400;
        errors.data = [];
        return {
          errors,
          isValid: isEmpty(errors),
        };
        break;
      }
    }
  }

  return {
    errors,
    isValid: true,
  };
};
