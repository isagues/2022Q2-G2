const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

function generateUniqueId() { // Public Domain/MIT
  return Date.now()
}

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };
  const queryParams = event.queryStringParameters;

  const ssm = new AWS.SSM({ endpoint: process.env.ssm_endpoint });
  const topicARN = (await ssm.getParameter({ Name: '/sns/applications/topicARN' }).promise()).Parameter.Value;
  const endpointURL = (await ssm.getParameter({ Name: '/endpoint/sns/dns' }).promise()).Parameter.Value;

  const sns = new AWS.SNS({ endpoint: endpointURL });

  const username = 'pepe4'
  const userID = `user#${username}`
  
  const snsApplication = 'snsSubscription'

  const searchID = `busqueda#${generateUniqueId()}`
  try {
    
    let IDs;
    
    const user = await dynamo.get({
      TableName: 'job-searchs',
      Key: {
        id: userID,
        application: snsApplication
      }
    }).promise();
    
    let subscriptionARN
    
    if (user && Object.keys(user).length === 0 && Object.getPrototypeOf(user) === Object.prototype) {
        IDs = [searchID];
        const ans = await sns.subscribe({
          Protocol: 'email',
          TopicArn: topicARN,
          Attributes: {
            'FilterPolicy': `{"searchID": ${JSON.stringify(IDs)}}`,
          },
          Endpoint: "testSNS4@isagues.ar",
          ReturnSubscriptionArn: true
        }).promise();
        
        subscriptionARN = ans.SubscriptionArn;
        
    } else {
        IDs = [searchID, ...user.Item.arns];
        subscriptionARN = user.Item.subscriptionARN;
        
        await sns.setSubscriptionAttributes({
          AttributeName: 'FilterPolicy', 
          SubscriptionArn: subscriptionARN,
          AttributeValue: `{"searchID": ${JSON.stringify(IDs)}}`
        }).promise();
    }

  await dynamo.put({
    TableName: "job-searchs",
    Item: {
      id: userID,
      application: snsApplication,
      arns: IDs,
      subscriptionARN 
    }
  }).promise();


  } catch (err) {
    statusCode = 400;
    body = err.message;
  }
  return {
    statusCode,
    body,
    headers
  };
};