//import axios from "axios";
const axios = require("axios");
var constMessage = require("./constants");
const configuration = require("../config.json");
var { saveUsersAndSpaces } = require("../db/Dao/taskDao");
var { getAllSpaces } = require("../db/Dao/workspaceDao");

const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });
const DynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = {
  getSpaceUsers: async (spaceId) => {
    //get users details
    var AUTH_HEADERS = constMessage.AUTH_HEADERS;
    var dataIs = await axios.get(
      constMessage.APIurl + "/spaces/" + spaceId + "/users",
      { headers: AUTH_HEADERS }
    );

    return dataIs;

    response = {
      statusCode: constMessage.STATUS_CODE_200,
      message: constMessage.DATA_ADDED,
      data: dataIs,
    };
    return response;
  },

  getAllWorkSpaces: async (info) => {
    //get users details
    var AUTH_HEADERS = constMessage.AUTH_HEADERS;

    dataIs = await axios.get(constMessage.APIurl + "/spaces" + ".json", {
      headers: AUTH_HEADERS,
    });

    return dataIs;

    response = {
      statusCode: constMessage.STATUS_CODE_200,
      message: constMessage.DATA_ADDED,
      data: dataIs,
    };
    return response;
  },

  getAssemblaTask: async (info) => {
    var response = {};
    var data = [];
    var SendMail = [];

    try {
      console.log("1");
      var AUTH_HEADERS = constMessage.AUTH_HEADERS;

      //get yesterday timestamp
      var date = new Date();
      console.log("2");
      date.setDate(date.getDate() + 1);
      var dateTo =
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
      console.log("3");
      var date = new Date();
      date.setDate(date.getDate() + 0);
      var dateFrom =
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

      var to = dateTo;
      var from = dateFrom;
      var page = 1;
      var dataInSave = "";
      var dataIs;

      // do while to get all tasks list fo all workspaces
      console.log("4");
      do {
        dataIs = await axios.get(
          constMessage.APIurl +
            "/tasks?page=" +
            page +
            "&from=" +
            from +
            "&to=" +
            to +
            "&per_page=100",
          { headers: AUTH_HEADERS }
        );
        page++;
        // combine data
        console.log("5");
        if (dataIs.data.length < 1) {
          console.log("6");
          return dataInSave;
        } else {
          if (dataInSave == "") {
            dataInSave = dataIs.data;
          } else {
            dataInSave = dataInSave.concat(dataIs.data);
          }
        }
        console.log("7");
      } while (dataIs.data.length > 0);

      //exception handling
      console.log("8");
    } catch (error) {
      response = {
        statusCode: constMessage.STATUS_CODE_501,
        message: error.message,
        data: SendMail,
      };
      return response;
    }
    console.log("9");
    response = {
      statusCode: constMessage.STATUS_CODE_200,
      message: constMessage.DATA_ADDED,
      data: SendMail,
    };
    return response;
  },
  getUserAndWorkSpaceDetails: async (dbUsers) => {
    var AllSpaces = await getAllSpaces();
    console.log("IN side of getUserAndWorkSpaceDetails");
    var response = {};
    var data = [];
    var SendMail = [];
    try {
      //get yesterday timestamp
      var date = new Date();
      date.setDate(date.getDate() - 0);
      var dateTo =
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

      var date = new Date();
      date.setDate(date.getDate() - 1);
      var dateFrom =
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

      var to = dateTo;
      var from = dateFrom;
      var page = 1;
      var dataInSave = "";
      var dataIs;

      var AUTH_HEADERS = constMessage.AUTH_HEADERS;

      var totalRecord = [];
      // get all spaces and users details.
      for (var i = 0; i < AllSpaces.length; i++) {
        const space = AllSpaces[i];
        var value = space.spaceName;
        console.log("Before space.SK:", space.SK);
        if (space.isAssemblaSpace) {
          var key = space.SK;
          console.log("key:", key);
          dataIs = await axios.get(
            constMessage.APIurl + "/spaces/" + key + "/users",
            { headers: AUTH_HEADERS }
          );
          console.log("dataIs:", dataIs);
          var responseBO = await saveUsersAndSpaces(
            dataIs.data,
            key,
            value,
            dbUsers.Items
          );
        }
      }
      // return totalRecord;
    } catch (error) {
      response = {
        statusCode: constMessage.STATUS_CODE_501,
        message: error.message,
        data: SendMail,
      };
      return response;
    }

    response = {
      statusCode: constMessage.STATUS_CODE_200,
      message: constMessage.DATA_ADDED,
      data: SendMail,
    };
    return response;
  },

  getUserDetails: async (info) => {
    //get users details
    var AUTH_HEADERS = constMessage.AUTH_HEADERS;

    dataIs = await axios.get(constMessage.APIurl + "/users/" + info + ".json", {
      headers: AUTH_HEADERS,
    });

    return dataIs;

    response = {
      statusCode: constMessage.STATUS_CODE_200,
      message: constMessage.DATA_ADDED,
      data: SendMail,
    };
    return response;
  },

  createUserBO: async (userBO, UserWorkSpaces) => {
    var userSpaces = [];
    // console.log(UserWorkSpaces);
    for (var a = 0; a < UserWorkSpaces.length; a++) {
      var spaceID = UserWorkSpaces[a].PK;
      spaceID = spaceID.replace("Space#", "");

      if (userBO.defaultSpace == undefined || userBO.defaultSpace == "-1") {
        userBO.defaultSpace = spaceID;
      }

      var isdefult = 0;
      var roomType = 0;
      if (userBO.defaultSpace == spaceID) {
        isdefult = 1;
      } else {
        isdefult = 0;
      }
      var params = {
        KeyConditionExpression: "PK = :PK AND SK = :SK",
        ExpressionAttributeValues: {
          ":SK": spaceID,
          ":PK": "Spaces#",
        },
        TableName: constMessage.TABLE_NAME,
      };

      spaceBO = await DynamoDB.query(params).promise();
      if (spaceBO.Items[0].roomType != undefined)
        roomType = spaceBO.Items[0].roomType;
      // console.log("data8888888888",spaceBO);

      userSpaces.push({
        name: UserWorkSpaces[a].item2,
        id: spaceID,
        isDefaultSpace: isdefult,
        roomType: roomType,
      });
    }
    //get users details
    var gender = userBO.item4;
    if (gender == null) {
      gender = " ";
    }
    var UserBO = {
      employee_id: userBO.SK,
      isAssembla_User: userBO.item5,
      gender: gender,
      user_name: userBO.item8,
      name: userBO.item8,
      password: userBO.item6,
      image_url: userBO.item7,
      status_icon: userBO.Statusicon,
      userText_Status: userBO.userTextStatus,
      status: userBO.Status,
      user_Avatar: userBO.userAvatar,
      email: userBO.item3,
      role: userBO.role,
      currentAvailability_Status: userBO.currentAvailabilityStatus,
      type: userBO.type,
      spaces: userSpaces,
      isLead: userBO.isLead,
    };
    return UserBO;
  },

  createSpacesBO: async (UserWorkSpaces) => {
    var userSpaces = [];
    for (var a = 0; a < UserWorkSpaces.length; a++) {
      var spaceID = UserWorkSpaces[a].PK;
      spaceID = spaceID.replace("Space#", "");
      userSpaces.push({ name: UserWorkSpaces[a].item2, id: spaceID });
    }
    console.log(userSpaces);

    return userSpaces;
  },

  countUserWorkingHours: async (UsersTasks) => {
    var tasks = UsersTasks,
      UsersTasks = tasks.reduce(function (r, a) {
        var filerOn = a.PK;
        r[filerOn] = r[filerOn] || [];
        if (typeof r[filerOn][0] !== "undefined") {
          console.log("kkkkk");
          console.log(a.item4);
          r[filerOn][0].total =
            parseFloat(r[filerOn][0].total) + parseFloat(a.item5);
        } else {
          a.total = parseFloat(a.item5);
          r[filerOn].push(a);
        }
        return r;
      }, Object.create(null));

    return UsersTasks;
  },

  standupOrderByUserID: async (UsersStandUp) => {
    var tasks = UsersStandUp,
      UsersStandUp = tasks.reduce(function (r, a) {
        var filerOn = a.PK;
        r[filerOn] = r[filerOn] || [];
        if (typeof r[filerOn][0] !== "undefined") {
        } else {
          // a.total = parseFloat(a.item5);
          r[filerOn].push(a);
        }
        return r;
      }, Object.create(null));

    return UsersStandUp;
  },

  createBOOfWorkSpaceDetails: async (
    space_id,
    UserBOs,
    userTasksCount,
    userStandUp
  ) => {
    userBO = UserBOs.Items;
    var userBOArray = [];
    for (var a = 0; a < userBO.length; a++) {
      if (
        userBO[a].Status == "1" &&
        userBO[a].role != "Admin" &&
        userBO[a].StatusHRM != "-1"
      ) {
        //check if not blocked or deleted

        var StandupTime = "Not availabe";
        if (typeof userStandUp["Standup#" + userBO[a].SK] === "undefined") {
          StandupTime = null;
        } else {
          //StandupTime=userStandUp["Standup#"+userBO[a].SK][0].SK;
          //StandupTime="";
          StandupTime = userStandUp["Standup#" + userBO[a].SK][0].SK;
        }

        var hoursLogs = 0;
        if (typeof userTasksCount["Tasks#" + userBO[a].SK] === "undefined") {
        } else {
          hoursLogs = userTasksCount["Tasks#" + userBO[a].SK][0].total;
        }

        var gender = userBO[a].gender;
        if (gender == null) {
          gender = " ";
        }
        var OneUserBO = {
          employee_id: userBO[a].SK,
          isAssembla_User: userBO[a].item5,
          gender: gender,
          user_name: userBO[a].item8,
          name: userBO[a].item8,
          image_url: userBO[a].item7,
          status_icon: userBO[a].Statusicon,
          userText_Status: userBO[a].userTextStatus,
          status: userBO[a].Status,
          user_Avatar: userBO[a].userAvatar,
          email: userBO[a].item3,
          role: userBO[a].role,
          currentAvailability_Status: userBO[a].currentAvailabilityStatus,
          type: userBO[a].type,
          totalHours: hoursLogs,
          defaultSpace: userBO[a].defaultSpace ? userBO[a].defaultSpace : "",
          defaultSpaceName: userBO[a].defaultSpaceName
            ? userBO[a].defaultSpaceName
            : "",
          SeatNo: userBO[a].SeatNo ? userBO[a].SeatNo : -1,
          standupTime: StandupTime, //for 1 space only
          //standupTime:userBO[a].standupTime
        };

        if (space_id == userBO[a].defaultSpace) {
          userBOArray.push(OneUserBO);
        }
      }
    }

    return userBOArray;
  },

  getUserStatusBO: async (userBO) => {
    var UserBO = {
      image_url: userBO.item7,
      status_icon: userBO.Statusicon,
      userText_Status: userBO.userTextStatus,
      user_Avatar: userBO.userAvatar,
      currentAvailability_Status: userBO.currentAvailabilityStatus,
    };
    return UserBO;
  },

  getUniqueTaskAndTotal: async (UserTasks) => {
    var taskArray = [];
    var task = [];
    var Total = 0;
    var taskData = UserTasks.Items,
      UserTasks = taskData.reduce(function (r, a) {
        var filerOn = a.item4;
        r[filerOn] = r[filerOn] || [];

        if (typeof r[filerOn][0] !== "undefined") {
        } else {
          var data = {
            Ticket_Title: a.item4,
            Ticket_Number: a.item3,
            Ticket_Url: "https://app.assembla.com" + a.item6,
          };
          r[filerOn].push(a);
          taskArray.push(data);
        }
        Total = Total + parseFloat(a.item5);
        return r;
      }, Object.create(null));

    task["Total"] = Total;
    task["Ticket_Details"] = taskArray;
    console.log(task);
    console.log(Total);

    return task;
  },

  groupByUserAssembla: async (UserTasks) => {
    //var result;
    var i = 0;
    var usersAssembla = resultAssembla,
      resultAssembla = usersAssembla.reduce(function (r, a) {
        i++;

        var theDate = new Date(parseInt(a.SK));
        var dateString = theDate.toLocaleString();

        a.PK = a.PK.replace("Standup#", "");
        console.log(a.SK);
        console.log(dateString);
        var filerOn = a.PK;
        r[filerOn] = r[filerOn] || [];

        if (typeof r[filerOn][0] !== "undefined") {
          r[filerOn][0].standUpTime =
            r[filerOn][0].standUpTime + "\n" + dateString;
        } else {
          if (a != "") {
            a.standUpTime = "";
            a.standUpTime = dateString;

            r[filerOn].push(a);
          }
        }
        return r;
      }, Object.create(null));
    return resultAssembla;
  },
};
