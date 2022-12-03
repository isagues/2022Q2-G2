const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };
  const queryParams = event.queryStringParameters;
  try {
    if (queryParams && queryParams.own) {
      body = await dynamo.scan({
        TableName: "job-searchs",
        FilterExpression: "application = :metadata and username = :username",
        ExpressionAttributeValues: {
          ":metadata": "metadata",
          ":username": event.requestContext.authorizer.claims["cognito:username"]
        }
      })
        .promise();
    } else {
      body = await dynamo.scan({
        TableName: "job-searchs",
        FilterExpression: "application = :metadata",
        ExpressionAttributeValues: {
          ":metadata": "metadata"
        }
      })
        .promise();
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};