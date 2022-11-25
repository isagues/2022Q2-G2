const jobListElement = document.getElementById('job-list');
new QRCode(document.getElementById("qrcode"), 'hoalalla');

verBusqueda().then(function(result){
  console.log('Success, payload', result);
  const busqueda = result.data;
  console.log(busqueda);
  new QRCode(document.getElementById("qrcode"), busqueda.url);
}).catch( function(result){
  console.log('Error', result);
});

// jobId, searchId, 