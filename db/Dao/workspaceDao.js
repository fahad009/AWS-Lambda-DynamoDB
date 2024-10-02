//Imports
var constMessage = require("../../services/constants");
var aws = require("aws-sdk");
const axios = require("axios");
var { getAllWorkSpaces } = require("../../services/publicServices");

const AWS = require("aws-sdk");
const { Space_Details } = require("../../services/constants");
AWS.config.update({ region: "us-west-2" });
const DynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.addScore = async (data) => {
  var response = {};
  var id;

  params = {
    TableName: constMessage.TABLE_NAME,
    Item: {
      PK: "addTemplate#",
      SK: data.score1,
      item5: data.score1,
      item2: data.score2,
      item3: data.score3,
      item4: data.score4,
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

module.exports.addWorkSpace = async (data) => {
  var response = {};
  var id;

  if (!data.isAssemblaSpace) {
    id = await makeid(21);
  } else {
    var AUTH_HEADERS = constMessage.AUTH_HEADERS;
    dataIs = await axios.get(constMessage.APIurl + "/spaces" + ".json", {
      headers: AUTH_HEADERS,
    });
    id = await getSpace(dataIs, data);
    console.log("id------------", id);
    if (!id) {
      return false;
    }
  }
  params = {
    TableName: constMessage.TABLE_NAME,
    // TableName: "VSpace_Local",
    Item: {
      PK: "Spaces#",
      SK: id,
      item2: data.spaceName,
      item1: "Spaces#",
      LSK: "Space#",
      isAssemblaSpace: data.isAssemblaSpace ? true : false,
      isDeleted: false,
      customSpace: data.isAssemblaSpace ? true : false,
    },
  };
  console.log(params);
  response = await DynamoDB.put(params).promise();
  console.log("response", response);
  return response;
};

module.exports.addMilestone = async (data) => {
  data.id = await makeid(21);

  const params = {
    TableName: constMessage.TABLE_NAME,
    Item: {
      ...data,
      PK: "Milestones#",
      SK: data.id + "",
      item1: "Milestones#",
      item2: data.title,
      item3: data.status,
      item4: data.spaceId,
      LSK: "Milestone#",
      spaceId: data.spaceId,
      tagsIS: data.spaceId,
      isAssemblaMilestone: data.isAssemblaMilestone,
      isDeleted: false,
    },
  };
  console.log(params);
  const response = await DynamoDB.put(params).promise();
  console.log("response", response);
  return response;
};

const setAllMilestonesToInActive = async (spaceId) => {
  const params = {
    KeyConditionExpression: "tagsIS = :tagsIS",
    ExpressionAttributeValues: {
      ":tagsIS": spaceId,
      ":is_completed": false,
    },
    FilterExpression: "is_completed = :is_completed",
    IndexName: "tagsIS-SK-index",
    TableName: constMessage.TABLE_NAME,
  };

  let mdata = await DynamoDB.query(params).promise();
  // console.log("data", mdata);

  const allParams = [];
  for (let i = 0; mdata.Items.length > i; i++) {
    allParams.push({
      PutRequest: {
        TableName: constMessage.TABLE_NAME,
        Item: {
          ...mdata.Items[i],
          PK: "Milestones#",
          SK: mdata.Items[i].id + "",
          item1: "Milestones#",
          LSK: "Milestone#",
          spaceId: mdata.Items[i].space_id,
          isActive: false,
          is_completed: true,
        },
      },
    });

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
  }

  return [];
};

function chunkArrayInGroups(arr, size) {
  var myArray = [];
  for (var i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
}

module.exports.syncMilestonesOfSpace = async (data) => {
  const spaceId = data.spaceId;
  console.log("spaceId", spaceId);

  const AUTH_HEADERS = constMessage.AUTH_HEADERS;
  const dataIs = await axios.get(
    constMessage.APIurl + `/spaces/${data.spaceId}/milestones?per_page=25`,
    { headers: AUTH_HEADERS }
  );
  const milestones = dataIs.data;
  console.log("milestones ------------", milestones);

  await setAllMilestonesToInActive(spaceId); ///////////////// fix it fahad bhi

  const allParams = [];
  for (const milestone of milestones) {
    // var isCompleted=false;
    // if (!milestone.completed_date) {
    //     isCompleted = false;
    // }
    // else{
    //     isCompleted = true;
    // }
    // console.log("isCompleted", isCompleted);
    allParams.push({
      PutRequest: {
        TableName: constMessage.TABLE_NAME,
        Item: {
          ...milestone,
          PK: "Milestones#",
          SK: milestone.id + "",
          item1: "Milestones#",
          LSK: "Milestone#",
          spaceId: milestone.space_id,
          tagsIS: milestone.space_id,
          isActive: true,
          is_completed: false,
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
    //
    data = await DynamoDB.batchWrite(QueryParams).promise();
  }

  return true;
};

module.exports.getMilestone = async (data) => {
  var response = {};
  var dataBO = [];
  var spaceBO = [];
  var params = {
    KeyConditionExpression: "SK = :milestoneId AND PK = :PK",
    ExpressionAttributeValues: {
      ":milestoneId": data.milestoneId,
      ":PK": "Milestones#",
    },
    TableName: constMessage.TABLE_NAME,
  };
  dataBO = await DynamoDB.query(params).promise();
  console.log(dataBO);
  for (let i = 0; dataBO.Items.length > i; i++) {
    if (dataBO.Items[i].isDeleted != true) {
      // true is for user deleted
      spaceBO.push({ ...dataBO.Items[i] });
    }
  }

  return spaceBO;
};
module.exports.getAllMilestones = async () => {
  let data = [];
  const params = {
    KeyConditionExpression: "PK = :milestone",
    ExpressionAttributeValues: {
      ":milestone": "Milestones#",
    },
    TableName: constMessage.TABLE_NAME, //will be changed after producton
    // TableName: "VSpace_Local",
  };

  data = await DynamoDB.query(params).promise();

  const response = [];
  for (let i = 0; data.Items.length > i; i++) {
    if (data.Items[i].isDeleted != true) {
      response.push(data.Items[i]);
    }
  }

  return response;
};
module.exports.getAllMilestonesOfSpace = async (_data) => {
  let data = [];
  // const params = {
  //     KeyConditionExpression: "PK = :Milestone",
  //     ExpressionAttributeValues: {
  //         ":Milestone": "Milestones#"
  //     },
  //     TableName: constMessage.TABLE_NAME
  // };

  console.log(_data);

  const params = {
    KeyConditionExpression: "tagsIS = :tagsIS",
    ExpressionAttributeValues: {
      ":tagsIS": _data.spaceId,
      ":isCompleted": false,
      // ":isActive": true
    },
    FilterExpression: "is_completed = :isCompleted",
    IndexName: "tagsIS-SK-index",
    TableName: constMessage.TABLE_NAME,
  };

  data = await DynamoDB.query(params).promise();
  console.log("data", data);
  return data.Items;
};
module.exports.getMilestoneDetail = async (_data) => {
  const milestonesParams = {
    KeyConditionExpression: "PK = :PK AND SK = :milestoneId ",
    ExpressionAttributeValues: {
      ":milestoneId": _data.milestoneId,
      ":PK": "Milestones#",
    },
    TableName: constMessage.TABLE_NAME,
  };

  const milestonesData = await DynamoDB.query(milestonesParams).promise();
  // console.log("milestonesData", milestonesData);

  // console.log("underscore data", _data);

  const tasksParams = {
    KeyConditionExpression: "tagsIS = :tagsIS AND milestoneId = :milestoneId",
    ExpressionAttributeValues: {
      ":milestoneId": _data.milestoneId,
      ":tagsIS": "TASK#",
    },
    IndexName: "tagsIS-milestoneId-index",
    TableName: constMessage.TABLE_NAME,
  };
  console.log("tasksParams", tasksParams);

  const tasksData = await DynamoDB.query(tasksParams).promise();
  console.log("tasksData", tasksData);

  const milestones = [];
  for (let i = 0; milestonesData.Items.length > i; i++) {
    if (milestonesData.Items[i].isDeleted !== true) {
      // true is for user deleted
      milestones.push({
        ...milestonesData.Items[i],
        tasks: tasksData.Items,
      });
    }
  }

  return milestones;
};
module.exports.editMilestone = async (data) => {
  console.log("request data", data);
  const params = {
    TableName: constMessage.TABLE_NAME,
    Item: {
      PK: "Milestones#",
      SK: data.id + "",
      LSK: "Space#",
      item1: "Milestones#",
      isAssemblaMilestone: !!data.isAssemblaMilestone,
      ...data,
    },
  };

  console.log("Request Params for DB", params);

  const response = await DynamoDB.put(params).promise();
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

async function getSpace(dataIs, data) {
  var id;
  var found = false;
  for (let index = 0; index < dataIs.data.length; index++) {
    const element = dataIs.data[index];
    console.log("element:", element.name);
    if (element.name.toLowerCase() === data.spaceName.toLowerCase()) {
      console.log("elementID:", element.id);
      id = element.id;
      found = true;
    }
  }
  if (found) {
    return id;
  } else {
    return found;
  }
}

async function getMilestone(dataIs, data) {
  let milestone = null,
    found = false;
  for (let index = 0; index < dataIs.data.length; index++) {
    const element = dataIs.data[index];
    console.log("element:", element.title);
    if (element.title.toLowerCase() === data.title.toLowerCase()) {
      console.log("elementID:", element.id);
      milestone = element;
      found = true;
    }
  }
  if (found) {
    return milestone;
  } else {
    return found;
  }
}

module.exports.editWorkSpace = async (data) => {
  var response = {};
  var id;

  params = {
    TableName: constMessage.TABLE_NAME,
    // TableName: "VSpace_Local",
    Item: {
      PK: "Spaces#",
      SK: data.AssemblaSpaceId,
      item2: data.spaceName,
      LSK: "Space#",
      isAssemblaSpace: data.isAssemblaSpace ? true : false,
      isDeleted: data.isDeleted ? true : false,
      customSpace: data.isAssemblaSpace ? true : false,
      item1: "Spaces#",
    },
  };

  console.log(params);

  response = await DynamoDB.put(params).promise();
  console.log("response", response);
  return response;
};

module.exports.deleteWorkSpace = async (data) => {
  var response = {};
  var id;

  params = {
    TableName: constMessage.TABLE_NAME,
    // TableName: "VSpace_Local",
    Item: {
      PK: "Spaces#",
      SK: data.AssemblaSpaceId,
      item2: data.spaceName,
      LSK: "Space#",
      isAssemblaSpace: data.isAssemblaSpace ? true : false,
      isDeleted: data.isDeleted ? true : false,
      customSpace: data.isAssemblaSpace ? true : false,
      item1: "Spaces#",
    },
  };

  console.log(params);

  response = await DynamoDB.put(params).promise();
  console.log("response", response);
  return response;
};

module.exports.getAllSpaces = async () => {
  var response = {};
  var data = [];
  var params = {
    KeyConditionExpression: "PK = :Space",
    ExpressionAttributeValues: {
      ":Space": "Spaces#",
    },
    TableName: constMessage.TABLE_NAME, //will be changed after producton
    // TableName: "VSpace_Local",
  };
  console.log(params);

  data = await DynamoDB.query(params).promise();
  // console.log("data", data);

  var spaceBO = [];
  for (var i = 0; data.Items.length > i; i++) {
    if (data.Items[i].isDeleted != true) {
      // true is for user deleted
      var BO = {
        PK: data.Items[i].PK,
        SK: data.Items[i].SK,
        spaceName: data.Items[i].item2,
        LSK: data.Items[i].LSK,
        isAssemblaSpace: data.Items[i].isAssemblaSpace,
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

module.exports.getSpace = async (data) => {
  var response = {};
  var dataBO = [];
  var spaceBO = [];
  var params = {
    KeyConditionExpression: "SK = :SpaceID AND PK = :PK",
    ExpressionAttributeValues: {
      ":SpaceID": data.spaceID,
      ":PK": "Spaces#",
    },
    TableName: constMessage.TABLE_NAME,
    // TableName: "VSpace_Local",
  };
  dataBO = await DynamoDB.query(params).promise();
  console.log(dataBO);
  for (var i = 0; dataBO.Items.length > i; i++) {
    if (dataBO.Items[i].isDeleted != true) {
      // true is for user deleted
      var BO = {
        PK: dataBO.Items[i].PK,
        SK: dataBO.Items[i].SK,
        LSK: dataBO.Items[i].LSK,
        isAssemblaSpace: dataBO.Items[i].isAssemblaSpace,
        isDeleted: dataBO.Items[i].isDeleted,
      };
      spaceBO.push(BO);
    }
  }

  return spaceBO;
};
