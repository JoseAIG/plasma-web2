//SE DEFINEN LAS FUNCIONES DE LOS METODOS
//METODO GET
function doGet(URL) {
    const opciones = {
        method: 'GET'
    }
    return fetch(URL,opciones).then(response => response.json())
}

//METODO POST
function doPost(URL, body) {
    let opciones;
    //COMPROBAR SI SE BRINDA UN CUERPO PARA LA PETICION
    if(body){
        //COMPROBAR SI EL CUERPO DE LA PETICION ES UN FORM DATA
        if(body instanceof FormData){
            opciones = {
                method: 'POST',
                body: body
            }
        }
        //SI NO ES UN FORM DATA, SE ESTABLECE QUE EL BODY ES JSON
        else{
            opciones = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            }
        }
    }else{
        opciones = {
            method: 'POST',
        }
    }

    return fetch(URL,opciones).then(response => response.json())
}

//METODO PUT
function doPut(URL, body) {
    const opciones = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    }
    return fetch(URL,opciones).then(response => response.json())
}

//METODO DELETE
function doDelete(URL) {
    const opciones = {
        method: 'DELETE'
    }
    return fetch(URL,opciones).then(response => response.json())
}

export const fetch_wrapper = {
    get: doGet,
    post: doPost,
    put: doPut,
    delete: doDelete
}