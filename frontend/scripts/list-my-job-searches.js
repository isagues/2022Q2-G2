const jobListElement = document.getElementById('job-list');

const listJobSearchesUsername = localStorage.getItem('username');

getBusquedasDeUsuario(listJobSearchesUsername).then(function(result){
  console.log('Success, payload', result);
  jobListElement.innerHTML = 'Loading your job searches...';
  if (result.data.Items.length === 0)
    jobListElement.innerHTML = 'You haven\'t created any job searches yet.';
  else
    jobListElement.innerHTML = '';

  result.data.Items.forEach((jobSearch) => {
    jobListElement.innerHTML += `<li class="list-group-item"> <a style="text-decoration: none;color: black;" href="job-search.html?id=${encodeURIComponent(jobSearch.id)}&showApplicants=true"><b>${jobSearch.title}:</b> ${jobSearch.description}</div></li>`;
  });

}).catch( function(result){
  console.log('Error', result);
});