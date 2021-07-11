//IMPORTS
import { fetch_wrapper } from "./helpers/fetch_wrapper.js";

//FUNCIONALIDAD PARA INICIAR SESION
var form_login = document.getElementById("form-login");
var boton_login = document.getElementById("boton-login");
boton_login.onclick = () => {
    //OBTENER LOS DATOS DEL FORM DE INICIO DE SESION
    let datos_form_login = new FormData(form_login);
    //COMPROBAR QUE SE HAN INGRESADO TODOS LOS DATOS PARA HACER LA SOLICITUD AL SERVIDOR
    if(datos_form_login.get("usuario")=="" || datos_form_login.get("clave")==""){
        alert("Llene todos los campos");
    }else{
        fetch_wrapper.post("login",datos_form_login)
        .then(data =>{
            alert(data.resultado);
            if(data.status == 200){
                window.open("/dashboard","_self");
            }
        })
    }
}