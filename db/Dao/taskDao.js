//Imports
var constMessage = require("../../services/constants");
var aws = require("aws-sdk");
const axios = require("axios");
const nodemailer = require("nodemailer");
var { sendResponse, sendResponseCustom } = require("../../services/helpers");

// var { verifySession, groupByUserAssembla, getAllWorkSpaceUsers } = require("../../services/publicServices");
const { assignWordSpacesToUser } = require("../../controllers/user");
// var { getSpaceUsers,getAssemblaTask } = require("../../services/publicServices");

const AWS = require("aws-sdk");
const { updateUsersTask } = require("./taskDao");
const { config } = require("dotenv");
const constants = require("../../services/constants");
AWS.config.update({ region: "us-west-2" });
const DynamoDB = new AWS.DynamoDB.DocumentClient();

const transporter = nodemailer.createTransport({
  pool: true,
  maxMessages: "Infinity",
  host: "email-smtp.us-east-1.amazonaws.com",
  port: 465,
  secure: true, // use TLS
  auth: constants.auth,
});

var userBOArray = [];
var userBOArrayIndex = 0;

module.exports.saveTasksInDB = async (data) => {
  var response = {};
  try {
    var userTasks = [];

    var x = 1;
    for (var i = 0; i < data.length; i++) {
      x++;

      if (1) {
        //data[i].ticket_number != null

        //var a = parseInt("10")
        var dateSeconds = new Date(data[i].updated_at);
        dateSeconds = dateSeconds.getTime();
        dateSeconds = dateSeconds + i;
        dateSeconds = dateSeconds.toString();

        var ticketNumber = "";
        if (data[i].ticket_number != null) {
          ticketNumber = data[i].ticket_number.toString();
        }
        var ticketID = "";
        if (data[i].ticket_id != null) {
          ticketID = data[i].ticket_id.toString();
        }

        userTasks.push({
          PutRequest: {
            Item: {
              PK: "Tasks#" + data[i].user_id,
              SK: dateSeconds,
              LSK: "Tasks#" + data[i].space_id,
              item1: data[i].space_id,
              item2: "TASK#",
              item3: ticketNumber,
              item4: data[i].description,
              item5: data[i].hours,
              item6: data[i].url,
              item7: ticketID,
              item8: data[i].id.toString(),
              item9: data[i].user_id,
              milestoneId: data[i].milestoneId,
              tagsIS: "TASK#",
            },
          },
        });
      }
    }

    var arrayOfArray25 = chunkArrayInGroups(userTasks, 25);

    var QueryParams;
    arrayOfArray25.forEach(async function (item) {
      QueryParams = {
        RequestItems: {
          ["VSpace_Local"]: item,
          // [constMessage.TABLE_NAME]: item,
        },
      };

      data = await DynamoDB.batchWrite(QueryParams).promise();
    });
  } catch (error) {
    response = {
      statusCode: constMessage.STATUS_CODE_501,
      message: constMessage.SOMETHING_WENT_WRONG,
      data: [],
    };
    return response;
  }

  response = {
    statusCode: constMessage.STATUS_CODE_200,
    message: constMessage.DATA_ADDED,
    data: [],
  };
  return response;
};

module.exports.saveUsersAndSpaces = async (
  assemblaUsers,
  key,
  value,
  dbUsers
) => {
  var response = {};
  var data = {};
  try {
    var userAssembla = [];
    var mergedArray = [];
    var users = [];
    var x = 1;

    for (let index = 0; index < assemblaUsers.length; index++) {
      const element = assemblaUsers[index];
      if (dbUsers.length > 0) {
        var CheckUser = await checkUserExistence(element, dbUsers);
        let userEmail = "watcher@geniteam.pk";
        if (element.email) {
          userEmail = element.email.toLowerCase();
        }
        console.log(userEmail + " if");
        userAssembla.push({
          PutRequest: {
            Item: {
              PK: "Space#" + key,
              SK: element.id,
              LSK: "Spaces#",
              item1: "Spaces#",
              item2: value,
              item3: userEmail,
              item4: "",
              item5: "1",
            },
          },
        });
        if (CheckUser.length === 0) {
          x++;
          users.push({
            PutRequest: {
              Item: {
                PK: "Users#",
                SK: element.id,
                LSK: userEmail,
                item1: userEmail,
                item2: "User#",
                item3: userEmail,
                item4: "",
                item5: "1",
                item6: userEmail + "125",
                item7: element.picture,
                item8: element.name,
                Statusicon: "Statusicon",
                currentAvailabilityStatus: "0",
                userTextStatus: "Working from Home",
                userAvatar: "1",
                type: "Type",
                role: "User",
                isAssemblaUser: true,
                Status: "1",
                StatusHRM: "1",
                defaultSpace: key,
                defaultSpaceName: value,
              },
            },
          });
        } else {
          let params2 = {};
          // console.log("Element is", element);
          if (
            CheckUser[0].defaultSpaceName === "Not Assigned" ||
            CheckUser[0].defaultSpaceName === undefined
          ) {
            params2 = {
              // TableName: "VSpace_Local",
              TableName: constMessage.TABLE_NAME,
              Key: {
                PK: "Users#",
                SK: element.id,
              },
              UpdateExpression:
                "SET #Status =:Status,defaultSpace =:val2,defaultSpaceName =:val3, isAssemblaUser =:isAssemblaUser ",
              ExpressionAttributeValues: {
                ":Status": "1",
                ":val2": key,
                ":val3": value,
                ":isAssemblaUser": true,
              },
              ExpressionAttributeNames: {
                "#Status": "Status",
              },
            };
          } else {
            params2 = {
              // TableName: "VSpace_Local",
              TableName: constMessage.TABLE_NAME,
              Key: {
                PK: "Users#",
                SK: element.id,
              },
              UpdateExpression:
                "SET #Status =:Status, isAssemblaUser =:isAssemblaUser ",
              ExpressionAttributeValues: {
                ":Status": "1",
                ":isAssemblaUser": true,
              },
              ExpressionAttributeNames: {
                "#Status": "Status",
              },
            };
          }
          data = await DynamoDB.update(params2).promise();
        }
      } else {
        x++;
        let userEmail = "watcher@geniteam.pk";
        if (element.email) {
          userEmail = element.email.toLowerCase();
        }
        console.log(userEmail + " else");
        userAssembla.push({
          PutRequest: {
            Item: {
              PK: "Space#" + key,
              SK: element.id,
              LSK: "Spaces#",
              item1: "Spaces#",
              item2: value,
              item3: userEmail,
              item4: "",
              item5: "1",
            },
          },
        });
        users.push({
          PutRequest: {
            Item: {
              PK: "Users#",
              SK: element.id,
              LSK: userEmail,
              item1: userEmail,
              item2: "User#",
              item3: userEmail,
              item4: "",
              item5: "1",
              item6: userEmail + "125",
              item7: element.picture,
              item8: element.name,
              isAssemblaUser: true,
              Statusicon: "Statusicon",
              currentAvailabilityStatus: "0",
              userTextStatus: "Working from Home",
              userAvatar: "1",
              type: "Type",
              role: "User",
              Status: "1",
              StatusHRM: "1",
            },
          },
        });
      }
    }
    var arrayOfArray25 = chunkArrayInGroups(userAssembla, 25);
    var arrayOfArray25Users = chunkArrayInGroups(users, 25);
    var QueryParams;
    var res = [];
    arrayOfArray25.forEach(async function (item) {
      res.push(item);
      QueryParams = {
        RequestItems: {
          [constMessage.TABLE_NAME]: item,
        },
      };
      data = await DynamoDB.batchWrite(QueryParams).promise();
    });
    arrayOfArray25Users.forEach(async function (item) {
      res.push(item);
      QueryParams = {
        RequestItems: {
          [constMessage.TABLE_NAME]: item,
        },
      };
      data = await DynamoDB.batchWrite(QueryParams).promise();
    });
    return res;
  } catch (error) {
    response = {
      statusCode: constMessage.STATUS_CODE_501,
      message: constMessage.SOMETHING_WENT_WRONG,
      data: [],
    };
    return response;
  }
};

async function checkUserExistence(elementBO, dbUsers) {
  var Check = 0;
  var exists = [];
  for (let index = 0; index < dbUsers.length; index++) {
    const element = dbUsers[index];
    if (elementBO.email === element.LSK) {
      //  console.log("Element is here", element);
      exists.push(element);
    }
  }
  return exists;
}

