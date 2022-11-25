const idToken = localStorage.getItem('idToken');
if (!idToken) window.location.href = "login.html";