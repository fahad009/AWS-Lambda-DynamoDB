//imports
var { sendResponse } = require("../services/helpers");
var constMessage = require("../services/constants");
var {
  getAssemblaTask,
  createUserBO,
  countUserWorkingHours,
  standupOrderByUserID,
  createBOOfWorkSpaceDetails,
} = require("../services/publicServices");
var {
  getUserWorkSpacesDetails,
  getUsersDetails,
  getCurrentWeekTasksOfWorkSpace,
  getTodayStandUpTime,
} = require("./db/dao/taskDAO");
var {
  addScore,
  deleteTeam,
  addWorkSpace,
  editWorkSpace,
  deleteWorkSpace,
  getAllSpaces,
  getSpace,
  addMilestone,
  getMilestone,
  getAllMilestonesOfSpace,
  getAllMilestonesOfSpaceWithDetail,
  getMilestoneDetail,
  editMilestone,
  syncMilestonesOfSpace,
  getAllMilestones,
} = require("../db/Dao/workspaceDao");

const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });
const DynamoDB = new AWS.DynamoDB.DocumentClient();

exports.workspaceAllDetails = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  //get all yesterday Assembla Task
  var UserData = await getUserWorkSpacesDetails(data.space_id);

  UserData = UserData.Items;
  var usersID = [];
  var titleObject = { ":users": "Users#" };
  var index = 0;

  UserData.forEach(function (value) {
    index++;
    var titleKey = ":titlevalue" + index;
    titleObject[titleKey.toString()] = value.item3;
  });

  // get all users details of Space user IDs
  var UserBOs = await getUsersDetails(titleObject);

  var current = new Date(parseInt(data.date)); // get current date
  current.setHours(0, 0, 0, 0);
  var weekstart = current.getDate() - current.getDay() + 1;

  var weekend = weekstart + 7; // end day is the first day + 6
  var monday = new Date(current.setDate(weekstart));

  var startweek = monday.getTime();
  var endweek = startweek + 7 * 86400000;

  console.log("Week task start and end");
  startweek = startweek - 1 - 5 * 3600000;
  endweek = endweek - 1 - 5 * 3600000;

  console.log(startweek);
  console.log(endweek);

  //get task of all users in space and count total hours.
  var UsersTasks = await getCurrentWeekTasksOfWorkSpace(
    startweek,
    endweek,
    data.space_id
  );
  var userTasksCount = await countUserWorkingHours(UsersTasks.Items);
  console.log("userTasksCount");

  var date = new Date(parseInt(data.date));
  var dateFrom = date.getTime();
  dateFrom = dateFrom;
  var now = new Date(parseInt(data.date)),
    then = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  dateTo = then.getTime();

  console.log("Standup");
  console.log(dateTo);
  console.log(dateFrom);

  //get standup time of users in space id and order by userID
  var todayStandUP = await getTodayStandUpTime(
    dateTo,
    dateFrom,
    data.space_name
  );

  var userStandUp = await standupOrderByUserID(todayStandUP.Items);

  console.log("StandUp");

  var userFinalBOs = await createBOOfWorkSpaceDetails(
    data.space_id,
    UserBOs,
    userTasksCount,
    userStandUp
  );

  console.log(userFinalBOs);

  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: constMessage.SUCCESS,
    Users: userFinalBOs,
  };
  sendResponse(response, callback);
};

exports.addScore = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var resultData = await addScore(data);
  console.log(resultData);
  if (resultData === false) {
    response = {
      statusCode: "201",
      body: "SUCCESS",
      data: "Score not Found!",
    };
    sendResponse(response, callback);
  }
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: "Score has been added successfully",
  };
  console.log(resultData);

  sendResponse(response, callback);
};

exports.addWorkSpace = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var resultData = await addWorkSpace(data);
  console.log(resultData);
  if (resultData === false) {
    response = {
      statusCode: "201",
      body: "SUCCESS",
      data: "WorkSpace not Found!",
    };
    sendResponse(response, callback);
  }
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: "WorkSpace has been added successfully",
  };
  console.log(resultData);

  sendResponse(response, callback);
};

exports.editWorkSpace = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var resultData = await editWorkSpace(data);
  console.log(resultData);
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: "WorkSpace has been updated successfully",
  };
  console.log(resultData);

  sendResponse(response, callback);
};
exports.deleteWorkSpace = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var resultData = await deleteWorkSpace(data);
  console.log(resultData);
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: "WorkSpace has been deleted successfully",
  };
  console.log(resultData);

  sendResponse(response, callback);
};

exports.getAllSpaces = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var resultData = await getAllSpaces(data);
  console.log(resultData);
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: resultData,
  };
  console.log(resultData);

  sendResponse(response, callback);
};

exports.getSpace = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var resultData = await getSpace(data);
  console.log(resultData);
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: resultData,
  };
  console.log(resultData);

  sendResponse(response, callback);
};

exports.addMilestone = async (event, context, callback) => {
  try {
    const data = JSON.parse(event.body);
    console.log(data);

    const resultData = await addMilestone(data);
    console.log(resultData);

    sendResponse(
      {
        statusCode: constMessage.STATUS_CODE_200,
        body: "SUCCESS",
        data: "Milestone has been added successfully",
      },
      callback
    );
  } catch (e) {
    console.log("error", e);
    sendResponse(
      {
        statusCode: constMessage.STATUS_CODE_200,
        body: "FAILED",
        data: e.message,
      },
      callback
    );
  }
};
exports.syncMilestonesOfSpace = async (event, context, callback) => {
  try {
    const data = JSON.parse(event.body);
    console.log(data);
    if (!data.spaceId) {
      sendResponse(
        {
          statusCode: constMessage.STATUS_CODE_200,
          body: "FAILED",
          data: "spaceId is missing",
        },
        callback
      );
    }

    const resultData = await syncMilestonesOfSpace(data);
    console.log(resultData);

    sendResponse(
      {
        statusCode: constMessage.STATUS_CODE_200,
        body: "SUCCESS",
        data: "Milestones synced successfully",
      },
      callback
    );
  } catch (e) {
    console.log("error", e);
    sendResponse(
      {
        statusCode: constMessage.STATUS_CODE_200,
        body: "FAILED",
        data: e.message,
      },
      callback
    );
  }
};
exports.getMilestone = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var resultData = await getMilestone(data);
  console.log(resultData);
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: resultData,
  };
  console.log(resultData);

  sendResponse(response, callback);
};
exports.getAllMilestones = async (event, context, callback) => {
  const resultData = await getAllMilestones();
  console.log(resultData);
  const response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: resultData,
  };

  sendResponse(response, callback);
};
exports.getAllMilestonesOfSpace = async (event, context, callback) => {
  let response = null;
  const data = JSON.parse(event.body);
  console.log(data);

  const resultData = await getAllMilestonesOfSpace(data);
  console.log("resultData", resultData);
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: resultData,
  };

  sendResponse(response, callback);
};

exports.getMilestoneDetail = async (event, context, callback) => {
  let response = null;
  const data = JSON.parse(event.body);
  console.log(data);
  const resultData = await getMilestoneDetail(data);
  console.log("resultData", resultData);
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: resultData,
  };

  sendResponse(response, callback);
};
exports.editMilestone = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log(data);

  const resultData = await editMilestone(data);
  console.log(resultData);

  const response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: "Milestone has been updated successfully",
  };
  console.log(resultData);

  sendResponse(response, callback);
};