module.exports.getUserDetails = async (email) => {
  var response = {};
  try {
    var params = {
      TableName: constMessage.TABLE_NAME,
      KeyConditionExpression: "PK = :value",
      FilterExpression: "item1 = :email",
      ExpressionAttributeValues: {
        ":value": "Users#",
        ":email": email,
      },
    };

    const data = await DynamoDB.query(params).promise();

    return data;
  } catch (error) {
    response = {
      statusCode: constMessage.STATUS_CODE_501,
      message: constMessage.SOMETHING_WENT_WRONG,
      data: error,
    };
    return response;
  }
};

module.exports.getSpaceUsersID = async (email) => {
  var response = {};
  try {
    var params = {
      TableName: constMessage.TABLE_NAME,
      IndexName: "PK-LSK-index",
      KeyConditionExpression: "PK = :value AND LSK = :email",
      ExpressionAttributeValues: {
        ":value": "Users#",
        ":email": email,
      },
    };

    const data = await DynamoDB.query(params).promise();
    return data;
  } catch (error) {
    response = {
      statusCode: constMessage.STATUS_CODE_501,
      message: constMessage.SOMETHING_WENT_WRONG,
      data: error,
    };
    return response;
  }
};

module.exports.deleteLeaveIs = async (data) => {
  var response = {};

  DynamoDB.delete(
    { Key: { PK: data.PK, SK: "Leave#" + data.SK }, TableName: "VSpace_Local" },
    (error) => {
      if (error) {
        console.log("Delete fail");
        return 0;
      }
      console.log("Delete  Success");
      return 1;
    }
  );

  response = {
    statusCode: constMessage.STATUS_CODE_200,
    message: constMessage.DATA_ADDED,
    data: [],
  };
  return response;
};

module.exports.updateUsersTask = async (data, type) => {
  var data = data;
  //console.log(data);
  var response = {};

  var params = {
    KeyConditionExpression:
      "tagsIS = :tagsIS AND SK BETWEEN :startTime AND :endTime",
    ExpressionAttributeValues: {
      ":startTime": data.start,
      ":endTime": data.end,
      ":tagsIS": type,
    },
    IndexName: "tagsIS-SK-index",
    TableName: constMessage.TABLE_NAME,
  };

  //console.log(params);
  let dataIs;
  let scanResults = [];

  // continue scanning if we have more items

  do {
    //items = await docClient.scan(params).promise();
    console.log("Scanning for more...");
    dataIs = await DynamoDB.query(params).promise();
    dataIs.Items.forEach((item) => scanResults.push(item));
    params.ExclusiveStartKey = dataIs.LastEvaluatedKey;
  } while (typeof dataIs.LastEvaluatedKey != "undefined");

  dataIs = scanResults;

  console.log(dataIs.length);

  return dataIs;
};

module.exports.getUserTask = async (data, type) => {
  var data = data;
  //.log(data);
  var response = {};

  var params = {
    KeyConditionExpression: "PK = :PK AND SK BETWEEN :startTime AND :endTime",
    ExpressionAttributeValues: {
      ":startTime": data.start,
      ":endTime": data.end,
      ":PK": type + "" + data.id,
    },
    TableName: constMessage.TABLE_NAME,
  };

  const dataIs = await DynamoDB.query(params).promise();
  return dataIs;
};

module.exports.updateUserStatus = async (data) => {
  var params2 = {
    TableName: constMessage.TABLE_NAME,
    Key: {
      PK: "Users#",
      SK: data.employee_id,
    },
    UpdateExpression:
      "SET #Statusicon =:val1,#userAvatar =:val2,#userTextStatus =:val3,#currentAvailabilityStatus =:val4",
    ExpressionAttributeNames: {
      "#Statusicon": "Statusicon", //COLUMN NAME
      "#userAvatar": "userAvatar",
      "#userTextStatus": "userTextStatus",
      "#currentAvailabilityStatus": "currentAvailabilityStatus",
    },
    ExpressionAttributeValues: {
      ":val1": data.status_icon,
      ":val2": data.user_Avatar,
      ":val3": data.userText_Status,
      ":val4": data.currentAvailability_Status,
    },
  };

  DynamoDB.update(params2, function (err, data) {
    if (err) {
      response = {
        statusCode: constMessage.STATUS_CODE_501,
        message: constMessage.SOMETHING_WENT_WRONG,
        data: err,
      };
      return response;
    } else {
      return data;
    }
  });
};

module.exports.updateUserStatusOnly = async (data) => {
  var params2 = {
    TableName: constMessage.TABLE_NAME,
    Key: {
      PK: "Users#",
      SK: data.employee_id,
    },
    UpdateExpression:
      "SET #currentAvailabilityStatus =:val4, #standupTime =:val5",
    ExpressionAttributeNames: {
      "#currentAvailabilityStatus": "currentAvailabilityStatus",
      "#standupTime": "standupTime",
    },
    ExpressionAttributeValues: {
      ":val4": data.currentAvailability_Status,
      ":val5": data.standupTime,
    },
  };

  DynamoDB.update(params2, function (err, data) {
    if (err) {
      response = {
        statusCode: constMessage.STATUS_CODE_501,
        message: constMessage.SOMETHING_WENT_WRONG,
        data: err,
      };
      return response;
    } else {
      return data;
    }
  });
};

module.exports.updateUserProfile = async (data) => {
  //.log(data);
  if (data.SeatNo == undefined) {
    data.SeatNo = " ";
  }
  if (data.defaultSpace == undefined) {
    data.defaultSpace = " ";
  }
  var params2 = {
    TableName: constMessage.TABLE_NAME,
    Key: {
      PK: "Users#",
      SK: data.userId,
    },
    UpdateExpression:
      "SET #name =:val1, #teamName =:teamName, #lead1=:lead1, #lead2=:lead2, #lead3=:lead3,  #role =:val2, #Status =:val3,#password =:val4, #defaultSpace =:defaultSpace, #SeatNo =:SeatNo, #defaultSpaceName =:defaultSpaceName, #item5 =:isAssemblaUser, #isLead =:isLead",
    ExpressionAttributeNames: {
      "#name": "item8",
      "#teamName": "teamName",
      "#lead1": "lead1",
      "#lead2": "lead2",
      "#lead3": "lead3",
      "#role": "role",
      "#Status": "Status",
      "#defaultSpace": "defaultSpace",
      "#SeatNo": "SeatNo",
      "#password": "item6",
      "#defaultSpaceName": "defaultSpaceName",
      "#item5": "item5",
      "#isLead": "isLead",
    },
    ExpressionAttributeValues: {
      ":val1": data.name,
      ":teamName": data.teamName,
      ":lead1": data.lead1,
      ":lead2": data.lead2,
      ":lead3": data.lead3,
      ":val2": data.role,
      ":val3": data.Status,
      ":val4": data.password,
      ":defaultSpace": data.defaultSpace,
      ":defaultSpaceName": data.defaultSpaceName,
      ":SeatNo": data.SeatNo,
      ":isAssemblaUser": data.isAssemblaUser,
      ":isLead": data.isLead,
    },
  };

  //console.log(params2);

  DynamoDB.update(params2, function (err, data) {
    if (err) {
      response = {
        statusCode: constMessage.STATUS_CODE_501,
        message: constMessage.SOMETHING_WENT_WRONG,
        data: err,
      };
      return response;
    } else {
      return data;
    }
  });
};

module.exports.getUserWorkSpacesDetails = async (spaceID) => {
  var response = {};
  var params = {
    IndexName: "PK-LSK-index",
    KeyConditionExpression: "PK = :SpaceID",
    ExpressionAttributeValues: {
      ":SpaceID": "Space#" + spaceID,
    },
    TableName: constMessage.TABLE_NAME,
  };

  data = await DynamoDB.query(params).promise();
  return data;
};

module.exports.getUserWorkSpacesDetailsbyUserID = async (UserID) => {
  var response = {};
  var params = {
    IndexName: "LSK-SK-index",
    KeyConditionExpression: "LSK = :Space AND SK = :UserID",
    ExpressionAttributeValues: {
      ":UserID": UserID,
      ":Space": "Spaces#",
    },
    TableName: constMessage.TABLE_NAME,
  };
  console.log(params);

  data = await DynamoDB.query(params).promise();

  return data;
};

module.exports.getUsersDetails = async (UserIDs) => {
  var response = {};

  var params = {
    TableName: constMessage.TABLE_NAME,
    KeyConditionExpression: "PK = :users",
    FilterExpression: "LSK IN (" + Object.keys(UserIDs).toString() + ")",
    ExpressionAttributeValues: UserIDs,
  };
  data = await DynamoDB.query(params).promise();
  return data;
};

