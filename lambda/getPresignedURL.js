const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
  
  const s3 = new AWS.S3({});

  const queryParams = event.queryStringParameters;
  console.log(queryParams);
  
  const URL = await s3.getSignedUrlPromise('putObject', {
    "Bucket": 'cvs-precise-ringtail',
    "Key": queryParams.fname,
    "ContentType": 'application/pdf'
  });
  
  return {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { },
        "body": JSON.stringify({ URL: URL, file_name: queryParams.fname })
    }

};