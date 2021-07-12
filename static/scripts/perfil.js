//IMPORT
import { fetch_wrapper } from "./helpers/fetch_wrapper.js";
import { validar_correo } from "./helpers/validacion_correo.js"

window.onload = () => {
    console.log("Obtener la imagen del usuario")
}

//FUNCIONALIDAD PARA MOSTRAR LOS DATOS ACTUALES DEL USUARIO CUANDO DESEA MODIFICAR SU PERFIL
var input_editar_usuario = document.getElementById("input-editar-usuario");
var input_editar_correo = document.getElementById("input-editar-correo");
var link_editar_perfil = document.getElementById("link-editar-perfil");
link_editar_perfil.onclick = () => {
    fetch_wrapper.get("perfil").then(data => {
        input_editar_usuario.value = data.usuario;
        input_editar_correo.value = data.correo;
    })
}

//FUNCIONALIDAD MODIFICAR PERFIL
var form_editar_perfil = document.getElementById("form-editar-perfil");
var boton_guardar_edicion_perfil = document.getElementById("boton-guardar-edicion-perfil");
boton_guardar_edicion_perfil.onclick = () => {
    let datos_form_editar_perfil = new FormData(form_editar_perfil);
	if(!validar_correo(datos_form_editar_perfil.get("correo"))){
		alert("Ingrese un correo valido");
	}
    else if(datos_form_editar_perfil.get("clave").length<6 && datos_form_editar_perfil.get("clave")!=""){
		alert("Ingrese una clave con 6 o mas caracteres");
	}
    else if(datos_form_editar_perfil.get("clave")!=datos_form_editar_perfil.get("confirmar-clave")){
		alert("Confirme correctamente su clave");
	}else{
        fetch_wrapper.put("perfil",datos_form_editar_perfil).then(data => {
            alert(data.resultado);
        })
    }
}

//FUNCIONALIDAD ELIMINAR PERFIL
var boton_eliminar_perfil = document.getElementById("boton-eliminar-perfil");
boton_eliminar_perfil.onclick = () => {
    fetch_wrapper.delete("perfil").then(data => {
        alert(data.resultado);
        if(data.status == 200){
            window.open("/","_self");
        }
    })
}
