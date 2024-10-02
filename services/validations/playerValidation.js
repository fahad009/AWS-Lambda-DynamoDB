//importing Validator package
const Validator = require("validator");
//importing contants
var constMessage = require("../constants");
const { sendResponse } = require("../helpers");

module.exports.unRegisterPlayerValidation = async (data) => {
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
  data.playerId = !isEmpty(data.playerId) ? data.playerId : "";
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
  if (!data.playerId) {
    errors.message = constMessage.unRegisterValidation.playerId;
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

module.exports.AcceptTeamInviteValidation = async (data) => {
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

  data.playerId = !isEmpty(data.playerId) ? data.playerId : "";
  data.teamId = !isEmpty(data.teamId) ? data.teamId : "";

  if (!data.playerId) {
    errors.message = constMessage.unRegisterValidation.playerId;
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

module.exports.getActivePlayersValidation = async (data) => {
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

  data = !isEmpty(data) ? data : "";

  if (!data) {
    errors.message = constMessage.gameId;
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
module.exports.createPlayerValidation = async (data) => {
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
  data.email = !isEmpty(data.email) ? data.email : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.score = !isEmpty(data.score) ? data.score : "";
  data.level = !isEmpty(data.level) ? data.level : "";
  data.GameId = !isEmpty(data.GameId) ? data.GameId : "";

  if (!data.name) {
    errors.message = constMessage.Name;
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
  if (!data.status) {
    errors.message = constMessage.status;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.score) {
    errors.message = constMessage.score;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.level) {
    errors.message = constMessage.level;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.GameId) {
    errors.message = constMessage.gameId;
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
