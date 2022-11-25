const jobListElement = document.getElementById('job-list');

getBusquedas().then(function(result){
  console.log('Success, payload', result);
  result.data.forEach((jobSearch) => {
    jobListElement.innerHTML += `<li> <b>${jobSearch.title}:</b> ${jobSearch.description}</li>`
  });
}).catch( function(result){
  console.log('Error', result);
});