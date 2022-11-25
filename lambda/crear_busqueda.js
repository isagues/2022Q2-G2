const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

function generateUniqueId() { // Public Domain/MIT
  return Date.now()
}

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };
  const queryParams = event.queryStringParameters;

  try {
    await dynamo.put({
        TableName: "job-searchs",
        Item: {
          id: generateUniqueId(),
          aplication: "metadata",
          title: queryParams.title,
          description: queryParams.description,
          username: queryParams.username
        }
      })
      .promise();
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