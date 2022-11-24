var AWS  = require("aws-sdk");


AWS.config.region = AWS_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID,
});

// var apigateway = new AWS.APIGateway({apiVersion: '2015-07-09'});
const lambda = new AWS.Lambda();

const myFunction = async () => {
    // const color = document.getElementById("c1").value
    // const pattern = document.getElementById("p1").value
    // const id = Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
    const params = {
        FunctionName: 'listar_busquedas'//, /* required */
        // Payload: JSON.stringify( { Item: {
        //         Id: id,
        //         Color: color,
        //         Pattern: pattern
        //     },
        //     TableName: "job-searchs",
        // })
    };
    lambda.invoke(params,  function (err, data){
        if (err) console.log(err, err.stack); // an error occurred
        else console.log('Success, payload', data);           // successful response
    })
};

const callButton = document.getElementById('call-endpoint');
callButton.onclick = myFunction;
