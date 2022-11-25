
const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const queryParams = event.queryStringParameters;
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    body = await dynamo.query({
      ExpressionAttributeValues: {
       ":v1": Number(queryParams.id),
       ":v2": "application#"
      }, 
      KeyConditionExpression: "id = :v1 AND begins_with ( application, :v2 )", 
      TableName: "job-searchs"
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