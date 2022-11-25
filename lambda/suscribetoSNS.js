const AWS = require("aws-sdk");

exports.handler = async function(event, context) {
    try {
        const ssm = new AWS.SSM({endpoint: process.env.ssm_endpoint});
        const topicARN = (await ssm.getParameter({ Name: '/sns/new_users/topicARN' }).promise()).Parameter.Value;
        const endpointURL = (await ssm.getParameter({ Name: '/endpoint/sns/dns' }).promise()).Parameter.Value;
        
        const sns = new AWS.SNS({endpoint: endpointURL});
        const queryParams = event.queryStringParameters;


        const params = {
          Protocol: 'email', /* required */
          TopicArn: topicARN, /* required */
          Attributes: {
            'FilterPolicy': `{"employer": ["${queryParams.userID}"]}`,
          },
          Endpoint: queryParams.email,
          ReturnSubscriptionArn: true
        };
        
        return await sns.subscribe(params).promise();
        
    } catch(e) {
        return e
    }
};
