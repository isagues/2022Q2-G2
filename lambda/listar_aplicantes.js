
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
    body = await dynamo.scan({
        TableName : 'applications',
        AttributesToGet: [
          'cv_link'
        ],
        FilterExpression : 'search_id = :search_id',
        ExpressionAttributeValues : {':this_id' : queryParams.search_id}
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