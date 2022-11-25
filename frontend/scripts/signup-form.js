const usernameField = document.getElementById('username');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');
const phoneNumberField = document.getElementById('phone-number');
const registerButton = document.getElementById('register-button');
registerButton.onclick = () => signUpUser(usernameField.value, passwordField.value, emailField.value, phoneNumberField.value);
