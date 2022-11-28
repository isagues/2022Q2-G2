// const USER_POOL_ID = 'us-east-1_rQcYJzVw5';
// const CLIENT_ID = '1e3fhulu7k2bp2md70ufmnains';

var apigClient = apigClientFactory.newClient();

function signUpUser(username, password, email, phone_number) {
	var poolData = {
		UserPoolId: USER_POOL_ID,
		ClientId:  CLIENT_ID
	};
	var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

	var attributeList = [];

	var dataEmail = {
		Name: 'email',
		Value: email,
	};

	var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

	attributeList.push(attributeEmail);

	userPool.signUp(username, password, attributeList, null, function(
		err,
		result
	) {
		if (err) {
			alert(err.message || JSON.stringify(err));
			return;
		}
		var cognitoUser = result.user;
		console.log('user name is ' + cognitoUser.getUsername());
		console.log(result);
		window.location.href = "confirm.html";
	});
}

function confirmUser(username, confirmationCode) { 
	var poolData = {
		UserPoolId: USER_POOL_ID, // Your user pool id here
		ClientId: CLIENT_ID, // Your client id here
	};
	var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	var userData = {
		Username: username,
		Pool: userPool,
	};
	
	var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	cognitoUser.confirmRegistration(confirmationCode, true, function(err, result) {
		if (err) {
			console.log(err);
			alert(err.message || JSON.stringify(err));
			return;
		}
		console.log(result);
		window.location.href = "login.html";
	});
}

function authenticateUser(username, password) {
	var authenticationData = {
		Username: username,
		Password: password,
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
		Username: username,
		Pool: userPool,
	};
	var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	cognitoUser.authenticateUser(authenticationDetails, {
		onSuccess: function (result) {
			var accessToken = result.getAccessToken();
			var idToken = result.getIdToken().getJwtToken();

			console.log(idToken);
			localStorage.setItem('idToken', idToken);
			window.location.href = "index.html";
		},

		onFailure: function (err) {
			alert(err.message || JSON.stringify(err));
		},
	});
}