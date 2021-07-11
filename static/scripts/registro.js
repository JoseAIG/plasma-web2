//IMPORTS
import { fetch_wrapper } from "./helpers/fetch_wrapper.js";
import { validar_correo } from "./helpers/validacion_correo.js";

//FUNCIONALIDAD PARA PROCESAR EL REGISTRO DE UN USUARIO
var form_registro = document.getElementById("form-registro");
var boton_registro = document.getElementById("boton-registro");
boton_registro.onclick = () => {
    // fetch_wrapper.post("/registro").then(data => console.log(data)).catch(error => console.error(error));
    let datos_form_registro = new FormData(form_registro);
    //COMPROBAR QUE LOS CAMPOS ESTEN COMPLETOS
    if(datos_form_registro.get("usuario")=="" || datos_form_registro.get("correo")=="" || datos_form_registro.get("clave")=="" || datos_form_registro.get("confirmar-clave")==""){
        alert("Llene todos los campos");
    }
    //COMPROBAR QUE EL CORREO ELECTRONICO SEA VALIDO
    else if(!validar_correo(datos_form_registro.get("correo"))){
        alert("Ingrese un correo válido");
    }
    //COMPROBAR QUE LA CLAVE Y LA CONFIRMACION DE LA CLAVE SEAN IGUALES
    else if(datos_form_registro.get("clave")!=datos_form_registro.get("confirmar-clave")){
        alert("Confirme correctamente su clave");
    }
    //SI TODAS LAS COMPROBACIONES SON CORRECTAS, REALIZAR LA SOLICITUD AL SERVIDOR
    else{
        fetch_wrapper.post("registro",datos_form_registro)
        .then(data => {
            alert(data.resultado);
            if(data.status == 200){
                window.open("/","_self");
            }
        })
    }
}