module.exports.getCurrentWeekTasksOfWorkSpace = async (start, end, spaceID) => {
  var response = {};

  start = start.toString();
  end = end.toString();

  var params = {
    IndexName: "LSK-SK-index",
    KeyConditionExpression:
      "LSK = :spaceID AND SK BETWEEN :startTime AND :endTime",
    ExpressionAttributeValues: {
      ":startTime": start,
      ":endTime": end,
      ":spaceID": "Tasks#" + spaceID,
    },
    TableName: constMessage.TABLE_NAME,
  };

  data = await DynamoDB.query(params).promise();

  return data;
};

module.exports.getCurrentWeekTasksOfUser = async (start, end, userID) => {
  var response = {};

  start = start.toString();
  end = end.toString();

  var params = {
    //  IndexName: "LSK-SK-index",
    KeyConditionExpression:
      "PK = :userID AND SK BETWEEN :startTime AND :endTime",
    ExpressionAttributeValues: {
      ":startTime": start,
      ":endTime": end,
      ":userID": "Tasks#" + userID,
    },
    TableName: constMessage.TABLE_NAME,
  };

  data = await DynamoDB.query(params).promise();

  return data;
};

module.exports.getTodayStandUpTime = async (start, end, spaceID) => {
  var response = {};

  start = start.toString();
  end = end.toString();

  var params = {
    IndexName: "LSK-SK-index",
    KeyConditionExpression:
      "LSK = :spaceID AND SK BETWEEN :startTime AND :endTime",
    ExpressionAttributeValues: {
      ":startTime": start,
      ":endTime": end,
      ":spaceID": "Standup#" + spaceID,
    },
    TableName: constMessage.TABLE_NAME,
  };

  console.log(params);

  data = await DynamoDB.query(params).promise();
  return data;
};

module.exports.getTodayUserStandUpDetail = async (start, end, userID) => {
  var response = {};

  start = start.toString();
  end = end.toString();

  var params = {
    KeyConditionExpression:
      "PK = :userID AND SK BETWEEN :startTime AND :endTime",
    ExpressionAttributeValues: {
      ":startTime": start,
      ":endTime": end,
      ":userID": "Standup#" + userID,
    },
    TableName: constMessage.TABLE_NAME,
  };

  data = await DynamoDB.query(params).promise();

  var stanUpBO = {};

  if (data.Items.length > 0) {
    stanUpBO = {
      yesterday: data.Items[0].item2,
      today: data.Items[0].item1,
      roadblock: data.Items[0].item3,
      all: data.Items[0].item6,
      timestamp: data.Items[0].SK,
    };
  }

  return stanUpBO;
};

module.exports.checkIfUserAlreadyExists = async (email) => {
  var response = {};

  var params = {
    IndexName: "PK-LSK-index",
    KeyConditionExpression: "LSK = :userID AND PK = :user",
    ExpressionAttributeValues: {
      ":userID": email,
      ":user": "Users#",
    },
    // TableName: "VSpace_Local",
    TableName: constMessage.TABLE_NAME,
  };
  data = await DynamoDB.query(params).promise();

  return data;
};

module.exports.createNewUser = async (user) => {
  var response = {};
  var responseBO = {};
  var insertBO = [];
  var userAssembla = [];
  var id;
  var defaultSpaceIs = "";

  if (user.defaultSpace == undefined) {
    user.defaultSpace = " ";
  }
  //users are custom not from assembla.
  if (!user.isAssemblaUser) {
    //console.log("IN IF !user.isAssemblaUser----");
    id = await makeid(21);
    for (let x = 0; x < user.workSpaceIDs.length; x++) {
      const element = user.workSpaceIDs[x];
      var paramsBo = {
        KeyConditionExpression: "SK = :SpaceID AND PK = :PK",
        ExpressionAttributeValues: {
          ":SpaceID": element,
          ":PK": "Spaces#",
        },
        TableName: constMessage.TABLE_NAME,
      };

      dataBO = await DynamoDB.query(paramsBo).promise();
      var SpaceName = dataBO.Items[0].item2;

      userAssembla.push({
        PutRequest: {
          Item: {
            PK: "Space#" + element,
            SK: id,
            LSK: "Spaces#",
            item1: "Spaces#",
            item2: SpaceName,
            item3: user.email,
            item4: "",
            item5: "1",
          },
        },
      });
    }

    insertBO.push({
      PutRequest: {
        Item: {
          PK: "Users#",
          SK: id,
          LSK: user.email,
          item1: user.email,
          item2: "User#",
          item3: user.email,
          item4: "",
          item5: user.isAssemblaUser ? "1" : "0",
          item6: user.email + "125",
          // item7: user.picture,
          item8: user.name,
          teamName: user.teamName ? user.teamName : "",
          lead1: user.lead1 ? user.lead1 : "",
          lead2: user.lead2 ? user.lead2 : "",
          lead3: user.lead3 ? user.lead3 : "",
          Statusicon: "Statusicon",
          currentAvailabilityStatus: "0",
          userTextStatus: "Working from Home",
          userAvatar: "1",
          type: "Type",
          role: user.role,
          Status: "1",
          StatusHRM: "1",
          isLead: user.isLead,
          defaultSpace: user.defaultSpace,
        },
      },
    });
  } else {
    var AllAssemblaUsers = [];
    var mergedArray = [];
    for (let index = 0; index < user.workSpaceIDs.length; index++) {
      const workSpaceId = user.workSpaceIDs[index];
      var assemblaWorkSpaceData = await getSpaceUsers(workSpaceId);
      AllAssemblaUsers.push(assemblaWorkSpaceData.data);
    }
    for (let index = 0; index < AllAssemblaUsers.length; index++) {
      const firstArray = AllAssemblaUsers[index];
      for (let index = 0; index < firstArray.length; index++) {
        const element = firstArray[index];
        mergedArray.push(element);
      }
    }

    AllAssemblaUsers = mergedArray;
    var checkIfUserExists = await checkIfUserExistsInAssebla(
      AllAssemblaUsers,
      user.email
    );
    if (checkIfUserExists === 0) {
      return checkIfUserExists;
    }

    if (checkIfUserExists.length && checkIfUserExists.length > 0) {
      for (let x = 0; x < checkIfUserExists.length; x++) {
        const element = checkIfUserExists[x];
        if (element.email === user.email) {
          id = element.id;
          for (let x = 0; x < user.workSpaceIDs.length; x++) {
            const element = user.workSpaceIDs[x];
            userAssembla.push({
              PutRequest: {
                Item: {
                  PK: "Space#" + element,
                  SK: id,
                  LSK: "Spaces#",
                  item1: "Spaces#",
                  item3: user.email,
                  item4: "",
                  item5: "1",
                },
              },
            });
          }
        }
      }
    } else {
    }
    id = await makeid(21);
    insertBO.push({
      PutRequest: {
        Item: {
          PK: "Users#",
          SK: id,
          LSK: user.email,
          item5: "1",
          currentAvailabilityStatus: "0",
          item1: user.email,
          item2: "User#",
          item3: user.email,
          item6: user.password,
          item7: "",
          item8: user.name,
          teamName: user.teamName ? user.teamName : "",
          lead1: user.lead1 ? user.lead1 : "",
          lead2: user.lead2 ? user.lead2 : "",
          lead3: user.lead3 ? user.lead3 : "",
          role: user.role,
          Status: "1",
          item5: user.isAssemblaUser ? "1" : "0",
          isLead: user.isLead,
          Statusicon: " ",
          type: "1",
          StatusHRM: "1",
          userAvatar: " ",
          userTextStatus: " ",
          defaultSpace: user.defaultSpace,
        },
      },
    });
  }
  var tableName = constMessage.TABLE_NAME;
  // console.log("tableName:",tableName);
  let params = {
    RequestItems: {
      // 'test': insertBO
      VSpace_Local: insertBO,
    },
  };
  let params2 = {
    RequestItems: {
      // 'test': insertBO
      VSpace_Local: userAssembla,
    },
  };
  response = await DynamoDB.batchWrite(params).promise();
  responseBO = await DynamoDB.batchWrite(params2).promise();
  return response;
};

async function checkIfUserExistsInAssebla(assemblaUsers, email) {
  var userExists = [];
  if (assemblaUsers.length > 0) {
    for (let index = 0; index < assemblaUsers.length; index++) {
      const element = assemblaUsers[index];
      if (element.email === email) {
        userExists.push(element);
      }
    }
    if (userExists.length > 0) {
      return userExists;
    } else {
      return 0;
    }
  }
}

