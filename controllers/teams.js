var { sendResponse } = require("../services/helpers");
var constMessage = require("../services/constants");

var {
  addTeam,
  getAllTeams,
  editTeam,
  deleteTeam,
} = require("../db/dao/teamsDAo");

exports.addTeam = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var resultData = await addTeam(data);
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
    data: "Team has been added successfully",
  };
  console.log(resultData);

  sendResponse(response, callback);
};
exports.editTeam = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);
  var resultData = await editTeam(data);
  console.log(resultData);
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: "Team has been updated successfully",
  };
  console.log(resultData);

  sendResponse(response, callback);
};
exports.getAllTeams = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var resultData = await getAllTeams(data);
  console.log(resultData);
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: resultData,
  };
  console.log(resultData);

  sendResponse(response, callback);
};
exports.deleteTeam = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var resultData = await deleteTeam(data);
  console.log(resultData);
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: "Team has been deleted successfully",
  };
  console.log(resultData);

  sendResponse(response, callback);
};
