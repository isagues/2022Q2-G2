const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

function generateUniqueId() { // Public Domain/MIT
  return Date.now() + Math.random()
}

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    // let unique_id = ()
    // console.log(unique_id)
    await dynamo.put({
        TableName: "job-searchs",
        Item: {
          id: generateUniqueId(),
          title: event.data.title,
          description: event.data.description
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