module.exports.forgetPassword = async (email, codeIs) => {
  var response = {};

  var params = {
    IndexName: "LSK-SK-index",
    KeyConditionExpression: "LSK = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
    TableName: constMessage.TABLE_NAME, //will be changed after producton
  };
  user = await DynamoDB.query(params).promise();

  if (user.Items.length > 0) {
    var userId = user.Items[0].PK;
    var userSK = user.Items[0].SK;

    var params2 = {
      TableName: constMessage.TABLE_NAME,
      Key: {
        PK: userId,
        SK: userSK,
      },
      UpdateExpression: "SET CodeIs =:CodeIs",
      ExpressionAttributeValues: {
        ":CodeIs": codeIs,
      },
    };

    data = await DynamoDB.update(params2).promise();

    return data;
  } else {
    console.log("no user found");
    return "0";
  }
};

module.exports.sendEmailToUserPassword = async (email, codeIs) => {
  var message = "<html><body>";
  message += "<table>";
  message +=
    "<tr><td><strong>Hi, </strong><br/> Please use this code to reset the password </td></tr>";
  message +=
    "<tr><td>  Here is your code: <strong>" + codeIs + "</strong> </td></tr>";

  message += "</table>";
  message += "</body></html>";

  var mailOptions = {
    from: constMessage.ADMIN_FOR_EMAIL,
    to: email,
    subject: "VSpace password reset",
    html: message,
  };

  const transporter = nodemailer.createTransport({
    pool: true,
    maxMessages: "Infinity",
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 465,
    secure: true, // use TLS
    auth: constants.auth,
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return 0;
    } else {
      return 1;
    }
  });
};

module.exports.sendEmailToUserOnActiveAccount = async (email) => {
  var message = "<html><body>";
  message += "<table>";
  message +=
    "<tr><td><strong>Hi, </strong><br/> Your Account on VSpace has been approved.</td></tr>";
  message += "<tr></tr>";

  message += "</table>";
  message += "</body></html>";

  var mailOptions = {
    from: constMessage.ADMIN_FOR_EMAIL,
    to: email, //
    subject: "VSpace account Update",
    html: message,
  };

  const transporter = nodemailer.createTransport({
    pool: true,
    maxMessages: "Infinity",
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 465,
    secure: true, // use TLS
    auth: constants.auth,
  });
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return 0;
    } else {
      return 1;
    }
  });
};

module.exports.sendEmailToAdmin = async (email) => {
  var message = "<html><body>";
  message += "<table>";
  message +=
    "<tr><td><strong>Hi, </strong><br/> New user with email  " +
    email +
    " register a new account.</td></tr>";
  message +=
    "<tr><td> Login to VSpace admin panel to accept or reject request.</td></tr>";
  message +=
    "<tr><td><strong>View details : </strong>" +
    constMessage.ADMIN_PANEL_URL +
    " </td></tr>";
  message += "</table>";
  message += "</body></html>";

  var mailOptions = {
    from: constMessage.ADMIN_FOR_EMAIL,
    to: constMessage.ADMIN_EMAIL,
    subject: "VSpace New User SignUp",
    html: message,
  };

  const transporter = nodemailer.createTransport({
    pool: true,
    maxMessages: "Infinity",
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 465,
    secure: true, // use TLS
    auth: constants.auth,
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return 0;
    } else {
      return 1;
    }
  });
};

module.exports.userChangePassword = async (email, codeIs, password) => {
  var response = {};

  //var codeIs=codeIs.toString();

  var params = {
    IndexName: "LSK-SK-index",
    KeyConditionExpression: "LSK = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
    TableName: constMessage.TABLE_NAME, //will be changed after producton
  };
  user = await DynamoDB.query(params).promise();

  if (user.Items.length > 0) {
    console.log("user found");
    if (user.Items[0].CodeIs == codeIs) {
      console.log("code correct");

      var userId = user.Items[0].PK;
      var userSK = user.Items[0].SK;

      var params2 = {
        TableName: constMessage.TABLE_NAME,
        Key: {
          PK: userId,
          SK: userSK,
        },
        UpdateExpression: "SET item6 =:password , CodeIs =:CodeIs",
        ExpressionAttributeValues: {
          ":password": password,
          ":CodeIs": "--------",
        },
      };

      data = await DynamoDB.update(params2).promise();
    } else {
      return -1;
    }

    return data;
  } else {
    console.log("no user found");
    return "0";
  }
};

//userUpdateProfile
module.exports.userUpdateProfile = async (data) => {
  var response = {};

  var params = {
    IndexName: "LSK-SK-index",
    KeyConditionExpression: "LSK = :email AND SK = :UserID",
    ExpressionAttributeValues: {
      ":email": data.email,
      ":UserID": data.UserID,
    },
    TableName: constMessage.TABLE_NAME,
  };
  user = await DynamoDB.query(params).promise();

  if (user.Items.length > 0) {
    var userId = user.Items[0].PK;
    var userSK = user.Items[0].SK;

    if (data.Password == "") {
      var params2 = {
        TableName: constMessage.TABLE_NAME,
        Key: {
          PK: userId,
          SK: userSK,
        },
        UpdateExpression: "SET item8 =:username",
        ExpressionAttributeValues: {
          ":username": data.UserName,
        },
      };
      data = await DynamoDB.update(params2).promise();

      return data;
    }

    if (user.Items[0].item6 == data.Password) {
      var params2 = {
        TableName: constMessage.TABLE_NAME,
        Key: {
          PK: userId,
          SK: userSK,
        },
        UpdateExpression: "SET item6 =:password , item8 =:username",
        ExpressionAttributeValues: {
          ":password": data.NewPassword,
          ":username": data.UserName,
        },
      };
      data = await DynamoDB.update(params2).promise();
    } else {
      return -1;
    }

    return data;
  } else {
    console.log("no user found");
    return "0";
  }
};

module.exports.getAllUsers = async () => {
  var response = {};

  //var codeIs=codeIs.toString();

  var params = {
    KeyConditionExpression: "PK = :users",
    ExpressionAttributeValues: {
      ":users": "Users#",
      ":StatusHRM": "1",
    },
    FilterExpression: "StatusHRM = :StatusHRM",
    TableName: constMessage.TABLE_NAME, //will be changed after producton
  };
  users = await DynamoDB.query(params).promise();

  var userBO = [];
  for (var i = 0; users.Items.length > i; i++) {
    if (users.Items[i].Status != "-2") {
      // -2 is for user deleted

      //	var UserWorkSpaces = await this.getUserWorkSpacesDetailsbyUserID(users.Items[i].SK);
      var defaultSpaceName = "Not Assigned";
      if (users.Items[i].defaultSpaceName == undefined) {
      } else {
        defaultSpaceName = users.Items[i].defaultSpaceName;
      }

      var user = {
        name: users.Items[i].item8,
        teamName: users.Items[i].teamName ? users.Items[i].teamName : "",
        lead1: users.Items[i].lead1 ? users.Items[i].lead1 : "",
        lead2: users.Items[i].lead1 ? users.Items[i].lead2 : "",
        lead3: users.Items[i].lead1 ? users.Items[i].lead3 : "",
        id: users.Items[i].SK,
        email: users.Items[i].LSK,
        Statusicon: users.Items[i].Statusicon,
        userTextStatus: users.Items[i].userTextStatus,
        Status: users.Items[i].Status,
        userAvatar: users.Items[i].userAvatar,
        picture: users.Items[i].item7,
        role: users.Items[i].role,
        currentAvailabilityStatus: users.Items[i].currentAvailabilityStatus,
        type: users.Items[i].type,
        gender: users.Items[i].item4,
        password: users.Items[i].item6,
        defaultSpace: users.Items[i].defaultSpace,
        SeatNo: users.Items[i].SeatNo,
        SeatNo: users.Items[i].SeatNo,
        defaultSpaceName: defaultSpaceName,
        isAssembla_User: users.Items[i].item5,
        isLead: users.Items[i].isLead ? true : false,
      };

      userBO.push(user);
    }
  }

  return userBO;
};

