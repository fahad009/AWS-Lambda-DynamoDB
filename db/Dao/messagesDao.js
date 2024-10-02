var constMessage = require("../../services/constants");
var aws = require("aws-sdk");
var { verifySession } = require("../../services/publicServices");
const { v4: uuid } = require('uuid');
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });
const DynamoDB = new AWS.DynamoDB.DocumentClient();
module.exports = {
    inviteOtherForMeeting: async (meetingBO, membersUrl, date) => {

        var response = {};
        var data = [];
        try {

            var createParam = [];
            for (var i = 0; i < meetingBO.attendees.length; i++) {
                createParam.push({
                    PutRequest: {
                        Item: {
                            PK: 'Messages#' + meetingBO.attendees[i].email,
                            SK: date.getTime().toString(),
                            LSK: meetingBO.hostEmail,
                            text: 'You have a meeting invitation ' + membersUrl,
                            subject: 'MeetingInvitation',
                            link: membersUrl
                            // GSI_PK: meetingId,
                            // GSI_SK: 'Active',
                        }
                    }
                })
            }
            console.log("create params are ------------------ ", createParam);
            var tableName = constMessage.TABLE_NAME;
            var params = {
                RequestItems: {
                    'VSpace_Local': createParam
                    // 'test': createParam
                }
            };
            console.log("params are ------------------ ", params);
            var data = await DynamoDB.batchWrite(params).promise();
            console.log("sms data is ------------------ ", data);

        } catch (error) {
            console.error("Error connecting DB", error);
            response = {
                statusCode: constMessage.STATUS_CODE_501,
                message: error.message,
                data: []
            };
            return response;
        }

        response = {
            statusCode: constMessage.STATUS_CODE_200,
            message: constMessage.DATA_ADDED,
            data: []
        };
        return response;

    },
    getAllMessagesOfUser: async (messageBO) => {

        var response = {};
        var data = [];
        try {

            // var params = {
            //     TableName: constMessage.TABLE_NAME,
            //     Key: {
            //         PK: 'Messages#shani@gmail.com'
            //     }
            // };
            var params = {
                TableName: constMessage.TABLE_NAME,
                KeyConditionExpression: "PK = :uid",
                ExpressionAttributeValues: {
                    ":uid": "Messages#" + messageBO.email
                }
            }

            console.log("params are ------------------ ", params);
            var data = await DynamoDB.query(params).promise();
            console.log("sms data is ------------------ ", data);
            var result = []
            if (data.Items != undefined && data.Items != null) {
                for (var i = 0; i < data.Items.length; i++) {
                    var item = data.Items[i];
                    result.push({
                        subject: item.subject ? item.subject : "",
                        timeStamp: item.SK ? item.SK : "",
                        text: item.text ? item.text : "",
                        sender: item.LSK ? item.LSK : "",
                        link: item.link ? item.link : ""
                    })
                }
            }



        } catch (error) {
            console.error("Error connecting DB", error);
            response = {
                statusCode: constMessage.STATUS_CODE_501,
                message: error.message,
                data: []
            };
            return response;
        }

        response = {
            statusCode: constMessage.STATUS_CODE_200,
            message: constMessage.SUCCESS,
            data: result
        };
        return response;

    }
}