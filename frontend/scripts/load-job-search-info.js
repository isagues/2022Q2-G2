const jobSearchDataElement = document.getElementById('job-search-data');
const applyButton = document.getElementById('apply-button');

// new QRCode(document.getElementById("qrcode"), 'hoalalla');

const queryParamsString = window.location.search.split('?')[1];
const queryParams = new URLSearchParams(queryParamsString);
let searchId = queryParams.get('id');

if (!searchId){
  console.log('No search id provided in query params, redirecting to 404');
  window.location.href = 'not-found.html';
}

searchId = decodeURIComponent(searchId);

getBusqueda(searchId).then(function(result){
  console.log('Success, payload', result);
  const searchData = result.data.Item;
  console.log(searchData);
  
  jobSearchDataElement.innerHTML = generateJobSearchDataElement(searchData);
  
  new QRCode(document.getElementById("qrcode"), window.location.href);
  
  applyButton.onclick = function() {
    window.location.href = `apply.html?id=${encodeURIComponent(searchData.id)}`;
  };
  applyButton.style.display = 'block';
}).catch( function(result){
  console.log('Error', result);
});

if (queryParams.get('showApplicants') === 'true') {
  console.log('loading applicants...');
  const applicantsContainerElem = document.getElementById('applicants-container');
  applicantsContainerElem.style.display = 'block';
  getAplicaciones(searchId).then(function(result) {
    console.log('Success, applicants:', result);
    const applicantsListElem = document.getElementById('applicants-list');
    applicantsListElem.innerHTML = 'Loading applicants...';
    result.data.Items.forEach((application) => {
      applicantsListElem.innerHTML += `<li class="list-group-item"> <a href="${application.url}" style="text-decoration: none;color: black;"><b>${application.fname}:</b></div></li>`;
    });
    if (result.data.Items.length === 0) applicantsListElem.innerHTML = 'No applicants yet.';
  }).catch((error) => {
    // localStorage.removeItem('idToken');
    // localStorage.removeItem('username');
    window.location.href = window.location.href.split('&showApplicants')[0];
  });
}


function generateJobSearchDataElement(searchData) {
  return `<h3>Title</h3>\
          <p>${searchData.title}</p>\
          <h3>Description</h3>\
          <p>${searchData.description}</p>`;
}