module.exports.getSpaceUsersList = async (data) => {
  var response = {};

  var params = {
    KeyConditionExpression: "PK = :users",
    ExpressionAttributeValues: {
      ":users": "Users#",
      ":defaultSpace": data.defaultSpace,
    },
    FilterExpression: "defaultSpace = :defaultSpace",
    TableName: constMessage.TABLE_NAME, //will be changed after producton
  };
  users = await DynamoDB.query(params).promise();

  var userBO = [];
  var a = 0;
  for (var i = 0; users.Items.length > i; i++) {
    if (users.Items[i].Status != "-2") {
      // -2 is for user deleted
      a++;
      //con

      //	var UserWorkSpaces = await this.getUserWorkSpacesDetailsbyUserID(users.Items[i].SK);

      var SeatNo = "333";
      if (
        users.Items[i].SeatNo == undefined ||
        users.Items[i].SeatNo == " " ||
        users.Items[i].SeatNo == ""
      ) {
        SeatNo == "Not";
      }

      var user = {
        name: users.Items[i].item8,
        id: a,
        userID: users.Items[i].SK,
        email: users.Items[i].LSK,
        Statusicon: users.Items[i].Statusicon,
        userTextStatus: users.Items[i].userTextStatus,
        Status: users.Items[i].Status,
        userAvatar: users.Items[i].userAvatar,
        picture: users.Items[i].item7,
        role: users.Items[i].role,
        currentAvailabilityStatus: users.Items[i].currentAvailabilityStatus,
        type: users.Items[i].type,
        gender: users.Items[i].item4,
        password: users.Items[i].item6,
        //	userSpaces: UserWorkSpaces.Items,
        defaultSpace: users.Items[i].defaultSpace,
        SeatNo: users.Items[i].SeatNo,
      };

      userBO.push(user);
    }
  }

  return userBO;
};
module.exports.getRoomDetails = async (data) => {
  var response = {};

  var userParams = {
    KeyConditionExpression: "PK = :room",
    ExpressionAttributeValues: {
      ":room": "Room#",
      ":LSK": "Room#" + data.roomId,
    },
    FilterExpression: "LSK = :LSK",
    TableName: constMessage.TABLE_NAME, //will be changed after producton
  };
  const users = await DynamoDB.query(userParams).promise();
  console.log(users);
  var detailsParams = {
    KeyConditionExpression: "PK = :rooms AND SK = :SK",
    ExpressionAttributeValues: {
      ":rooms": "Rooms#",
      ":SK": data.roomId,
    },
    TableName: constMessage.TABLE_NAME, //will be changed after producton
  };
  const details = await DynamoDB.query(detailsParams).promise();
  console.log("Room Details", details.Items[0]);
  return { users: users.Items, details: details.Items[0] };
};
module.exports.getConstants = async () => {
  var response = {};

  //var codeIs=codeIs.toString();

  var params = {
    KeyConditionExpression: "PK = :Constants",
    ExpressionAttributeValues: {
      ":Constants": "Constants",
    },
    TableName: constMessage.TABLE_NAME, //will be changed after producton
  };
  users = await DynamoDB.query(params).promise();

  return users.Items;
};

module.exports.postConstants = async (data) => {
  var response = {};

  var params2 = {
    // TableName: "VSpace_Local",
    TableName: constMessage.TABLE_NAME,
    Key: {
      PK: "Constants",
      SK: "Constants#Admin",
    },
    UpdateExpression: "SET hremail =:hremail",
    ExpressionAttributeValues: {
      ":hremail": data.hremail,
    },
  };

  data = await DynamoDB.update(params2).promise();
  return data;
};

module.exports.getAllUsersAllStatus = async () => {
  var response = {};
  var data;
  console.log("00000000000000");

  //var codeIs=codeIs.toString();

  var params = {
    KeyConditionExpression: "PK = :users",
    ExpressionAttributeValues: {
      ":users": "Users#",
    },
    // TableName: "VSpace_Local", //will be changed after producton
    TableName: constMessage.TABLE_NAME, //will be changed after producton
  };
  users = await DynamoDB.query(params).promise();
  var userBO = [];
  for (var i = 0; users.Items.length > i; i++) {
    const item = users.Items[i];
    if (item.isAssemblaUser) {
      var params2 = {
        // TableName: "VSpace_Local",
        TableName: constMessage.TABLE_NAME,
        Key: {
          PK: users.Items[i].PK,
          SK: users.Items[i].SK,
        },
        UpdateExpression: "SET #Status =:Status",
        ExpressionAttributeValues: {
          ":Status": "2", // 2 means user the company
        },
        ExpressionAttributeNames: {
          "#Status": "Status",
        },
      };

      data = await DynamoDB.update(params2).promise();
    }
  }

  return data;
};

module.exports.getAllUsersData = async () => {
  var response = {};
  var params = {
    KeyConditionExpression: "PK = :users",
    ExpressionAttributeValues: {
      ":users": "Users#",
    },
    // TableName: "VSpace_Local", //will be changed after producton
    TableName: constMessage.TABLE_NAME, //will be changed after producton
  };
  users = await DynamoDB.query(params).promise();
  return users;
};

module.exports.assignWorkSPacesToUser = async (data) => {
  var response = {};
  var userAssembla = [];

  var params = {
    IndexName: "LSK-SK-index",
    KeyConditionExpression: "LSK = :spaceID AND SK =:userID",
    ExpressionAttributeValues: {
      ":userID": data.userId,
      ":spaceID": "Spaces#",
    },
    TableName: constMessage.TABLE_NAME,
  };

  var spacesIS = await DynamoDB.query(params).promise();

  for (var i = 0; spacesIS.Items.length > i; i++) {
    var params2 = {
      TableName: constMessage.TABLE_NAME,
      Key: {
        PK: spacesIS.Items[i].PK,
        SK: spacesIS.Items[i].SK,
      },
    };

    data2 = await DynamoDB.delete(params2).promise();
  }

  for (var i = 0; data.WorkSpaces.length > i; i++) {
    const spaceId = data.WorkSpaces[i];
    var paramsBo = {
      KeyConditionExpression: "SK = :SpaceID AND PK = :PK",
      ExpressionAttributeValues: {
        ":SpaceID": spaceId,
        ":PK": "Spaces#",
      },
      TableName: constMessage.TABLE_NAME,
    };

    dataBO = await DynamoDB.query(paramsBo).promise();
    var SpaceName = dataBO.Items[0].item2;

    userAssembla.push({
      PutRequest: {
        Item: {
          PK: "Space#" + data.WorkSpaces[i],
          SK: data.userId,
          LSK: "Spaces#",
          item1: "Spaces#",
          // item2: constMessage.Space_Details[data.WorkSpaces[i]],
          item2: SpaceName,
          item3: data.email,
          item4: "",
          item5: "1",
        },
      },
    });
  }

  var arrayOfArray25 = chunkArrayInGroups(userAssembla, 25);

  arrayOfArray25.forEach(async function (item) {
    QueryParams = {
      RequestItems: {
        [constMessage.TABLE_NAME]: item,
      },
    };

    data = await DynamoDB.batchWrite(QueryParams).promise();
  });

  return data;
};

module.exports.updateUserActiveStatus = async (data, status) => {
  var params2 = {
    TableName: constMessage.TABLE_NAME,
    Key: {
      PK: "Users#",
      SK: data.userId,
    },
    UpdateExpression: "SET #Status =:Status,#role =:role",
    ExpressionAttributeNames: {
      "#Status": "Status", //COLUMN NAME
      "#role": "role",
    },
    ExpressionAttributeValues: {
      ":Status": status,
      ":role": data.role,
    },
  };

  DynamoDB.update(params2, function (err, data) {
    if (err) {
      response = {
        statusCode: constMessage.STATUS_CODE_501,
        message: constMessage.SOMETHING_WENT_WRONG,
        data: err,
      };
      return response;
    } else {
      return data;
    }
  });

  return data;
};

module.exports.deleteUser = async (data, status) => {
  var params2 = {
    TableName: constMessage.TABLE_NAME,
    Key: {
      PK: "Users#",
      SK: data.userId,
    },
    UpdateExpression: "SET #Status =:Status,#role =:role,#LSK =:email",
    ExpressionAttributeNames: {
      "#Status": "Status", //COLUMN NAME
      "#role": "role",
      "#LSK": "LSK",
    },
    ExpressionAttributeValues: {
      ":Status": status,
      ":role": data.role,
      ":email": data.email + "_Deleted",
    },
  };

  DynamoDB.update(params2, function (err, data) {
    if (err) {
      response = {
        statusCode: constMessage.STATUS_CODE_501,
        message: constMessage.SOMETHING_WENT_WRONG,
        data: err,
      };
      return response;
    } else {
      return data;
    }
  });

  return data;
};

module.exports.deleteUserForever = async (data, status) => {
  DynamoDB.delete(
    { Key: { PK: "Users#", SK: data.ID }, TableName: constMessage.TABLE_NAME },
    (error) => {
      if (error) {
        console.log("Delete fail");
        return 0;
      }
      console.log("Delete  Success");
      return 1;
    }
  );

  return data;
};

module.exports.deleteRecord = async (data) => {
  DynamoDB.delete(
    { Key: { PK: data.PK, SK: data.SK }, TableName: constMessage.TABLE_NAME },
    (error) => {
      if (error) {
        console.log("Delete fail", data.PK, data.SK);
        return 0;
      }
      console.log("Delete  Success", data.PK, data.SK);
      return 1;
    }
  );

  return data;
};

