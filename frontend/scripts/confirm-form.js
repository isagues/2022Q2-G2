const usernameField = document.getElementById('username');
const confirmationCodeField = document.getElementById('confirmation-code');
const confirmButton = document.getElementById('confirm-button');
confirmButton.onclick = () => confirmUser(usernameField.value, confirmationCodeField.value);
