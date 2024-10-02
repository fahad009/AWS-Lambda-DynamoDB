//imports
var { sendResponse } = require("../services/helpers");
var constMessage = require("../services/constants");
var {
  getAssemblaTask,
  createUserBO,
  createSpacesBO,
  getUserStatusBO,
  getUniqueTaskAndTotal,
} = require("../services/publicServices");
var {
  getUsersByLeadId,
  getUserDetails,
  getUserWorkSpacesDetailsbyUserID,
  updateUserStatus,
  checkIfUserAlreadyExists,
  createNewUser,
  getCurrentWeekTasksOfUser,
  getTodayUserStandUpDetail,
  forgetPassword,
  sendEmailToUserPassword,
  userChangePassword,
  userUpdateProfile,
  sendEmailToAdmin,
  getAllUsers,
  assignWorkSPacesToUser,
  updateUserActiveStatus,
  rejectUserAdmin,
  deleteUser,
  deleteUserForever,
  sendEmailToUserOnActiveAccount,
  updateUser,
  updateUsersTask,
  getAllUsersAPI,
  getUserTask,
  remainderEmail,
  leaveEmail,
  addLeave,
  listOfAllLeave,
  addStandup,
  updateUserProfile,
  addTask,
  deleteLeaveIs,
  addUserToWorkSpace,
  getConstants,
  postConstants,
  getSpaceUsersList,
  updateUserSeatNO,
  updateWorkSpace,
  getUserById,
  getUserTasksById,
  getUsersByWorkspaceIds,
  getUsersByTaskID,
  getWorkspaceName,
  getWorkspaceStandUps,
  getUserStandUpsById,
  getAllTasksOfUser,
  getWorkspaceIdsByName,
} = require("./db/dao/taskDAO");

const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });
const DynamoDB = new AWS.DynamoDB.DocumentClient();

exports.userLogin = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);
  console.log(data.email);

  //exception handing

  //get all yesterday Assembla Task
  var UserData = await getUserDetails(data.email.toLowerCase());

  console.log(UserData);
  console.log("UserData");

  if (UserData.Items.length > 0) {
    if (UserData.Items[0].item6 == data.password) {
      if (UserData.Items[0].Status == "1") {
        var UserWorkSpaces = await getUserWorkSpacesDetailsbyUserID(
          UserData.Items[0].SK
        );

        console.log(UserWorkSpaces);

        UserBO = await createUserBO(UserData.Items[0], UserWorkSpaces.Items);

        response = {
          statusCode: constMessage.STATUS_CODE_200,
          body: constMessage.SUCCESS,
          data: UserBO,
        };
        sendResponse(response, callback);
      } else {
        response = {
          statusCode: constMessage.STATUS_CODE_402,
          body: constMessage.INACTIVE_ACCOUNR,
          data: [],
        };
      }
    } else {
      response = {
        statusCode: constMessage.STATUS_CODE_403,
        body: constMessage.InvalidPassword,
        data: [],
      };
    }

    sendResponse(response, callback);
  } else {
    response = {
      statusCode: constMessage.STATUS_CODE_403,
      body: constMessage.InvalidPassword,
      data: [],
    };
    sendResponse(response, callback);
  }
};

exports.updateStatus = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  try {
    var data = JSON.parse(event.body);
    var response;

    console.log(data);
    console.log(data.employee_id);

    //exception handing

    //get all yesterday Assembla Task
    var UserData = await updateUserStatus(data);
    console.log(UserData);

    response = {
      statusCode: constMessage.STATUS_CODE_200,
      body: constMessage.DATA_UPDATED,
      data: [],
    };
    sendResponse(response, callback);
  } catch (error) {
    //Catch Block for error handling
    response = {
      statusCode: constMessage.STATUS_CODE_400,
      body: "Invalid Data Format",
      data: error,
    };
    sendResponse(response, callback); //Returning errors
    return;
  }
};

exports.deleteLeave = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  //get all yesterday Assembla Task
  var deleteLeave = await deleteLeaveIs(data);
  console.log(deleteLeave);

  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: constMessage.DATA_UPDATED,
    data: [],
  };
  sendResponse(response, callback);
};