module.exports.rejectUserAdmin = async (data) => {
  var params2 = {
    TableName: constMessage.TABLE_NAME,
    Key: {
      PK: "Users#",
      SK: data.id,
    },
    UpdateExpression: "SET #Status =:Status,#message =:message",
    ExpressionAttributeNames: {
      "#Status": "Status", //COLUMN NAME
      "#message": "message",
    },
    ExpressionAttributeValues: {
      ":Status": data.type,
      ":message": data.message,
    },
  };

  DynamoDB.update(params2, function (err, data) {
    if (err) {
      response = {
        statusCode: constMessage.STATUS_CODE_501,
        message: constMessage.SOMETHING_WENT_WRONG,
        data: err,
      };
      return response;
    } else {
      return data;
    }
  });

  return data;
};

module.exports.updateUser = async (data) => {
  try {
    var params2 = {
      TableName: constMessage.TABLE_NAME,
      Key: {
        PK: "Users#",
        SK: data.EmployeeId,
      },
      UpdateExpression:
        "SET #Avatar =:val1,#Name =:val2,#Gender =:val3,#Email =:val4,#NewPassword =:val5",
      ExpressionAttributeNames: {
        "#Avatar": "userAvatar", //COLUMN NAME
        "#Name": "item8",
        "#Gender": "item4",
        "#Email": "item1",
        "#NewPassword": "item6",
      },
      ExpressionAttributeValues: {
        ":val1": data.Avatar,
        ":val2": data.Name,
        ":val3": data.Gender,
        ":val4": data.Email,
        ":val5": data.NewPassword,
      },
    };

    data = await DynamoDB.update(params2).promise();

    return data;
  } catch (error) {
    return "err";
  }
};

module.exports.getAllUsersAPI = async (email) => {
  var response = {};
  try {
    var params = {
      TableName: constMessage.TABLE_NAME,
      IndexName: "PK-LSK-index",
      KeyConditionExpression: "PK = :value",
      ExpressionAttributeValues: {
        ":value": "Users#",
        ":StatusHRM": "1",
      },
      FilterExpression: "StatusHRM = :StatusHRM",
    };

    const data = await DynamoDB.query(params).promise();
    return data;
  } catch (error) {
    response = {
      statusCode: constMessage.STATUS_CODE_501,
      message: constMessage.SOMETHING_WENT_WRONG,
      data: error,
    };
    return response;
  }

  response = {
    statusCode: constMessage.STATUS_CODE_200,
    message: constMessage.DATA_ADDED,
    data: [],
  };
  return response;
};

module.exports.updateUsersAllStatus = async (data) => {
  var users = [];
  var x = 1;

  for (var i = 0; i < data.length; i++) {
    var params2 = {
      // TableName: "VSpace_Local",
      TableName: constMessage.TABLE_NAME,
      Key: {
        PK: "Users#",
        SK: data[i].SK,
      },
      UpdateExpression:
        "SET currentAvailabilityStatus =:currentAvailabilityStatus,standupTime =:standupTime ",
      ExpressionAttributeValues: {
        ":currentAvailabilityStatus": "0",
        ":standupTime": "",
      },
    };
    userdata = await DynamoDB.update(params2).promise();
  }

  return 1;
};

module.exports.remainderEmail = async (data) => {
  // will move this in const
  var message = "<html><body>";
  message += "<table>";
  message += "<tr><td> " + data.body + "</td></tr>";
  message += "</table>";
  message += "</body></html>";
  var mailOptions = {
    from: constMessage.ADMIN_FOR_EMAIL,
    to: data.email,
    subject: data.subject,
    html: message,
  };
  const transporter = nodemailer.createTransport({
    pool: true,
    maxMessages: "Infinity",
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 465,
    secure: true, // use TLS
    auth: constants.auth,
  });
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return 0;
    } else {
      return 1;
    }
  });
};

module.exports.leaveEmail = async (data) => {
  var params = {
    KeyConditionExpression: "PK = :Constants",
    ExpressionAttributeValues: {
      ":Constants": "Constants",
    },
    TableName: constMessage.TABLE_NAME, //will be changed after producton
  };
  users = await DynamoDB.query(params).promise();
  var hrEmail = users.Items[0].hremail;

  // will move this in const
  var message = "<html><body>";
  message += "<table>";
  message +=
    "<tr><td> " +
    data.username +
    " (" +
    data.useremail +
    ") applied for " +
    data.leaveType +
    "Leave</td></tr>";
  message += "<tr><td> " + data.details + "</td></tr>";
  message += "</table>";
  message += "</body></html>";
  var mailOptions = {
    from: constMessage.ADMIN_FOR_EMAIL,
    to: hrEmail, // constMessage.HR_EMAIL,//data.email,
    subject: "GeniHRM Leave Application",
    html: message,
  };
  const transporter = nodemailer.createTransport({
    pool: true,
    maxMessages: "Infinity",
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 465,
    secure: true, // use TLS
    auth: constants.auth,
  });
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return 0;
    } else {
      return 1;
    }
  });
};

module.exports.addLeave = async (data) => {
  var dateIS = new Date();
  dateIS = dateIS.toString();
  var params = {
    TableName: constMessage.TABLE_NAME,
    Item: {
      PK: "Leave#",
      SK: "Leave#" + data.dateIs,
      LSK: data.LeaveTitle,
    },
  };
  data = await DynamoDB.put(params).promise();

  return data;
};

module.exports.listOfAllLeave = async (data) => {
  var params = {
    KeyConditionExpression: "PK = :Leave",
    ExpressionAttributeValues: {
      ":Leave": "Leave#",
    },
    TableName: constMessage.TABLE_NAME, //will be changed after producton
  };
  leavesBO = await DynamoDB.query(params).promise();
  return leavesBO.Items;
};

module.exports.addStandup = async (data) => {
  console.log("------------------addStandup-2---------------:");

  var params3 = {
    TableName: constMessage.TABLE_NAME,
    Key: {
      PK: "Users#",
      SK: data.userID,
    },
    UpdateExpression: "SET  #currentAvailabilityStatus =:val4",
    ExpressionAttributeNames: {
      "#currentAvailabilityStatus": "currentAvailabilityStatus",
    },
    ExpressionAttributeValues: {
      ":val4": "1",
    },
  };

  userdata = await DynamoDB.update(params3).promise();

  var dataBO;
  //fetch workSpace name.
  var paramsBo = {
    KeyConditionExpression: "SK = :SpaceID AND PK = :PK",
    ExpressionAttributeValues: {
      ":SpaceID": data.spaceId,
      ":PK": "Spaces#",
    },
    TableName: constMessage.TABLE_NAME,
    // TableName: "VSpace_Local",
  };

  dataBO = await DynamoDB.query(paramsBo).promise();
  var SpaceName = dataBO.Items[0].item2;

  var params = {
    TableName: constMessage.TABLE_NAME,
    Item: {
      PK: "Standup#" + data.userID,
      SK: data.dateTime,
      LSK: "Standup#" + SpaceName,
      item1: data.yesterday,
      item2: data.today,
      item3: data.roadblock,
      item4: data.dateTime,
      item5: data.username,
      item6: "",
      item7: "",
      item8: data.email,
      tagsIS: "Standup#",
    },
  };
  data = await DynamoDB.put(params).promise();
  return data;
};

module.exports.addTask = async (data) => {
  var params = {
    TableName: constMessage.TABLE_NAME,
    Item: {
      PK: "Tasks#" + data.userID,
      SK: data.dateTime,
      LSK: "Tasks#" + data.spaceId,
      item1: data.spaceId,
      item2: "TASK#",
      item3: "---",
      item4: data.title, //
      item5: data.hours,
      item6: "",
      item7: data.description,
      item8: "",
      milestoneId: data.milestoneId,
      // item9: data.milestoneId,
      tagsIS: "TASK#",
    },
  };
  data = await DynamoDB.put(params).promise();
  return data;
};

