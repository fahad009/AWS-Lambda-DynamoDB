//importing Validator package
const Validator = require("validator");
//importing contants
var constMessage = require("../constants");

module.exports.validateTournament = async (data) => {
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
  data.vendorId = !isEmpty(data.vendorId) ? data.vendorId : "";
  data.GameId = !isEmpty(data.GameId) ? data.GameId : "";
  data.fee = !isEmpty(data.fee) ? data.fee : "";
  data.prize = !isEmpty(data.prize) ? data.prize : "";
  data.no_of_teams = !isEmpty(data.no_of_teams) ? data.no_of_teams : "";
  data.no_of_players = !isEmpty(data.no_of_players) ? data.no_of_players : "";
  data.type = !isEmpty(data.type) ? data.type : "";
  data.startDate = !isEmpty(data.startDate) ? data.startDate : "";
  data.endDate = !isEmpty(data.endDate) ? data.endDate : "";

  if (!data.name) {
    errors.message = constMessage.name;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.vendorId) {
    errors.message = constMessage.vendorId;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.GameId) {
    errors.message = constMessage.GameId;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }

  if (!data.fee) {
    errors.message = constMessage.fee;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }

  if (!data.prize) {
    errors.message = constMessage.prize;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }

  if (!data.type) {
    errors.message = constMessage.type;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }

  if (!data.startDate) {
    errors.message = constMessage.startDate;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.endDate) {
    errors.message = constMessage.endDate;
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

module.exports.validateTournamentDetail = async (data) => {
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

module.exports.validateTournamentDetailByGameId = async (data) => {
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

  data.gameId = !isEmpty(data.gameId) ? data.gameId : "";
  data.status = !isEmpty(data.status) ? data.status : "";

  if (!data.gameId) {
    errors.message = constMessage.gameId;
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

  return {
    errors,
    isValid: true,
  };
};

module.exports.validateVendorTournament = async (data) => {
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

  data.vendorId = !isEmpty(data.vendorId) ? data.vendorId : "";

  if (!data.vendorId) {
    errors.message = constMessage.vendorId;
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

module.exports.validateId = async (data) => {
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