exports.applyLeave = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  try {
    var data = JSON.parse(event.body);
    var response;

    console.log(data);

    //get all yesterday Assembla Task
    var data = await leaveEmail(data);
    console.log(data);

    response = {
      statusCode: constMessage.STATUS_CODE_200,
      body: constMessage.DATA_UPDATED,
      data: [],
    };
    sendResponse(response, callback);
  } catch (error) {
    //Catch Block for error handling
    response = {
      statusCode: constMessage.STATUS_CODE_400,
      body: "Invalid Data Format",
      data: error,
    };
    sendResponse(response, callback); //Returning errors
    return;
  }
};

exports.getUsersTaskAndStandUp = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);
  console.log(data.start);
  console.log(data.end);

  //exception handing

  //get all yesterday Assembla Task
  var UsersTask = await updateUsersTask(data, "TASK#");
  var UsersStandUp = await updateUsersTask(data, "Standup#");
  var getAllUsers = await getAllUsersAPI();

  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: constMessage.DATA_UPDATED,
    Task: UsersTask,
    StandUp: UsersStandUp,
    Users: getAllUsers.Items,
  };
  sendResponse(response, callback);
};

exports.getUsersAndStandUp = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);
  console.log(data.start);
  console.log(data.end);

  //exception handing

  var UsersStandUp = await updateUsersTask(data, "Standup#");
  console.log(UsersStandUp);
  var getAllUsers = await getAllUsersAPI();

  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: constMessage.DATA_UPDATED,
    StandUp: UsersStandUp,
    Users: getAllUsers.Items,
  };
  sendResponse(response, callback);
};

exports.getUsersTaskAndUsers = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);
  console.log(data.start);
  console.log(data.end);

  //exception handing

  //get all yesterday Assembla Task
  var UsersTask = await updateUsersTask(data, "TASK#");
  console.log(UsersTask);
  var getAllUsers = await getAllUsersAPI();
  console.log(getAllUsers);

  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: constMessage.DATA_UPDATED,
    Task: UsersTask,
    Users: getAllUsers.Items,
  };
  sendResponse(response, callback);
};

exports.getSpaceUsersList = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var getAllUsers = await getSpaceUsersList(data);
  console.log(getAllUsers);

  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: constMessage.DATA_UPDATED,
    Users: getAllUsers,
  };
  sendResponse(response, callback);
};

exports.getUserStandUpTasks = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);
  console.log(data.start);
  console.log(data.end);

  //exception handing

  //get all yesterday Assembla Task
  var UsersTask = await getUserTask(data, "Tasks#");
  console.log(UsersTask);

  var UsersStandUP = await getUserTask(data, "Standup#");
  console.log(UsersStandUP);

  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: constMessage.DATA_UPDATED,
    Task: UsersTask.Items,
    StandUP: UsersStandUP.Items,
  };
  sendResponse(response, callback);
};

exports.getUserSpaces = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  try {
    var data = JSON.parse(event.body);
    var response;

    console.log(data);
    console.log(data.userID);

    var UserWorkSpaces = await getUserWorkSpacesDetailsbyUserID(data.userID);

    console.log(UserWorkSpaces);

    SpaceBO = await createSpacesBO(UserWorkSpaces.Items);

    response = {
      statusCode: constMessage.STATUS_CODE_200,
      body: constMessage.SUCCESS,
      data: SpaceBO,
    };
    sendResponse(response, callback);
  } catch (error) {
    response = {
      statusCode: constMessage.STATUS_CODE_400,
      body: "Invalid Data Format",
      data: error,
    };
    sendResponse(response, callback); //Returning errors
    return;
  }
};

exports.registration = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);
  console.log(data.email);

  var user = await checkIfUserAlreadyExists(data.email);

  console.log(user);

  if (user.Items.length > 0) {
    console.log("Already added");
    response = {
      statusCode: "201",
      body: "User already Exists",
      data: [],
    };
  } else {
    console.log("adding new");
    var userBO = await createNewUser(data);

    if (userBO === 0) {
      response = {
        statusCode: "202",
        body: "User not found in selected workSpaces",
        data: [],
      };
    } else {
      await sendEmailToAdmin(data.email);
      response = {
        statusCode: constMessage.STATUS_CODE_200,
        body: "User Successfully added", // data: userBO,
        data: [],
      };
    }
  }

  sendResponse(response, callback);
};

