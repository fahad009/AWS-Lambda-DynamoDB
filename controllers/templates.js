var { sendResponse } = require("../services/helpers");
var constMessage = require("../services/constants");

var {
  addTemplate,
  getAllTemplate,
  editTemplate,
  deleteTemplate,
} = require("../db/dao/templatesDAo");
const { MESSAGE } = require("../services/constants");

exports.addTemplate = async (event, context, callback) => {
  console.log("2");
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var resultData = await addTemplate(data);
  console.log(resultData);
  if (resultData === false) {
    response = {
      statusCode: "201",
      body: "SUCCESS",
      data: "Template not Found!",
    };
    sendResponse(response, callback);
  }
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: "Template has been added successfully",
  };
  console.log(resultData);

  sendResponse(response, callback);
};
exports.getAllTemplate = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var resultData = await getAllTemplate(data);
  console.log(resultData);
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: resultData,
  };
  console.log(resultData);

  sendResponse(response, callback);
};
exports.editTemplate = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var resultData = await editTemplate(data);
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: "Template has been updated successfully",
  };
  console.log(resultData, "bbbbbbbbbbbbbbbbbbbbbb");

  sendResponse(response, callback);
};

exports.deleteTemplates = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;
  console.log(data);

  let message = [];
  if (!data.templateName) {
    message.push("No Template Name");
  }
  if (!data.isDeleted) {
    message.push("No IsDeleted");
  }
  if (!data.timeStamp) {
    message.push("No timeStamp");
  }
  if (message.length > 0) {
    response = {
      error: true,
      statusCode: 201,
      message: message,
    };
    sendResponse(response, callback);
  }

  var resultData = await deleteTemplate(data);
  console.log(resultData);
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: "Template has been deleted successfully",
  };
  console.log(resultData);

  sendResponse(response, callback);
};
