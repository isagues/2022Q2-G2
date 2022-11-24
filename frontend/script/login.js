const USER_POOL_ID = 'us-east-1_16lDQzCJU';
const IDENTITY_POOL_ID = 'us-east-1:c568480c-ae7a-4718-a8cf-7b8869e3d817';
const CLIENT_ID = '6u4h42179ni1qi6r3tfpnm949l';
const AWS_REGION = 'us-east-1';

function signUpUser() {
	var poolData = {
		UserPoolId: USER_POOL_ID,
		ClientId:  CLIENT_ID
	};
	var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

	var attributeList = [];

	var dataEmail = {
		Name: 'email',
		Value: 'jbensadon@itba.edu.ar',
	};

	var dataPhoneNumber = {
		Name: 'phone_number',
		Value: '+15555555555',
	};

	var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
	var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber);

	attributeList.push(attributeEmail);
	attributeList.push(attributePhoneNumber);

	userPool.signUp('jbensadon@itba.edu.ar', 'verysecurepasswordXD1_', attributeList, null, function(
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
function authenticateUser() {
	var authenticationData = {
		Email: 'fpannunzio@itba.edu.ar',
		Password: 'Fausti25!',
	};
	var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
		authenticationData
	);
	console.log(authenticationDetails);
	var poolData = {
		UserPoolId: USER_POOL_ID, // Your user pool id here
		ClientId: CLIENT_ID, // Your client id here
	};
	var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	console.log(userPool);
	var userData = {
		Username: 'fpannunzio@itba.edu.ar',
		Pool: userPool,
	};
	var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	cognitoUser.authenticateUser(authenticationDetails, {
		onSuccess: function (result) {
			var accessToken = result.getAccessToken().getJwtToken();

			//POTENTIAL: Region needs to be set if not already set previously elsewhere.
			AWS.config.region = AWS_REGION;

			AWS.config.credentials = new AWS.CognitoIdentityCredentials({
				IdentityPoolId: IDENTITY_POOL_ID, // your identity pool id here
				Logins: {
					// Change the key below according to the specific region your user pool is in.
					'cognito-idp.us-east-1.amazonaws.com/us-east-1_16lDQzCJU': result
						.getIdToken()
						.getJwtToken(),
				},
			});
			console.log(accessToken);

			//refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
			AWS.config.credentials.refresh(error => {
				if (error) {
					console.error(error);
				} else {
					console.log('Successfully logged!');
				}
			});
		},

		onFailure: function (err) {
			alert(err.message || JSON.stringify(err));
		},
	});
}
const createUserButton = document.getElementById('create-user');
createUserButton.onclick = signUpUser;

const loginUserButton = document.getElementById('auth-user');
loginUserButton.onclick = authenticateUser;