exports.getUserStatus = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var UserData = await getUserDetails(data.email);
  console.log(UserData);
  if (UserData.Items.length > 0) {
    var UserData = await getUserStatusBO(UserData.Items[0]);
    response = {
      statusCode: constMessage.STATUS_CODE_200,
      body: "SUCCESS",
      data: UserData,
    };
  } else {
    response = {
      statusCode: "201",
      body: "No User Found",
      data: [],
    };
  }
  console.log(UserData);

  sendResponse(response, callback);
};

exports.getUserTaskAndStandUPDetails = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var current = new Date(parseInt(data.date)); // get current date
  current = new Date(
    current.getFullYear(),
    current.getMonth(),
    current.getDate(),
    0,
    0,
    0
  );
  var weekstart = current.getDate() - current.getDay() + 1;

  var weekend = weekstart + 7; // end day is the first day + 6
  var monday = new Date(current.setDate(weekstart));
  var sunday = new Date(current.setDate(weekend));

  var startweek = monday.getTime();
  var endweek = sunday.getTime();
  startweek = startweek - 1 - 5 * 3600000;
  endweek = endweek - 1 - 5 * 3600000;
  console.log("Week task start and end");

  console.log(startweek);

  console.log(endweek);

  var date = new Date(parseInt(data.date));
  var dateFrom = date.getTime();
  dateFrom = dateFrom;
  var now = new Date(parseInt(data.date)),
    then = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  dateTo = then.getTime();

  console.log("Standup");
  console.log(dateTo);
  console.log(dateFrom);

  //get task of all users in space and count total hours.
  var UserTasks = await getCurrentWeekTasksOfUser(
    startweek,
    endweek,
    data.user_id
  );

  var tasks = await getUniqueTaskAndTotal(UserTasks);

  var todayStandUPDetails = await getTodayUserStandUpDetail(
    dateTo,
    dateFrom,
    data.user_id
  );

  console.log("in");
  console.log(tasks);
  console.log(tasks["Total"]);

  response = {
    statusCode: "201",
    body: "Success",
    standupDetails: todayStandUPDetails,
    tasksTotal: tasks["Total"],
    tasksDetails: tasks["Ticket_Details"],
  };

  sendResponse(response, callback);
};

exports.forgetPassword = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var codeIs = Math.floor(Math.random() * 100000) + 10000;

  var User = await forgetPassword(data.email, codeIs);

  await sendEmailToUserPassword(data.email, codeIs);

  if (User != "0") {
    response = {
      statusCode: "201",
      body: "SUCCESS",
      data: [],
    };
  } else {
    response = {
      statusCode: "202",
      body: "No User Found",
      data: [],
    };
  }

  sendResponse(response, callback);
};

exports.changePassword = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var codeIs = Math.floor(Math.random() * 100000) + 10000;

  var User = await userChangePassword(data.email, data.code, data.newpassword);

  if (User == "0") {
    response = {
      statusCode: "202",
      body: "No User Found",
      data: [],
    };
  } else if (User == -1) {
    response = {
      statusCode: "203",
      body: "Invalid Code",
      data: [],
    };
  } else {
    response = {
      statusCode: "201",
      body: "SUCCESS",
      data: [],
    };
  }

  sendResponse(response, callback);
};

exports.updateProfile = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  var User = await userUpdateProfile(data);

  if (User == "0") {
    response = {
      statusCode: "202",
      body: "No User Found",
      data: [],
    };
  } else if (User == -1) {
    response = {
      statusCode: "201",
      body: "Old password not correct",
      data: [],
    };
  } else {
    response = {
      statusCode: "200",
      body: "SUCCESS",
      data: [],
    };
  }

  sendResponse(response, callback);
};

exports.getAllUsers = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var userBO = await getAllUsers();

  response = {
    statusCode: "201",
    body: "SUCCESS",
    data: userBO,
  };

  sendResponse(response, callback);
};

