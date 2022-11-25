const jobListElement = document.getElementById('job-list');

getBusquedas().then(function(result){
  console.log('Success, payload', result);
}).catch( function(result){
  console.log('Error', result);
});