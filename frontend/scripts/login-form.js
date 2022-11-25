const usernameField = document.getElementById('username');
const passwordField = document.getElementById('password');
const loginButton = document.getElementById('login-button');
loginButton.onclick = () => authenticateUser(usernameField.value, passwordField.value);
