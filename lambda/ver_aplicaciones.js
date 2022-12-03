
const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3({});

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const queryParams = event.queryStringParameters;
  const headers = {
    "Content-Type": "application/json"
  };

  const ssm = new AWS.SSM({ endpoint: process.env.ssm_endpoint });
  const bucket = (await ssm.getParameter({ Name: '/s3/cvs/bucketName' }).promise()).Parameter.Value;

  try {
    body = await dynamo.query({
      ExpressionAttributeValues: {
        ":v1": queryParams.id,
        ":v2": "application#"
      },
      KeyConditionExpression: "id = :v1 AND begins_with ( application, :v2 )",
      TableName: "job-searchs"
    })
      .promise();

    for await (const application of body.Items) {
      if (application.unescapedS3Key) {
        application.url = await s3.getSignedUrlPromise('getObject', {
          "Bucket": bucket,
          "Key": application.unescapedS3Key,
        });
      }
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