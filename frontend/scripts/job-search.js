const jobSearchDataElement = document.getElementById('job-search-data');
const applyButton = document.getElementById('apply-button');

// new QRCode(document.getElementById("qrcode"), 'hoalalla');

verBusqueda().then(function(result){
  console.log('Success, payload', result);
  const search = result.data;
  console.log(search);
  new QRCode(document.getElementById("qrcode"), search.url);
  applyButton.onclick = function() {
    window.location.href = `apply.html?searchId=${search.id}`;
  }

}).catch( function(result){
  console.log('Error', result);
});
