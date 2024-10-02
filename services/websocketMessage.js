const AWS = require("aws-sdk");
const constMessage = require("./constants");
const socketDao = require("../db/Dao/socketDao");
const create = (domainName, stage) => {
  const endpoint = `${domainName}/${stage}`;
  return new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint,
  });
};

const sendMessageToUsers = async (usersBO, messageBO) => {
  try {
    var rejectedUsers = [];
    var data = {
      pk: constMessage.Sockets,
      status: constMessage.ACTIVE,
    };
    const socketsDaos = await socketDao.getAllRecords(
      data,
      constMessage.TABLE_NAME
    );

    console.log("users are -----------  ", usersBO);
    if (socketsDaos.Count > 0) {
      const users = socketsDaos.Items;
      var user = users[0];
      if (process.env.stage == constMessage.localStage) {
        console.log("locally testing web socket------", users);
        users.map((user) => {
          console.log(user);
          var u = usersBO.find((x) => x.email == user.LSK);

          // console.log(x.email);
          console.log(u);
          if (u) console.log("sending messgae to user", user.LSK);
          else rejectedUsers.push(user.LSK);
        });
        return {
          message: "cant sent to ",
          data: rejectedUsers,
        };
      } else {
        console.log("live");
        const ws = create(user.domainName, user.stage);
        //filter users
        try {
          const promises = users.map((user) => {
            var u = userBO.find((x) => x.email == user.LSK);
            if (u)
              ws.postToConnection({
                ConnectionId: user.SK,
                Data: messageBO.message,
              }).promise();
          });
          await Promise.all(promises);
        } catch (error) {
          console.log("error occured whilesending data");
          return {
            message: error,
            data: [],
          };
        }
      }
    } else {
      return {
        message: "No user registered",
        data: [],
      };
    }
  } catch (error) {
    console.error(
      "Some error occured while sending messages from sockeyts ",
      error
    );
  }
};

const broadCastMessage = async (messageBO) => {
  try {
    var data = {
      pk: constMessage.Sockets,
      status: constMessage.ACTIVE,
    };
    const socketsDaos = await socketDao.getAllRecords(
      data,
      constMessage.TABLE_NAME
    );

    console.log("users are ----------- sockets ", socketsDaos);
    if (socketsDaos.Count > 0) {
      const users = socketsDaos.Items;
      var user = users[0];
      console.log("user i s--------------------- user", user);
      if (process.env.stage == constMessage.localStage) {
        console.log("locally testing web socket");
      } else {
        console.log("live");
        const ws = create(user.domainName, user.stage);
        try {
          const promises = users.map((user) =>
            ws
              .postToConnection({
                ConnectionId: user.SK,
                Data: messageBO.message,
              })
              .promise()
          );
          await Promise.all(promises);
        } catch (error) {
          console.log("error occured whilesending data");
          return {
            message: error,
          };
        }
      }
    } else {
      return {
        message: "No user registered",
      };
    }

    return socketsDaos;
  } catch (error) {
    console.error(
      "Some error occured while sending messages from sockeyts ",
      error
    );
  }
};
module.exports = {
  broadCastMessage,
  sendMessageToUsers,
};
