const AWS = require("aws-sdk");

exports.handler = async function(event, context) {
    try {
        const ssm = new AWS.SSM({endpoint: process.env.ssm_endpoint});
        const topicARN = (await ssm.getParameter({ Name: '/sns/new_users/topicARN' }).promise()).Parameter.Value;
        const endpointURL = (await ssm.getParameter({ Name: '/endpoint/sns/dns' }).promise()).Parameter.Value;
        
        const sns = new AWS.SNS({endpoint: endpointURL});

        const params = {
            Message: "OOOOO", 
            Subject: "Test SNS From Lambda",
            TopicArn: topicARN
        };
        
        return await sns.publish(params).promise()
        
    } catch(e) {
        return e
    }
};
