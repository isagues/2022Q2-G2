// const USER_POOL_ID = 'us-east-1_rQcYJzVw5';
// const IDENTITY_POOL_ID = 'us-east-1:9fb9f627-ea84-40c5-9eea-460a69e9d6a7';
// const CLIENT_ID = '1e3fhulu7k2bp2md70ufmnains';
// const AWS_REGION = 'us-east-1';
// const COGNITO_IDP = 'cognito-idp.us-east-1.amazonaws.com/us-east-1_16lDQzCJU';
// const COGNITO_IDP = 'cognito-idp.' + AWS_REGION + '.amazonaws.com/' + USER_POOL_ID;

var apigClient = apigClientFactory.newClient();

function signUpUser() {
	var poolData = {
		UserPoolId: USER_POOL_ID,
		ClientId:  CLIENT_ID
	};
	var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

	var attributeList = [];

	var dataEmail = {
		Name: 'email',
		Value: 'isagues@itba.edu.ar',
	};

	var dataPhoneNumber = {
		Name: 'phone_number',
		Value: '+15555555555',
	};

	var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
	var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);

	attributeList.push(attributeEmail);
	attributeList.push(attributePhoneNumber);

	userPool.signUp('isagues', 'verysecurepasswordXD1_', attributeList, null, function(
		err,
		result
	) {
		if (err) {
			alert(err.message || JSON.stringify(err));
			return;
		}
		var cognitoUser = result.user;
		console.log('user name is ' + cognitoUser.getUsername());
	});
}

function confirmUser() { 
	var poolData = {
		UserPoolId: USER_POOL_ID, // Your user pool id here
		ClientId: CLIENT_ID, // Your client id here
	};
	var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	var userData = {
		Username: 'isagues',
		Pool: userPool,
	};
	
	var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	cognitoUser.confirmRegistration('173166', true, function(err, result) {
		if (err) {
			console.log(err);
			alert(err.message || JSON.stringify(err));
			return;
		}
		console.log('call result: ' + result);
	});
}

function authenticateUser() {
	var authenticationData = {
		Username: 'isagues',
		Password: 'verysecurepasswordXD1_',
	};
	var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
		authenticationData
	);
	var poolData = {
		UserPoolId: USER_POOL_ID, // Your user pool id here
		ClientId: CLIENT_ID, // Your client id here
	};
	var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	var userData = {
		Username: 'isagues',
		Pool: userPool,
	};
	var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	cognitoUser.authenticateUser(authenticationDetails, {
		onSuccess: function (result) {
			var accessToken = result.getAccessToken();
			var idToken = result.getIdToken().getJwtToken();

			// POTENTIAL: Region needs to be set if not already set previously elsewhere.
			// AWS.config.region = AWS_REGION;

			// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			// 	IdentityPoolId: IDENTITY_POOL_ID,
			// 	Logins: {
			// 		COGNITO_IDP: result
			// 			.getIdToken()
			// 			.getJwtToken(),
			// 	},
			// });
			console.log(accessToken.getJwtToken());
			localStorage.setItem('idToken', idToken);
			window.location.href = "job_searches.html";
			
			//refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
			// AWS.config.credentials.refresh(error => {
			// 	if (error) {
			// 		console.error('error',error);
			// 	} else {
			// 		console.log('Successfully logged!');
			// 	}
			// });
		},

		onFailure: function (err) {
			alert(err.message || JSON.stringify(err));
		},
	});
}
const createUserButton = document.getElementById('create-user');
createUserButton.onclick = signUpUser;

const confirmUserButton = document.getElementById('confirm-user');
confirmUserButton.onclick = confirmUser;

const loginUserButton = document.getElementById('auth-user');
loginUserButton.onclick = authenticateUser;
