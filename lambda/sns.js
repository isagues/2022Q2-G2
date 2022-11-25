const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3({});

exports.handler = async function(event, context) {
    
    try {
        const ssm = new AWS.SSM({endpoint: process.env.ssm_endpoint});

        const topicARN = (await ssm.getParameter({ Name: '/sns/new_users/topicARN' }).promise()).Parameter.Value;
        const endpointURL = (await ssm.getParameter({ Name: '/endpoint/sns/dns' }).promise()).Parameter.Value;
        
        const sns = new AWS.SNS({endpoint: endpointURL});
        
        const uploadedFile = event.Records[0].s3.object.key;
        const bucket = event.Records[0].s3.bucket.name;
        
        const ids = unescape(uploadedFile).split(";");
        const idBusqueda = ids[0].split("#")[1];
        
        const signedURL = await s3.getSignedUrlPromise('getObject', {
            "Bucket": bucket,
            "Key": unescape(uploadedFile),
          });
        
        await dynamo.put({
           TableName: "job-searchs",
            Item: {
              id: parseInt(idBusqueda),
              application: ids[1].replace(/.pdf/g,''),
              uploaded: true,
              s3Key: uploadedFile,
              unescapedS3Key: unescape(uploadedFile)
            }
          }).promise();
    
        return await sns.publish({
            Message: JSON.stringify({uploadedFile: uploadedFile, idBusqueda: idBusqueda, URL: signedURL}), 
            MessageAttributes: {
                'busqueda': {
                  DataType: 'String',
                  StringValue: ids[0]
                },
            },    
            Subject: "Test SNS From Lambda",
            TopicArn: topicARN
        }).promise()
    
    } catch(e) {
        return e
    }

        
};
