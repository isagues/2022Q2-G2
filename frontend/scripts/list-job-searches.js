const jobListElement = document.getElementById('job-list');

getBusquedas().then(function(result){
  console.log('Success, payload', result);
  result.data.Items.forEach((jobSearch) => {
    jobListElement.innerHTML = '';
    jobListElement.innerHTML += `<li class="list-group-item"> <a style="text-decoration: none;color: black;" href="job-search.html?id=${jobSearch.id}"><b>${jobSearch.title}:</b> ${jobSearch.description}</div></li>`;
  });
}).catch( function(result){
  console.log('Error', result);
});