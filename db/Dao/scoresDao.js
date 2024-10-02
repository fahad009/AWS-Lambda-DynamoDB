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

module.exports.addUserScore = async (data) => {
  var response = {};

  let totalScore = await calculateAveragScore(data);

  var month = data.month;
  var userId = data.userId;
  var lead = data.lead;
  var leadId = data.leadId;
  var scoreType = data.scoreType;
  var lead1Comments = data.lead1Comments;
  var lead2Comments = data.lead2Comments;
  var lead3Comments = data.lead3Comments;
  var details = data.details;
  var status = data.status;
  let lead1 = data.lead1UserId;
  let lead2 = data.lead2UserId;
  let lead3 = data.lead3UserId;
  let lead1Status = data.lead1Status;
  let lead2Status = data.lead2Status;
  let lead3Status = data.lead3Status;
  let templateName = data.templateName;
  let hrComments = data.hrComments;

  const currentDate = new Date();
  const previousMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    5
  );
  console.log(previousMonth, "previousMonth");
  const timestampunix = previousMonth.getTime() / 1000;
  console.log(timestampunix, "timestampunixtimestampunix");
  let prevMonthString = timestampunix.toString();

  params = {
    TableName: constMessage.TABLE_NAME,
    Item: {
      PK: "score#" + userId,
      SK: prevMonthString,
      month: month,
      userId: userId,
      lead: lead,
      leadId: leadId,
      scoreType: scoreType,
      lead1Comments: lead1Comments,
      lead2Comments: lead2Comments,
      lead3Comments: lead3Comments,
      lead1: lead1,
      lead2: lead2,
      lead3: lead3,
      lead1Status: lead1Status,
      lead2Status: lead2Status,
      lead3Status: lead3Status,
      templateName: templateName,
      totalScore: totalScore,
      hrComments: hrComments,
      details: details,
      status: status,
      LSK: "score#",
      isApproved: false,
    },
  };
  console.log(params);
  response = await DynamoDB.put(params).promise();
  console.log("response", response);
  return params.Item;
};
module.exports.getAllScores = async (data) => {
  var response = {};
  let start = data.start;
  let end = data.end;

  var params = {
    TableName: constMessage.TABLE_NAME,
    IndexName: "LSK-SK-index",
    KeyConditionExpression: "LSK = :score AND SK BETWEEN :start AND :end",
    ExpressionAttributeValues: {
      ":score": "score#",
      ":start": start,
      ":end": end,
    },
  };

  let tempdata = await DynamoDB.query(params).promise();

  console.log("data", tempdata.Items.length);

  var userBO = [];
  for (var i = 0; tempdata.Items.length > i; i++) {
    console.log(tempdata.Items[i]);

    let result = tempdata.Items[i];
    userBO.push(result);
  }
  console.log(userBO.length, "bo");
  return userBO;
};
module.exports.getScoresbyLead = async (data) => {
  var response = {};
  userId = data.userId;
  let start = data.start;
  let end = data.end;

  var params = {
    TableName: constMessage.TABLE_NAME,
    IndexName: "LSK-SK-index",
    KeyConditionExpression: "LSK = :score AND SK BETWEEN :start AND :end",
    ExpressionAttributeValues: {
      ":score": "score#",
      ":start": start,
      ":end": end,
    },
  };

  console.log(params);

  data = await DynamoDB.query(params).promise();
  console.log("data", data);

  return data.Items;
};
module.exports.getScoreByUserId = async (data) => {
  userId = data.userId;
  let start = data.start;
  let end = data.end;
  var params = {
    TableName: constMessage.TABLE_NAME,
    KeyConditionExpression: "PK = :score AND SK BETWEEN :start AND :end",
    ExpressionAttributeValues: {
      ":score": "score#" + userId,
      ":start": start,
      ":end": end,
    },
  };

  console.log(params);

  let tempData = await DynamoDB.query(params).promise();

  console.log("datalocal", data);

  let scoreBO = [];
  for (var i = 0; tempData.Items.length > i; i++) {
    console.log(tempData.Items[i]);

    if (tempData.Items[i].isApproved) {
      let result = tempData.Items[i];
      scoreBO.push(result);
    }
  }
  console.log(scoreBO.length, "boo");

  return scoreBO;
};
module.exports.editUserScore = async (data) => {
  let userId = data.userId;
  let timestamp = data.SK;
  let month = data.month;
  let lead = data.lead;
  let leadId = data.leadId;
  var scoreType = data.scoreType;
  var lead1Comments = data.lead1Comments;
  var lead2Comments = data.lead2Comments;
  var lead3Comments = data.lead3Comments;
  let details = data.details;
  let status = data.status;
  let lead1 = data.lead1UserId;
  let lead2 = data.lead2UserId;
  let lead3 = data.lead3UserId;
  let lead1Status = data.lead1Status;
  let lead2Status = data.lead2Status;
  let lead3Status = data.lead3Status;
  let hrComments = data.hrComments;
  let totalScore = await calculateAveragScore(data);
  console.log(totalScore, "totalscorte");

  var params2 = {
    TableName: constMessage.TABLE_NAME,
    Key: {
      PK: "score#" + userId,
      SK: timestamp,
    },
    UpdateExpression:
      "SET #month =:month,#userId =:userId,#lead =:lead,#leadId =:leadId,#scoreType =:scoreType,#lead1Comments =:lead1Comments,#lead2Comments =:lead2Comments,#lead3Comments =:lead3Comments,#status =:status,#lead1 =:lead1,#lead2 =:lead2,#lead3 =:lead3,#lead1Status =:lead1Status,#lead2Status =:lead2Status,#lead3Status =:lead3Status,#totalScore =:totalScore,#details =:details,#hrComments=:hrComments",
    ExpressionAttributeNames: {
      "#month": "month", //COLUMN NAME
      "#userId": "userId",
      "#lead": "lead",
      "#leadId": "leadId",
      "#scoreType": "scoreType",
      "#lead1Comments": "lead1Comments",
      "#lead2Comments": "lead2Comments",
      "#lead3Comments": "lead3Comments",
      "#status": "status",
      "#lead1": "lead1",
      "#lead2": "lead2",
      "#lead3": "lead3",
      "#lead1Status": "lead1Status",
      "#lead2Status": "lead2Status",
      "#lead3Status": "lead3Status",
      "#totalScore": "totalScore",
      "#details": "details",
      "#hrComments": "hrComments",
    },
    ExpressionAttributeValues: {
      ":month": month,
      ":userId": userId,
      ":lead": lead,
      ":leadId": leadId,
      ":scoreType": scoreType,
      ":lead1Comments": lead1Comments,
      ":lead2Comments": lead2Comments,
      ":lead3Comments": lead3Comments,
      ":status": status,
      ":lead1": lead1,
      ":lead2": lead2,
      ":lead3": lead3,
      ":lead1Status": lead1Status,
      ":lead2Status": lead2Status,
      ":lead3Status": lead3Status,
      ":totalScore": totalScore,
      ":details": details,
      ":hrComments": hrComments,
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
module.exports.approveScore = async (data) => {
  try {
    const params2 = {
      TableName: constMessage.TABLE_NAME,
      Key: {
        PK: data.PK,
        SK: data.SK,
      },
      UpdateExpression: "SET #IsApproved =:val1",
      ExpressionAttributeNames: {
        "#IsApproved": "isApproved", //COLUMN NAME
      },
      ExpressionAttributeValues: {
        ":val1": true,
      },
    };

    data = await DynamoDB.update(params2).promise();

    return data;
  } catch (error) {
    console.log(error, "qqqqqqqqq");
    return "err";
  }
};
module.exports.getUsersScoresByLeadId = async (data) => {
  let start = data.start;
  let end = data.end;
  let userIds = data.userIds;

  if (userIds.length > 0) {
    let scoreBOs = [];
    for (let userId of userIds) {
      let params = {
        TableName: constMessage.TABLE_NAME,
        KeyConditionExpression: "PK = :score AND SK BETWEEN :start AND :end",
        ExpressionAttributeValues: {
          ":score": "score#" + userId,
          ":start": start,
          ":end": end,
        },
      };
      let tempData = await DynamoDB.query(params).promise();
      let scoreBO = [];
      for (var i = 0; tempData.Items.length > i; i++) {
        // console.log(tempData.Items[i]);
        let result = tempData.Items[i];
        scoreBO.push(result);
      }
      scoreBOs.push({ userId, scores: scoreBO });
    }
    return scoreBOs;
  } else {
    var params = {
      TableName: constMessage.TABLE_NAME,
      IndexName: "LSK-SK-index",
      KeyConditionExpression: "LSK = :score AND SK BETWEEN :start AND :end",
      ExpressionAttributeValues: {
        ":score": "score#",
        ":start": start,
        ":end": end,
      },
    };

    // console.log(params);

    let tempdata = await DynamoDB.query(params).promise();

    console.log("data", tempdata.Items.length);

    var allScoreBo = [];
    for (var i = 0; tempdata.Items.length > i; i++) {
      console.log(tempdata.Items[i]);

      let result = tempdata.Items[i];
      console.log(i, "boooooooooooooooooooo");
      allScoreBo.push(result);
    }
    console.log(allScoreBo.length, "boooooooooooooooooooo");
    return allScoreBo;
  }
};
const calculateAveragScore = async (data) => {
  let sum = 0;
  let counter = 0;
  let totalAverage = 0;
  let totalSum = 0;
  if (data.details.general) {
    for (const scores in data.details.general) {
      sum += Number(data.details.general[scores]);
      console.log(sum, "summmmmm");
      counter++;
      console.log(counter, "counterrrrrrrr");
    }

    let average = 0;
    average = sum / counter;
    let totalScore = average;
    console.log(totalScore, "totalScorefinal");
    return totalScore;
  } else {
    data.details.projects.map((project) => {
      totalSum++;
      projectWeightage = project.weightage;
      projectParameters = project.parameters;

      let paramSum = 0;
      let paramsCount = 0;
      for (const projectwise in projectParameters) {
        averaging = projectParameters[projectwise];
        paramsCount++;
        paramSum += averaging;
      }
      projectAverage = paramSum / paramsCount;
      counter = 0;
      console.log(projectAverage, "one by one average original");

      averageProjectWeightage = (projectAverage * projectWeightage) / 100;
      console.log(averageProjectWeightage, "final average");

      totalAverage += averageProjectWeightage;
    });

    let totalScore = totalAverage;
    return totalScore;
  }
};
