var { sendResponse } = require("../services/helpers");
var constMessage = require("../services/constants");

var {
  getUsersScoresByLeadId,
  editUserScore,
  getScoresbyLead,
  getAllScores,
  getScoreByUserId,
  addUserScore,
  approveScore,
} = require("../db/dao/scoresDao");
const { MESSAGE } = require("../services/constants");

exports.addUserScore = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};
  var userBO;
  var data = JSON.parse(event.body);
  var response;

  console.log("adding new");
  userBO = await addUserScore(data);
  if (userBO === 0) {
    response = {
      statusCode: "202",
      body: "User not found in selected workSpaces",
      data: [],
    };
  } else {
    response = {
      statusCode: constMessage.STATUS_CODE_200,
      body: "Users Scores Successfully added", // data: userBO,
      data: userBO,
    };
  }

  sendResponse(response, callback);
};
exports.editUserScore = async (event, context, callback) => {
  //Defining variables
  var response = "";

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var resultData = await editUserScore(data);
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SCORE GET SUCCESSFULLY",
    data: resultData,
  };
  console.log(resultData);

  sendResponse(response, callback);
};
exports.getScoreByUserId = async (event, context, callback) => {
  //Defining variables
  var response = "";

  var data = JSON.parse(event.body);
  var response;
  console.log(data);

  let message = [];
  if (!data.start) {
    message.push("No Start");
  }
  if (!data.end) {
    message.push("No End");
  }
  if (!data.userId) {
    message.push("No UserId");
  }
  if (message.length > 0) {
    response = {
      error: true,
      statusCode: 201,
      message: message,
    };
    sendResponse(response, callback);
  }

  var resultData = await getScoreByUserId(data);
  // console.log(resultData, "result");
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SCORE GET SUCCESSFULLY",
    data: resultData,
  };
  console.log(resultData);

  sendResponse(response, callback);
};

exports.getScoresbyLead = async (event, context, callback) => {
  //Defining variables
  var response = "";
  var data = JSON.parse(event.body);
  var response;

  var resultData = await getScoresbyLead(data);
  // console.log(resultData, "result");
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SCORE GET SUCCESSFULLY",
    data: resultData,
  };
  console.log(resultData);

  sendResponse(response, callback);
};

exports.approveScores = async (event, context, callback) => {
  let response = "";
  const data = JSON.parse(event.body);

  console.log(data);

  for (const score of data.scores) {
    const res = await approveScore(score);
    console.log("dicota", score, res);
  }
  // console.log(resultData, "result");
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: null,
  };

  sendResponse(response, callback);
};
exports.getAllScores = async (event, context, callback) => {
  //Defining variables
  var response = "";

  var data = JSON.parse(event.body);
  var response;
  console.log(data);

  let message = [];
  if (!data.start) {
    message.push("No Start");
  }
  if (!data.end) {
    message.push("No End");
  }

  if (message.length > 0) {
    response = {
      error: true,
      statusCode: 201,
      message: message,
    };
    sendResponse(response, callback);
  }

  var resultData = await getAllScores(data);
  console.log(resultData.length, "result");
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SCORE GET SUCCESSFULLY",
    data: resultData,
  };

  sendResponse(response, callback);
};
exports.getUsersScoresByLeadId = async (event, context, callback) => {
  //Defining variables
  var response = "";

  var data = JSON.parse(event.body);
  var response;
  console.log(data);

  let message = [];
  if (!data.start) {
    message.push("No Start");
  }
  if (!data.end) {
    message.push("No End");
  }
  if (!data.userIds) {
    message.push("No UserIds");
  }
  if (message.length > 0) {
    response = {
      error: true,
      statusCode: 201,
      message: message,
    };
    sendResponse(response, callback);
  }

  var resultData = await getUsersScoresByLeadId(data);
  console.log(resultData);
  if (resultData === false) {
    response = {
      statusCode: "201",
      body: "SUCCESS",
      data: "Team not Found!",
    };
    sendResponse(response, callback);
  }
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    message: "Got users successfully according to their team ID",
    data: resultData,
  };
  console.log(resultData);

  sendResponse(response, callback);
};
