
const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };
  try {
    body = await dynamo.query({
      TableName : 'job-searchs',
      KeyConditions : {
        'application' : {
          ComparisonOperator: BEGINS_WITH,
          AttributeValueList: ["application#"]
        }
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