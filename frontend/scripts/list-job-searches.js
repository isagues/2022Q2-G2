const jobListElement = document.getElementById('job-list');

getBusquedas().then(function(result){
  console.log('Success, payload', result);
  result.data.Items.forEach((jobSearch) => {
    jobListElement.innerHTML = '';
    jobListElement.innerHTML += `<li class="list-group-item"> <b>${jobSearch.title}:</b> ${jobSearch.description}</li>`;
  });
}).catch( function(result){
  console.log('Error', result);
});