module.exports.syncUsers = async (getAllUsers, UsersStandUp, UsersTask) => {
  var userBOArrayIndex = 0;
  var usersAssembla = UsersStandUp,
    resultAssembla = usersAssembla.reduce(function (r, a) {
      var theDate = new Date(parseInt(a.SK));
      var dateString = theDate.toLocaleString();

      a.PK = a.PK.replace("Standup#", "");
      var filerOn = a.PK;
      r[filerOn] = r[filerOn] || [];

      if (typeof r[filerOn][0] !== "undefined") {
        // r[filerOn][0].standUpTime =r[filerOn][0].standUpTime + "\n" + dateString;
      } else {
        if (a != "") {
          a.standUpTime = "";
          a.standUpTime = dateString;
          r[filerOn].push(a);
        }
      }
      return r;
    }, Object.create(null));
  resultAssembla;

  var UsersTask = UsersTask,
    UsersTask = UsersTask.reduce(function (r, a) {
      a.PK = a.PK.replace("Tasks#", "");
      a.LSK = a.LSK.replace("Tasks#", "");
      var filerOn = a.PK;

      r[filerOn] = r[filerOn] || [];

      var d = new Date(parseInt(a.SK));
      var dateIs = d.getDate() + "_" + d.getMonth() + "_" + d.getFullYear();
      var dateIs2 = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();

      if (typeof r[filerOn][0] !== "undefined") {
        r[filerOn][0].totalHours =
          parseFloat(r[filerOn][0].totalHours) + parseFloat(a.item5);
        r[filerOn].push(a);
      } else {
        a.totalHours = parseFloat(a.item5);
        r[filerOn].push(a);
      }
      return r;
    }, Object.create(null));

  var users = [];
  var userBO = {};

  for (var a = 0; a < getAllUsers.length; a++) {
    var standup = "";
    var totalHours = "";
    var data = "";

    if (resultAssembla[getAllUsers[a].SK] != undefined) {
      standup = resultAssembla[getAllUsers[a].SK][0].SK;
    } else {
      standup = "StandUp missing";
    }

    if (UsersTask[getAllUsers[a].SK] != undefined) {
      totalHours = UsersTask[getAllUsers[a].SK][0].totalHours;

      for (var p = 0; p < UsersTask[getAllUsers[a].SK].length; p++) {
        data =
          data +
          "<a href='https://assembla.com/" +
          UsersTask[getAllUsers[a].SK][p].item6 +
          "'>#" +
          UsersTask[getAllUsers[a].SK][p].item3 +
          "</a> : " +
          UsersTask[getAllUsers[a].SK][p].item4 +
          "  - Hours spent = " +
          UsersTask[getAllUsers[a].SK][p].item5 +
          " Hours <br><br>";
      }
    } else {
      totalHours = "missing";
    }

    userBO = {
      email: getAllUsers[a].LSK,
      id: getAllUsers[a].SK,
      standup: standup,
      totalHours: totalHours,
      data: data,
      username: getAllUsers[a].item8,
      roleIs: getAllUsers[a].role,
      status: getAllUsers[a].Status,
    };

    users.push(userBO);
    if (userBO.roleIs == "User" && userBO.status == "1") {
      userBOArray.push(userBO);
    }
  }

  console.log("Users Length", userBOArray.length);
  let promises = [];
  for (var a = 0; a < userBOArray.length - 1; a++) {
    const mails = sendEmailRoutine();
    promises.push(transporter.sendMail(mails));
  }
  await Promise.allSettled(promises).then((r) => {
    const arr = r.filter((item) => item.status === "fulfilled");
    transporter.close();
    console.log(r);
    console.log(arr.length);
    console.log("connection closed");
  });
  console.log("Number of promises:", promises.length);
  return users;
};

function sendEmailRoutine(data) {
  data = userBOArray[userBOArrayIndex];
  userBOArrayIndex++;

  var d = new Date();
  d.setDate(d.getDate() - 1);

  var dateIs = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

  var message = "Dear " + data.username + ", <br><br>";
  //message += "---------- <br>";

  if (data.standup == "StandUp missing") {
    message += "Your standup for date " + dateIs + " was missing. <br><br>";
  } else {
    var dateIsNow = parseInt(data.standup);
    dateIsNow = dateIsNow + 18000000;
    var yesterday = new Date(dateIsNow);
    yesterday = yesterday.toLocaleString();
    message += "Your yesterday check-In time was " + yesterday + "<br><br>";
  }

  if (data.totalHours == "missing") {
    message += "Your hourlogs were missing for date " + dateIs + "<br><br>";
  } else {
    message +=
      "You worked on following tickets & in total " +
      data.totalHours +
      " hours on " +
      dateIs +
      "<br>";
    message += data.data;
  }

  message += "Regards, <br>";
  message += "Admin/HR <br>";
  message += "GenITeam System Generated Email <br>";
  message +=
    "(Do not reply to this email, if you have concerns discuss with your relevant Manager) <br>";
  message += "</table>";
  message += "</body></html>";

  var mailOptions = {
    from: constMessage.ADMIN_FOR_EMAIL,
    to: data.email,
    subject: "Daily Report",
    html: message,
  };
  return mailOptions;
}

