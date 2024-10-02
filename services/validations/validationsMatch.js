//importing Validator package
const Validator = require("validator");
//importing contants
var constMessage = require("../constants");

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

module.exports.validateAutoMatchMaking = async (data) => {
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
  data.roundId = !isEmpty(data.roundId) ? data.roundId : "";
  data.teams = !isEmpty(data.teams) ? data.teams : "";

  if (!data.tournamentId) {
    errors.message = constMessage.tournamentId;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
  if (!data.teams) {
    errors.message = constMessage.teams;
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

module.exports.PlayerListValidatation = async (data) => {
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
  data.matchId = !isEmpty(data.matchId) ? data.matchId : "";

  if (!data.tournamentId) {
    errors.message = constMessage.tournamentId;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }

  if (!data.matchId) {
    errors.message = constMessage.matchId;
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

module.exports.validateStartMatch = async (data) => {
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
  data.roundId = !isEmpty(data.roundId) ? data.roundId : "";
  data.date = !isEmpty(data.date) ? data.date : "";
  data.type = !isEmpty(data.type) ? data.type : "";
  data.teams = !isEmpty(data.teams) ? data.teams : "";

  if (!data.tournamentId) {
    errors.message = constMessage.tournamentId;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }

  if (!data.roundId) {
    errors.message = constMessage.roundId;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }

  if (!data.date) {
    errors.message = constMessage.date;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }

  if (!data.teams.length > 0) {
    errors.message = constMessage.teams;
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

module.exports.validateUpdateMatch = async (data) => {
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

  // data.matchId = !isEmpty(data.matchId) ? data.matchId : "";
  data.tournamentId = !isEmpty(data.tournamentId) ? data.tournamentId : "";
  data.roundId = !isEmpty(data.roundId) ? data.roundId : "";
  data.date = !isEmpty(data.date) ? data.date : "";
  data.teams = !isEmpty(data.teams) ? data.teams : "";

  if (!data.tournamentId) {
    errors.message = constMessage.tournamentId;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }

  if (!data.roundId) {
    errors.message = constMessage.roundId;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }

  if (!data.date) {
    errors.message = constMessage.date;
    errors.statusCode = constMessage.STATUS_CODE_400;
    errors.data = [];
    return {
      errors,
      isValid: isEmpty(errors),
    };
  }

  if (!data.teams.length > 0) {
    errors.message = constMessage.teams;
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
