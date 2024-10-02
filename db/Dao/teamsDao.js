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

module.exports.addTeam = async (data) => {
  var response = {};
  var id;

  params = {
    TableName: constMessage.TABLE_NAME,
    Item: {
      PK: "Teams#",
      SK: data.teamName,
      item2: data.teamName,
      item1: "Teams#",
      LSK: "Teams#",
      isDeleted: false,
    },
  };
  console.log(params);
  response = await DynamoDB.put(params).promise();
  console.log("response", response);
  return response;
};
module.exports.editTeam = async (data) => {
  var response = {};
  var id;
  //   deleteteam
  DynamoDB.delete(
    {
      Key: {
        PK: "Teams#",
        SK: data.oldTeamName,
      },
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
  //   add team
  params = {
    TableName: constMessage.TABLE_NAME,
    Item: {
      PK: "Teams#",
      SK: data.teamName,
      item2: data.teamName,
      item1: "Teams#",
      LSK: "Teams#",
      isDeleted: false,
    },
  };
  console.log(params);
  response = await DynamoDB.put(params).promise();
  console.log("response", response);
  //////////////////////////////// update users teamname
  var params = {
    TableName: constMessage.TABLE_NAME,
    IndexName: "PK-LSK-index",
    KeyConditionExpression: "PK = :value",
    ExpressionAttributeValues: {
      ":value": "Users#",
      ":teamName": data.oldTeamName,
    },
    FilterExpression: "teamName = :teamName",
  };

  let mdata = await DynamoDB.query(params).promise();
  const allParams = [];
  for (let i = 0; mdata.Items.length > i; i++) {
    allParams.push({
      PutRequest: {
        TableName: constMessage.TABLE_NAME,
        Item: {
          ...mdata.Items[i],
          teamName: data.teamName,
        },
      },
    });
  }
  var arrayOfArray25 = chunkArrayInGroups(allParams, 25);

  for (const item of arrayOfArray25) {
    QueryParams = {
      RequestItems: {
        [constMessage.TABLE_NAME]: item,
      },
    };
    //batchWrite of 25 items max
    data = await DynamoDB.batchWrite(QueryParams).promise();
  }
  return response;
};
module.exports.getAllTeams = async () => {
  var response = {};
  var data = [];
  var params = {
    KeyConditionExpression: "PK = :Teams",
    ExpressionAttributeValues: {
      ":Teams": "Teams#",
    },
    TableName: constMessage.TABLE_NAME, //will be changed after producton
    // TableName: "VSpace_Local",
  };
  console.log(params);

  data = await DynamoDB.query(params).promise();

  var spaceBO = [];
  for (var i = 0; data.Items.length > i; i++) {
    if (data.Items[i].isDeleted != true) {
      // true is for user deleted
      var BO = {
        PK: data.Items[i].PK,
        SK: data.Items[i].SK,
        teamName: data.Items[i].item2,
        LSK: data.Items[i].LSK,
        isDeleted: data.Items[i].isDeleted,
        roomType: data.Items[i].roomType,
      };

      spaceBO.push(BO);
    }
  }

  console.log(params);
  console.log("spaceBO", spaceBO);

  return spaceBO;
};
module.exports.deleteTeam = async (data) => {
  var response = {};
  var id;

  params = {
    TableName: constMessage.TABLE_NAME,
    // TableName: "VSpace_Local",
    Item: {
      PK: "Teams#",
      SK: data.teamName,
      item2: data.teamName,
      LSK: "Teams#",
      isDeleted: data.isDeleted ? true : false,
      item1: "Teams#",
    },
  };

  console.log(params);

  response = await DynamoDB.put(params).promise();
  console.log("response", response);

  ///////////////////////////////////// update users bo
  var params = {
    TableName: constMessage.TABLE_NAME,
    IndexName: "PK-LSK-index",
    KeyConditionExpression: "PK = :value",
    ExpressionAttributeValues: {
      ":value": "Users#",
      ":teamName": data.teamName,
    },
    FilterExpression: "teamName = :teamName",
  };

  let mdata = await DynamoDB.query(params).promise();
  const allParams = [];
  for (let i = 0; mdata.Items.length > i; i++) {
    allParams.push({
      PutRequest: {
        TableName: constMessage.TABLE_NAME,
        Item: {
          ...mdata.Items[i],
          teamName: "",
        },
      },
    });
  }
  var arrayOfArray25 = chunkArrayInGroups(allParams, 25);

  for (const item of arrayOfArray25) {
    QueryParams = {
      RequestItems: {
        [constMessage.TABLE_NAME]: item,
      },
    };
    //batchWrite of 25 items max
    data = await DynamoDB.batchWrite(QueryParams).promise();
  }
  return response;
};