function chunkArrayInGroups(arr, size) {
  var myArray = [];
  for (var i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
}

module.exports.addUserToWorkSpace = async (data) => {
  var response = {};
  var insertBO = [];
  for (let index = 0; index < data.wordSpaceIDs.length; index++) {
    const element = data.wordSpaceIDs[index];
    insertBO.push({
      PutRequest: {
        Item: {
          PK: "Space#",
          SK: element,
          LSK: data.email,
          isDeleted: false,
        },
      },
    });
  }
  var tableName = constMessage.TABLE_NAME;
  let params = {
    RequestItems: {
      tableName: insertBO,
    },
  };
  console.log(params);
  response = await DynamoDB.batchWrite(params).promise();

  return response;
};
module.exports.addUserToRoom = async (data) => {
  var response = {};
  var insertBO = [];
  const user = data.user;
  var params = {
    TableName: constMessage.TABLE_NAME,
    Item: {
      PK: "Room#",
      SK: data.roomId + "_" + user.userId,
      LSK: "Room#" + data.roomId,
      roomId: data.roomId,
      userName: user.name,
      userId: user.userId,
      userEmail: user.email,
      seatNo: user.seatNo,
    },
  };
  console.log(params);
  response = await DynamoDB.put(params).promise();
  console.log(response);
  return response;
};
module.exports.deleteUserFromRoom = async (data) => {
  var response = {};
  params = {
    TableName: constMessage.TABLE_NAME,
    // TableName: "VSpace_Local",
    Item: {
      PK: "Room#",
      SK: data.roomId + "_" + data.userId,
      LSK: "Room#" + data.roomId,
    },
  };
  console.log(params);
  response = await DynamoDB.delete(
    {
      Key: { PK: "Room#", SK: params.Item.SK },
      TableName: constMessage.TABLE_NAME,
    },
    (error) => {
      if (error) {
        console.log("Delete fail");
        return 0;
      }
      console.log("Delete  Success");
      return 1;
    }
  );
  console.log("response", response);
  return response;
};

async function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function getSpaceUsers(spaceId) {
  //get users details
  try {
    var AUTH_HEADERS = constMessage.AUTH_HEADERS;
    var dataIs = await axios.get(
      constMessage.APIurl + "/spaces/" + spaceId + "/users",
      { headers: AUTH_HEADERS }
    );
    // console.log("-----getSpaceUsers------",dataIs);
    return dataIs;

    response = {
      statusCode: constMessage.STATUS_CODE_200,
      message: constMessage.DATA_ADDED,
      data: dataIs,
    };
    return response;
  } catch (error) {
    return [];
  }
}

const delay = (millis) =>
  new Promise((resolve, reject) => {
    setTimeout((_) => resolve(), millis);
  });

module.exports.updateUserSeatNO = async (data) => {
  var response = {};
  var data;
  var userBO = [];
  var a = 0;
  for (var i = 0; i < data.users.length; i++) {
    a = a + 1;
    var params2 = {
      // TableName: "VSpace_Local",
      TableName: constMessage.TABLE_NAME,
      Key: {
        PK: "Users#",
        SK: data.users[i].userID,
      },
      UpdateExpression: "SET SeatNo =:SeatNo ",
      ExpressionAttributeValues: {
        ":SeatNo": a,
      },
    };

    userdata = await DynamoDB.update(params2).promise();
  }
  return data;
};

module.exports.updateWorkSpace = async (data) => {
  var data;
  var params2 = {
    // TableName: "VSpace_Local",
    TableName: constMessage.TABLE_NAME,
    Key: {
      PK: "Spaces#",
      SK: data.spaceID,
    },
    UpdateExpression: "SET roomType =:roomType",
    ExpressionAttributeValues: {
      ":roomType": data.roomType,
    },
  };
  userdata = await DynamoDB.update(params2).promise();
  return data;
};

module.exports.getUserTasksById = async (data, type) => {
  var taskID = type + data.userID;
  var start = data.start;
  var end = data.end;
  var scanResults = [];
  var params = {
    TableName: constMessage.TABLE_NAME,
    KeyConditionExpression: "PK = :task AND SK BETWEEN :start AND :end",
    ExpressionAttributeValues: {
      ":task": taskID,
      ":start": start,
      ":end": end,
    },
  };
  var dataIs;
  do {
    console.log("Scanning for more...");
    dataIs = await DynamoDB.query(params).promise();
    dataIs.Items.forEach((item) => scanResults.push(item));
    params.ExclusiveStartKey = dataIs.LastEvaluatedKey;
  } while (typeof dataIs.LastEvaluatedKey != "undefined");

  return scanResults;
};

module.exports.getUserById = async (userID) => {
  var response = {};
  var scanResults = [];
  try {
    var params = {
      TableName: constMessage.TABLE_NAME,
      KeyConditionExpression: "PK = :value AND SK = :userID",
      ExpressionAttributeValues: {
        ":value": "Users#",
        ":userID": userID,
      },
    };

    var dataIs;
    do {
      console.log("Scanning for more...");
      dataIs = await DynamoDB.query(params).promise();
      dataIs.Items.forEach((item) => scanResults.push(item));
      params.ExclusiveStartKey = dataIs.LastEvaluatedKey;
    } while (typeof dataIs.LastEvaluatedKey != "undefined");

    return scanResults;
  } catch (error) {
    response = {
      statusCode: constMessage.STATUS_CODE_501,
      message: constMessage.SOMETHING_WENT_WRONG,
      data: error,
    };
    return response;
  }

  response = {
    statusCode: constMessage.STATUS_CODE_200,
    message: constMessage.DATA_ADDED,
    data: [],
  };
  return response;
};

exports.getUsersByWorkspaceIds = async (data) => {
  var users = [];
  var workspaces = data.workspaces;

  var mydata = workspaces.map(function (item) {
    return "Space#" + item;
  });

  var scanResults = [];
  try {
    for (var i = 0; i < mydata.length; i++) {
      // let userIds= [];
      var params = {
        TableName: constMessage.TABLE_NAME,
        // IndexName: "PK-LSK-index",
        KeyConditionExpression: "PK = :space",
        ExpressionAttributeValues: {
          ":space": mydata[i],
        },
      };
      var dataIs;
      do {
        console.log("Scanning for more...");
        dataIs = await DynamoDB.query(params).promise();
        // dataIs.Items.forEach((item) => scanResults.push(item.SK));
        dataIs.Items.forEach((item) => scanResults.push(item.item3));
        params.ExclusiveStartKey = dataIs.LastEvaluatedKey;
      } while (typeof dataIs.LastEvaluatedKey != "undefined");
    }

    //generate filter expression based on scanResults
    var filterExpression = "LSK IN(";
    for (var i = 0; i < scanResults.length; i++) {
      filterExpression += ":email" + i + ",";
    }
    filterExpression = filterExpression.substring(
      0,
      filterExpression.length - 1
    );
    filterExpression += ")";

    //set values for filter expression
    var expressionAttributeValues = { ":value": "Users#" };

    for (var i = 0; i < scanResults.length; i++) {
      expressionAttributeValues[":email" + i] = scanResults[i];
    }

    var params2 = {
      TableName: constMessage.TABLE_NAME,
      KeyConditionExpression: "PK = :value",
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    };
    var userData = await DynamoDB.query(params2).promise();
    return userData.Items;
  } catch (err) {
    var response = {
      statusCode: constMessage.STATUS_CODE_501,
      message: constMessage.SOMETHING_WENT_WRONG,
      data: err,
    };
  }
  return response;
};

module.exports.getUsersByTaskID = async (data, type) => {
  var data = data;
  var scanResults = [];

  var taskID = type;
  var start = data.start;
  var end = data.end;
  var params = {
    TableName: constMessage.TABLE_NAME,
    IndexName: "LSK-SK-index",
    KeyConditionExpression: "LSK = :task AND SK BETWEEN :start AND :end",
    ExpressionAttributeValues: {
      ":task": taskID,
      ":start": start,
      ":end": end,
    },
  };

  var dataIs;
  do {
    dataIs = await DynamoDB.query(params).promise();
    dataIs.Items.forEach((item) => {
      scanResults.push(item);
    });
    params.ExclusiveStartKey = dataIs.LastEvaluatedKey;
  } while (typeof dataIs.LastEvaluatedKey != "undefined");
  return scanResults;
};

exports.getWorkspaceName = async (data) => {
  // var data = data;
  var response = {};
  var params = {
    TableName: constMessage.TABLE_NAME,
    KeyConditionExpression: "PK = :value",
    ExpressionAttributeValues: {
      ":value": data,
    },
  };
  const dataIs = await DynamoDB.query(params).promise();

  return dataIs.Items[0].item2;
};

exports.getWorkspaceIdsByName = async (data) => {
  var filterExpression = "item2 IN (";
  for (var i = 0; i < data.length; i++) {
    filterExpression += ":name" + i + ",";
  }
  filterExpression =
    filterExpression.substring(0, filterExpression.length - 1) + ")";
  var expressionAttributeValues = { ":value": "Spaces#" };
  for (var i = 0; i < data.length; i++) {
    expressionAttributeValues[":name" + i] = data[i];
  }

  var params = {
    TableName: constMessage.TABLE_NAME,
    IndexName: "LSK-index",
    KeyConditionExpression: "LSK = :value",
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  console.log(params);
  const dataIs = await DynamoDB.query(params).promise();

  var uniquePK = [];
  dataIs.Items.forEach(function (value) {
    if (uniquePK.indexOf(value.PK) === -1) {
      uniquePK.push(value.PK);
    }
  });

  var workspaceIds = [];
  uniquePK.forEach(function (value) {
    workspaceIds.push(value.substring(6));
  });
  return workspaceIds;
};

exports.getWorkspaceStandUps = async (data, spaceName) => {
  // var data = data;
  var scanResults = [];
  var params = {
    TableName: constMessage.TABLE_NAME,
    IndexName: "LSK-SK-index",
    KeyConditionExpression: "LSK = :value AND SK BETWEEN :start AND :end",
    ExpressionAttributeValues: {
      ":value": spaceName,
      ":start": data.start,
      ":end": data.end,
    },
  };

  var dataIs;
  do {
    console.log("Scanning for more...");
    dataIs = await DynamoDB.query(params).promise();
    dataIs.Items.forEach((item) => scanResults.push(item));
    params.ExclusiveStartKey = dataIs.LastEvaluatedKey;
  } while (typeof dataIs.LastEvaluatedKey != "undefined");

  return scanResults;
};

module.exports.getUserStandUpsById = async (data, type) => {
  var data = data;
  var scanResults = [];

  var taskID = type + data.userID;
  var params = {
    KeyConditionExpression: "PK = :task AND SK BETWEEN :start AND :end",
    ExpressionAttributeValues: {
      ":start": data.start,
      ":end": data.end,
      ":task": taskID,
    },
    TableName: constMessage.TABLE_NAME,
  };
  var dataIs;
  do {
    console.log("Scanning for more...");
    dataIs = await DynamoDB.query(params).promise();
    dataIs.Items.forEach((item) => scanResults.push(item));
    params.ExclusiveStartKey = dataIs.LastEvaluatedKey;
  } while (typeof dataIs.LastEvaluatedKey != "undefined");

  return scanResults;
};

//new Api for getting users according to their team leads ids.

exports.getUsersByLeadId = async (data) => {
  var users = [];
  console.log("hello");
  var tempID = data.Id;

  // var mydata = workspaces.map(function (item) {
  //   return "Space#" + item;
  // });

  var scanResults = [];
  try {
    if (tempID) {
      // let userIds= [];
      const params = {
        TableName: constMessage.TABLE_NAME,
        // IndexName: "teamId-createdAt-index",
        KeyConditionExpression: "PK = :Users",
        ExpressionAttributeValues: {
          ":Users": "Users#",
          ":lead1": data.Id,
          ":lead2": data.Id,
          ":lead3": data.Id,
        },
        FilterExpression: "lead1 = :lead1 or lead2 = :lead2  or lead3 = :lead3",
      };
      var dataIs;
      do {
        console.log("Scanning for more...");
        dataIs = await DynamoDB.query(params).promise();
        // dataIs.Items.forEach((item) => scanResults.push(item.SK));
        dataIs.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = dataIs.LastEvaluatedKey;
      } while (typeof dataIs.LastEvaluatedKey != "undefined");
    }

    return scanResults;

    // return scanResults;

    // return users;
  } catch (err) {
    var response = {
      statusCode: constMessage.STATUS_CODE_501,
      message: constMessage.SOMETHING_WENT_WRONG,
      data: err,
    };
  }
  return response;
};
