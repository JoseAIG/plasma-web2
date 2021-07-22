//FUNCION PARA GENERAR ALERTAS POPUP
export function alerta(texto, tipo) {
    
    //CONTENEDOR ALERTA
    let div = document.createElement('div');
    div.className = "alert alert-dismissible fade in " + tipo;
    //TEXTO DE LA ALERTA
    if(texto){
        div.innerText = texto;
    }
    //BOTON CERRAR ALERTA
    let button = document.createElement('button');
    button.className = "btn-close";
    button.setAttribute('data-bs-dismiss','alert');
    div.appendChild(button);

    //TIMEOUT PARA AGREGAR LA CLASE "show" PARA MOSTRAR LA ALERTA
    setTimeout(() => {
        div.classList.add("show");
    }, 15);

    //TIMEOUT PARA CERRAR LA ALERTA
    setTimeout(() => {
        button.click();
    }, 3000);

    //AGREGAR LA ALERTA AL BODY
    document.body.appendChild(div);

}