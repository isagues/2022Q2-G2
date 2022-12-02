const authInfoIdToken = localStorage.getItem('idToken');
const authInfoUsername = localStorage.getItem('username');

fetch('https://' + BASE_URL + '/api/test', {headers: {authorization: authInfoIdToken}}).then((res) => {
  if (res.status === 200){
    reflectLoggedInUserInUI(authInfoUsername);
  }
}).catch((err) => console.log(err));


function reflectLoggedInUserInUI(username) {
  const loginSignupButtons = document.getElementById('login-signup-buttons');
  const welcomeMessageAndLogoutButton = document.getElementById('welcome-message-and-logout-button');
  const welcomeMessage = document.getElementById('welcome-message');
  const logoutButton = document.getElementById('logout-button');
  
  loginSignupButtons.style.display = 'none';

  welcomeMessage.innerHTML = `Welcome, ${username}`

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('idToken');
    localStorage.removeItem('username');
    window.location.href = "login.html";
  });

  welcomeMessageAndLogoutButton.style.display = 'flex';
}