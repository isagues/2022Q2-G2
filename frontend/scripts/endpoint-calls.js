var apigClient = apigClientFactory.newClient();

async function getBusquedas() {
    var params = {
    };
    var body = {
    };
    var additionalParams = {
        headers: {
            "Authorization": localStorage.getItem('idToken')
        },
    };
    return apigClient.listarBusquedasGet(params, body, additionalParams);
}

function getAplicaciones(id) {
    var params = {
        id: id
    };
    var body = {
    };
    var additionalParams = {
        headers: {
            "Authorization": localStorage.getItem('idToken')
        }
    };
    apigClient.listarAplicantesGet(params, body, additionalParams)
        .then(function(result){
            console.log('Success, payload', result); 
        }).catch( function(result){
            console.log('Error', result);
        });
}

function nuevaBusqueda(title, description, username) {
    var params = {
        title: title,
        description: description,
        username: username
    };
    var body = {
    };
    var additionalParams = {
        headers: {
            "Authorization": localStorage.getItem('idToken')
        }
    };
    apigClient.listarAplicantesGet(params, body, additionalParams)
        .then(function(result){
            console.log('Success, payload', result); 
        }).catch( function(result){
            console.log('Error', result);
        });
}

const searchsButton = document.getElementById('searchs-endpoint');
searchsButton.onclick = getBusquedas;

const aplicationsButton = document.getElementById('aplications-endpoint');
aplicationsButton.onclick = getAplicaciones;