exports.getConstants = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var userBO = await getConstants();

  response = {
    statusCode: "201",
    body: "SUCCESS",
    data: userBO,
  };

  sendResponse(response, callback);
};

exports.postConstants = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var UserBO = await postConstants(data);

  if (UserBO == "err") {
    response = {
      statusCode: constMessage.STATUS_CODE_501,
      message: "Invalid request",
      data: [],
    };
  } else {
    console.log("fahad");
    console.log(UserBO);

    response = {
      statusCode: "200",
      body: "SUCCESS",
      data: UserBO,
    };
  }

  sendResponse(response, callback);
};

exports.assignWordSpacesToUser = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var returnBO = await assignWorkSPacesToUser(data);

  var returnBO = await updateUserProfile(data);

  response = {
    statusCode: "200",
    body: "SUCCESS",
    data: returnBO,
  };

  sendResponse(response, callback);
};

exports.rejectUser = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var returnBO = await rejectUserAdmin(data);

  // console.log(returnBO);
  console.log(returnBO);

  response = {
    statusCode: "200",
    body: "SUCCESS",
    data: returnBO,
  };

  sendResponse(response, callback);
};

exports.deleteUser = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var UserBO = await deleteUser(data, data.type);

  // console.log(returnBO);
  console.log(UserBO);

  response = {
    statusCode: "200",
    body: "SUCCESS",
    data: UserBO,
  };

  sendResponse(response, callback);
};

exports.deleteUserForever = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var UserBO = await deleteUserForever(data, data.type);

  // console.log(returnBO);
  console.log(UserBO);

  response = {
    statusCode: "200",
    body: "SUCCESS",
    data: UserBO,
  };

  sendResponse(response, callback);
};

exports.updateUser = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var UserBO = await updateUser(data);

  if (UserBO == "err") {
    response = {
      statusCode: constMessage.STATUS_CODE_501,
      message: "Invalid request",
      data: [],
    };
  } else {
    console.log("fahad");
    console.log(UserBO);

    response = {
      statusCode: "200",
      body: "SUCCESS",
      data: UserBO,
    };
  }

  sendResponse(response, callback);
};

exports.sendRemainderEmail = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var UserBO = await remainderEmail(data);

  if (UserBO == "err") {
    response = {
      statusCode: constMessage.STATUS_CODE_501,
      message: "Invalid request",
      data: [],
    };
  } else {
    console.log("fahad");
    console.log(UserBO);

    response = {
      statusCode: "200",
      body: "SUCCESS",
      data: UserBO,
    };
  }

  sendResponse(response, callback);
};

exports.addLeave = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var UserBO = await addLeave(data);

  if (UserBO == "err") {
    response = {
      statusCode: constMessage.STATUS_CODE_501,
      message: "Invalid request",
      data: [],
    };
  } else {
    console.log("fahad");
    console.log(UserBO);

    response = {
      statusCode: "200",
      body: "SUCCESS",
      data: UserBO,
    };
  }
  sendResponse(response, callback);
};

exports.listOfAllLeave = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var LeaveBO = await listOfAllLeave(data);

  if (LeaveBO == "err") {
    response = {
      statusCode: constMessage.STATUS_CODE_501,
      message: "Invalid request",
      data: [],
    };
  } else {
    console.log(LeaveBO);

    response = {
      statusCode: "200",
      body: "SUCCESS",
      data: LeaveBO,
    };
  }
  sendResponse(response, callback);
};

exports.addStandUp = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var LeaveBO = await addStandup(data);

  if (LeaveBO == "err") {
    response = {
      statusCode: constMessage.STATUS_CODE_501,
      message: "Invalid request",
      data: [],
    };
  } else {
    console.log(LeaveBO);

    response = {
      statusCode: "200",
      body: "SUCCESS",
      data: LeaveBO,
    };
  }
  sendResponse(response, callback);
};

exports.addTask = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var LeaveBO = await addTask(data);

  if (LeaveBO == "err") {
    response = {
      statusCode: constMessage.STATUS_CODE_501,
      message: "Invalid request",
      data: [],
    };
  } else {
    console.log(LeaveBO);

    response = {
      statusCode: "200",
      body: "SUCCESS",
      data: LeaveBO,
    };
  }
  sendResponse(response, callback);
};

