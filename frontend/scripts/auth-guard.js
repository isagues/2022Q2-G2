const authGuardIdToken = localStorage.getItem('idToken');
const authGuardUsername = localStorage.getItem('username');
if (!authGuardIdToken || !authGuardUsername) window.location.href = "login.html";
fetch('https://' + BASE_URL + '/api/test', {headers: {authorization: authGuardIdToken}}).then((res) => {
  if (res.status === 401 || res.status === 403){
    console.log('AuthGuard: unauthorized');
    alert('Your session has expired! Please login again :)')
    localStorage.removeItem('idToken');
    localStorage.removeItem('username');
    // if (window.location.pathname === ['index.html'])
    window.location.href = "login.html";
  }
  else {
    console.log('AuthGuard: authorized');
  }
}).catch((err) => console.log(err));
