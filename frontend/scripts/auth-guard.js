const idToken = localStorage.getItem('idToken');
if (!idToken) window.location.href = "login.html";
fetch('https://' + BASE_URL + '/api/test', {headers: {authorization: idToken}}).then((res) => {
  if (res.status === 401 || res.status === 403){
    console.log('AuthGuard: unauthorized');
    alert('Your session has expired! Please login again :)')
    localStorage.removeItem('idToken');
    window.location.href = "login.html";
  }
  else {
    reflectLoggedInUserInUI('Juan');
    console.log('AuthGuard: authorized');
  }
}).catch((err) => console.log(err));


function reflectLoggedInUserInUI(username) {
  const loginSignupButtons = document.getElementById('login-signup-buttons');
  const welcomeMessage = document.getElementById('welcome-message');

  loginSignupButtons.style.display = 'none';
  welcomeMessage.style.display = 'block';
  welcomeMessage.innerHTML = `Welcome, ${username}`
}