exports.addUserToWorkSpace = async (event, context, callback) => {
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  console.log(data);

  var resultData = await addUserToWorkSpace(data);
  console.log(resultData);
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: "User has been added successfully",
  };
  console.log(resultData);

  sendResponse(response, callback);
};

exports.updateSpaceData = async (event, context, callback) => {
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;

  var resultData = await updateUserSeatNO(data);
  var resultData2 = await updateWorkSpace(data);
  console.log(resultData2);
  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: "SUCCESS",
    data: "Workspace has been added successfully",
  };
  //console.log(resultData2);

  sendResponse(response, callback);
};

// this API will share the tasks and user details between timeframe of specific user//

exports.getUserTasksAndUser = async (event, context, callback) => {
  var data = JSON.parse(event.body);
  var response;

  //get all yesterday Assembla Task
  //if userID is not in the body
  if (data.userID == undefined || data.userID == "" || data.userID == null) {
    var UsersTask = await updateUsersTask(data, "TASK#");
    console.log(UsersTask);
    var getAllUsers = await getAllUsersAPI();
    console.log(getAllUsers);

    response = {
      statusCode: constMessage.STATUS_CODE_200,
      body: constMessage.DATA_UPDATED,
      Task: UsersTask,
      Users: getAllUsers.Items,
    };
    sendResponse(response, callback);
  } else {
    try {
      var UsersTask = await getUserTasksById(data, "Tasks#");
      var userDetails = await getUserById(data.userID);
    } catch (err) {
      response = {
        statusCode: constMessage.STATUS_CODE_501,
        message: "Invalid request",
        data: [],
      };
      sendResponse(response, callback);
    }

    response = {
      statusCode: constMessage.STATUS_CODE_200,
      body: constMessage.DATA_UPDATED,
      Task: UsersTask,
      Users: userDetails,
    };

    await sendResponse(response, callback);
  }
};

//this API will share the tasks and standUp details based on workspaceIDs and usersIDs

exports.getUserTasksAndStandUp = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = [];
  var response = "";
  var params = {};
  var taskData = [];
  var workspaceNames = [];
  var standUpData = [];

  console.log("event.body");
  var data = JSON.parse(event.body);
  if (
    (data.workspaces == undefined ||
      data.workspaces == null ||
      data.workspaces == "" ||
      data.workspaces.length == 0) &&
    data.userID != undefined &&
    data.userID != null &&
    data.userID != ""
  ) {
    console.log(typeof data.userID);
    console.log("inside first IF");

    try {
      var userDetails = await getUserById(data.userID);
      var UsersTask = await getUserTasksById(data, "Tasks#");
      var UsersStandUp = await getUserStandUpsById(data, "Standup#");

      response = {
        statusCode: constMessage.STATUS_CODE_200,
        body: constMessage.DATA_UPDATED,
        Task: UsersTask,
        Users: userDetails,
        StandUp: UsersStandUp,
      };

      await sendResponse(response, callback);
    } catch (err) {
      response = {
        statusCode: constMessage.STATUS_CODE_501,
        message: "Invalid request",
        data: [],
      };
      await sendResponse(response, callback);
    }
  } else if (
    data.workspaces != undefined &&
    data.workspaces != null &&
    data.workspaces != "" &&
    data.workspaces.length != 0 &&
    (data.userID == undefined || data.userID == null || data.userID == "")
  ) {
    console.log("inside else-if");
    var workspaceIDs = await getWorkspaceIdsByName(data.workspaces);

    const updatedData = { ...data };

    updatedData.workspaces = workspaceIDs;

    var users = await getUsersByWorkspaceIds(updatedData);

    //get all yesterday Assembla Task
    for (var i = 0; i < data.workspaces.length; i++) {
      var LSK = "Tasks#" + updatedData.workspaces[i];
      var spaceName = "Standup#" + data.workspaces[i];
      var temp = await getUsersByTaskID(updatedData, LSK);
      temp.forEach(function (item) {
        taskData.push(item);
      });
      var temp2 = await getWorkspaceStandUps(updatedData, spaceName);
      temp2.forEach(function (item) {
        standUpData.push(item);
      });
    }
    response = {
      statusCode: constMessage.STATUS_CODE_200,
      body: constMessage.DATA_UPDATED,
      Users: users,
      Task: taskData,
      StandUp: standUpData,
    };
    await sendResponse(response, callback);
  } else if (data.workspaces && data.userID) {
    console.log("data.userID", data.userID);
    console.log("data.workspaces", data.workspaces);
    console.log("inside else-if-2");
    var workspaceIDs = await getWorkspaceIdsByName(data.workspaces);
    const updatedData = { ...data };
    updatedData.workspaces = workspaceIDs;
    var users = await getUsersByWorkspaceIds(updatedData);
    console.log(users);

    var userDetails = await getUserById(updatedData.userID);
    var UsersTask = await getUserTasksById(updatedData, "Tasks#");
    var UsersStandUp = await getUserStandUpsById(updatedData, "Standup#");

    response = {
      statusCode: constMessage.STATUS_CODE_200,
      body: constMessage.DATA_UPDATED,
      Task: UsersTask,
      Users: userDetails,
      StandUp: UsersStandUp,
    };
    await sendResponse(response, callback);
  } else {
    console.log("Inside else");

    var UsersTask = await updateUsersTask(data, "TASK#");
    //console.log(UsersTask);
    var UsersStandUp = await updateUsersTask(data, "Standup#");
    var getAllUsers = await getAllUsersAPI();

    response = {
      statusCode: constMessage.STATUS_CODE_200,
      body: constMessage.DATA_UPDATED,
      Task: UsersTask,
      StandUp: UsersStandUp,
      Users: getAllUsers.Items,
    };
    await sendResponse(response, callback);
  }
};

