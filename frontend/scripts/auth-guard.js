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
    console.log('AuthGuard: authorized');
  }
}).catch((err) => console.log(err));