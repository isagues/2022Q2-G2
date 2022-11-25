var apigClient = apigClientFactory.newClient();

async function getBusquedas() {
    var params = {
        // //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
        // param0: '',
        // param1: ''
    };
    var body = {
        //This is where you define the body of the request
    };
    var additionalParams = {
        // //If there are any unmodeled query parameters or headers that need to be sent with the request you can add them here
        headers: {
            "Authorization": localStorage.getItem('idToken')
        },
        // queryParams: {
        //     param0: '',
        //     param1: ''
        // }
    };
    return apigClient.listarBusquedasGet(params, body, additionalParams);
}

function getAplicaciones() {
    var params = {
        // //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
        // param0: '',
        // param1: ''
    };
    var body = {
        //This is where you define the body of the request
    };
    var additionalParams = {
        // //If there are any unmodeled query parameters or headers that need to be sent with the request you can add them here
        headers: {
            "Authorization": localStorage.getItem('idToken')
        },
        // queryParams: {
        //     param0: '',
        //     param1: ''
        // }
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