exports.getWorkspaceIdsByName = async (event, context, callback) => {
  var data = JSON.parse(event.body);
  var response;

  var workspaceIds = await getWorkspaceIdsByName(data.workspaces);

  response = {
    statusCode: constMessage.STATUS_CODE_200,
    body: constMessage.DATA_UPDATED,
    data: workspaceIds,
  };
  await sendResponse(response, callback);
};

exports.getUsersByLeadId = async (event, context, callback) => {
  //Defining variables
  var result = "";
  var userObject = {};
  var response = "";
  var params = {};

  var data = JSON.parse(event.body);
  var response;
  console.log(data);

  let message = [];
  if (!data.Id) {
    message.push("No LeadId");
  }

  if (message.length > 0) {
    response = {
      error: true,
      statusCode: 201,
      message: message,
    };
    sendResponse(response, callback);
  }

  var resultData = await getUsersByLeadId(data);

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

exports.sendScoreReminder = async (event, context, callback) => {
  let response = "";
  const data = JSON.parse(event.body);

  console.log(data.users);

  if (data.users) {
    const users = [],
      userNames = [];
    for (const email of data.users) {
      const userData = await getUserDetails(email);
      if (userData.Items.length > 0) {
        users.push(userData.Items[0]);
      }
    }

    for (const user of users) {
      console.log("user", user);
      userNames.push(user.item8);
    }

    console.log(userNames);

    const UserBO = await remainderEmail({
      subject: "Reminder for Scores",
      email: data.lead,
      body: `Dear lead,
                <br/>
                This is a reminder for you to add the scores of ${userNames.join(
                  ", "
                )} for the previous month.
                <br/><br/>
                Regards,<br/>
                Admin/HR<br/>
                GenITeam System Generated Email<br/>
                (Do not reply to this email)
              `,
    });

    if (UserBO == "err") {
      response = {
        statusCode: constMessage.STATUS_CODE_501,
        message: "Invalid request",
        data: [],
      };
    } else {
      console.log("dicota");
      response = {
        statusCode: "200",
        body: "SUCCESS",
        data: UserBO,
      };
    }
  } else {
    response = {
      statusCode: constMessage.STATUS_CODE_501,
      message: "Missing user",
      data: [],
    };
  }

  sendResponse(response, callback);
};
