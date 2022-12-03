const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3({});

exports.handler = async function (event, context) {


    const ssm = new AWS.SSM({ endpoint: process.env.ssm_endpoint });

    const topicARN = (await ssm.getParameter({ Name: '/sns/new_users/topicARN' }).promise()).Parameter.Value;
    const endpointURL = (await ssm.getParameter({ Name: '/endpoint/sns/dns' }).promise()).Parameter.Value;

    const sns = new AWS.SNS({ endpoint: endpointURL });

    const uploadedFile = event.Records[0].s3.object.key;
    const bucket = event.Records[0].s3.bucket.name;

    const ids = unescape(uploadedFile).split(";");

    const signedURL = await s3.getSignedUrlPromise('getObject', {
        "Bucket": bucket,
        "Key": unescape(uploadedFile),
    });

    await dynamo.update({
        ExpressionAttributeValues: {
            ":u": true,
            ":s": uploadedFile,
            ":us": unescape(uploadedFile)
        },
        TableName: "job-searchs",
        Key: {
            id: ids[0],
            application: ids[1].replace(/.pdf/g, ''),
        },
        UpdateExpression: "SET uploaded = :u, s3Key = :s, unescapedS3Key = :us"
    }).promise();

    return await sns.publish({
        Message: `
            New application for search: ${ids[0].split("#")[1]}.

            View application on:

            ${signedURL}
        `,
        // JSON.stringify({ uploadedFile: uploadedFile, idBusqueda: ids[0], URL: signedURL }),
        MessageAttributes: {
            'searchID': {
                DataType: 'String',
                StringValue: ids[0]
            },
        },
        Subject: "New application!",
        TopicArn: topicARN
    }).promise()

};
