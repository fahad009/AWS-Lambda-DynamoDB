var constMessage = require("./constants");

//sendResponse method to send back response
module.exports.sendResponse = async (response, callback) => {
  callback(null, {
    statusCode: response.statusCode,
    headers: constMessage.HEADERS,
    body: JSON.stringify(response),
  });
  return;
};

module.exports.sendResponseCustom = async (response) => {
  callback(null, {
    statusCode: response.statusCode,
    headers: constMessage.HEADERS,
    body: JSON.stringify(response),
  });
  return;
};
