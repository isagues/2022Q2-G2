const AWS = require("aws-sdk");
const crypto = require('crypto');
const dynamo = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3({});


exports.handler = async (event, context) => {

  const queryParams = event.queryStringParameters;
  const idBusqueda = queryParams.busqueda;
  const body = JSON.parse(event.body);

  const ssm = new AWS.SSM({ endpoint: process.env.ssm_endpoint });
  const cvvBucket = (await ssm.getParameter({ Name: '/s3/cvs/bucketName' }).promise()).Parameter.Value;

  const applicationID = `application#${crypto.randomBytes(20).toString('hex')}`;
  const file_name = `${idBusqueda};${applicationID}.pdf`;


  await dynamo.put({
    TableName: "job-searchs",
    Item: {
      id: idBusqueda,
      application: applicationID,
      fname: body.fname
    }
  }).promise();

  const URL = await s3.getSignedUrlPromise('putObject', {
    "Bucket": cvvBucket,
    "Key": file_name,
    "ContentType": 'application/pdf'
  });

  return {
    "isBase64Encoded": false,
    "statusCode": 200,
    "headers": {},
    "body": JSON.stringify({ URL: URL })
  }

};