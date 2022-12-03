var apigClient = apigClientFactory.newClient();

function getBusquedas() {
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

function getBusquedasDeUsuario() {
    var params = {
    };
    var body = {
    };
    var additionalParams = {
        headers: {
            "Authorization": localStorage.getItem('idToken')
        },
        queryParams: {
            "own": true 
        }
    };
    return apigClient.listarBusquedasGet(params, body, additionalParams);
}

function getAplicaciones(id) {
    var params = {
    };
    var body = {
    };
    var additionalParams = {
        headers: {
            "Authorization": localStorage.getItem('idToken')
        },
        queryParams: {
            id: id
        }
    };
    return apigClient.verAplicacionesGet(params, body, additionalParams);
}

function getBusqueda(id) {
    var params = {
    };
    var body = {
    };
    var additionalParams = {
        headers: {
            "Authorization": localStorage.getItem('idToken')
        },
        queryParams: {
            id: id
        }
    };
    return apigClient.verBusquedaGet(params, body, additionalParams);
}

function nuevaBusqueda(title, description, username) {
    var params = {
    };
    var body = {
    };
    var additionalParams = {
        headers: {
            "Authorization": localStorage.getItem('idToken')
        },
        queryParams: {
            title: title,
            description: description,
            username: username
        }
    };
    return apigClient.crearBusquedaPost(params, body, additionalParams);
}
function nuevaAplicacion(id) {
    var params = {
    };
    var body = {
    };
    var additionalParams = {
        headers: {
            "Authorization": localStorage.getItem('idToken')
        },
        queryParams: {
            busqueda: id
        }
    };
    return apigClient.crearBusquedaPost(params, body, additionalParams)
}

// const searchsButton = document.getElementById('searchs-endpoint');
// searchsButton.onclick = getBusquedas;

// const aplicationsButton = document.getElementById('aplications-endpoint');
// aplicationsButton.onclick = getAplicaciones;



