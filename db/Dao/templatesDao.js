var constMessage = require("../../services/constants");

const AWS = require("aws-sdk");
const { Space_Details, date } = require("../../services/constants");
AWS.config.update({ region: "us-west-2" });
const DynamoDB = new AWS.DynamoDB.DocumentClient();

function chunkArrayInGroups(arr, size) {
  var myArray = [];
  for (var i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
}

module.exports.addTemplate = async (data) => {
  console.log("1");
  var response = {};
  let templateName = data.templateName;
  let time = Date.now().toString();
  console.log(time);
  params = {
    TableName: constMessage.TABLE_NAME,
    Item: {
      PK: "addTemplate#",
      SK: time,
      // SK: data.templateName,
      item2: data.templateName,
      item3: data.fields,
      item4: data.teamName,
      item1: "addTemplate#",
      LSK: "addTemplate#",
      isDeleted: false,
    },
  };
  console.log(params);
  response = await DynamoDB.put(params).promise();
  console.log("response", response);
  return response;
};
module.exports.getAllTemplate = async () => {
  var response = {};
  var data = [];
  var params = {
    KeyConditionExpression: "PK = :addTemplate",
    ExpressionAttributeValues: {
      ":addTemplate": "addTemplate#",
    },
    TableName: constMessage.TABLE_NAME, //will be changed after producton
    // TableName: "VSpace_Local",
  };
  console.log(params);

  data = await DynamoDB.query(params).promise();
  // console.log("data", data);

  var spaceBO = []; // change name
  for (var i = 0; data.Items.length > i; i++) {
    if (data.Items[i].isDeleted != true) {
      // true is for user deleted
      var BO = {
        templateName: data.Items[i].item2,
        SK: data.Items[i].SK,
        teamName: data.Items[i].item4,
        fields: data.Items[i].item3,
        LSK: data.Items[i].LSK, // remove
        isDeleted: data.Items[i].isDeleted, //remove
      };

      spaceBO.push(BO);
    }
  }

  console.log(params);
  console.log("spaceBO", spaceBO);

  return spaceBO;
};

module.exports.editTemplate = async (data) => {
  var response = {};
  let timeStamp = data.timeStamp;
  let newTemplateName = data.newTemplateName;
  params = {
    TableName: constMessage.TABLE_NAME,
    Key: {
      PK: "addTemplate#",
      // SK: oldTemplateName,
      SK: timeStamp,
    },
    UpdateExpression:
      "SET item2 = :newTemplateName, item3 = :fields, item4 = :teamName",
    ExpressionAttributeValues: {
      ":newTemplateName": newTemplateName,
      ":fields": data.fields,
      ":teamName": data.teamName,
    },
    ReturnValues: "UPDATED_NEW",
  };
  console.log(params);
  response = await DynamoDB.update(params).promise();
  console.log("response", response);
  return response;
};

module.exports.deleteTemplate = async (data) => {
  var response = {};
  var id;

  params = {
    TableName: constMessage.TABLE_NAME,
    // TableName: "VSpace_Local",
    Item: {
      PK: "addTemplate#",
      SK: data.timeStamp,
      item2: data.templateName,
      LSK: "addTemplate#",
      // isDeleted: true,
      isDeleted: true,
      item1: "addTemplate#",
    },
  };

  console.log(params);

  response = await DynamoDB.put(params).promise();
  console.log("response", response);

  return response;
};

module.exports.editUserScore = async (data) => {
  let userId = data.userId;
  let timestamp = data.SK;
  let month = data.month;
  let lead = data.lead;
  let leadId = data.leadId;
  let details = data.details;
  let status = data.status;
  let lead1 = data.lead1UserId;
  let lead2 = data.lead2UserId;
  let lead3 = data.lead3UserId;
  let lead1Status = data.lead1Status;
  let lead2Status = data.lead2Status;
  let lead3Status = data.lead3Status;

  let totalScore = await calculateAveragScore(data);
  console.log(totalScore, "totalscorte");

  var params2 = {
    TableName: constMessage.TABLE_NAME,
    Key: {
      PK: "score#" + userId,
      SK: timestamp,
    },
    UpdateExpression:
      "SET #month =:month,#userId =:userId,#lead =:lead,#leadId =:leadId,#status =:status,#lead1 =:lead1,#lead2 =:lead2,#lead3 =:lead3,#lead1Status =:lead1Status,#lead2Status =:lead2Status,#lead3Status =:lead3Status,#totalScore =:totalScore,#details =:details",
    ExpressionAttributeNames: {
      "#month": "month", //COLUMN NAME
      "#userId": "userId",
      "#lead": "lead",
      "#leadId": "leadId",
      "#status": "status",
      "#lead1": "lead1",
      "#lead2": "lead2",
      "#lead3": "lead3",
      "#lead1Status": "lead1Status",
      "#lead2Status": "lead2Status",
      "#lead3Status": "lead3Status",
      "#totalScore": "totalScore",
      "#details": "details",
    },
    ExpressionAttributeValues: {
      ":month": month,
      ":userId": userId,
      ":lead": lead,
      ":leadId": leadId,
      ":status": status,
      ":lead1": lead1,
      ":lead2": lead2,
      ":lead3": lead3,
      ":lead1Status": lead1Status,
      ":lead2Status": lead2Status,
      ":lead3Status": lead3Status,
      ":totalScore": totalScore,
      ":details": details,
    },
  };
  try {
    data = await DynamoDB.update(params2).promise();
  } catch (error) {
    console.log(error);
  }
  console.log(data);

  return data;
};
