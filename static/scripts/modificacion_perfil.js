//IMPORT
import { alerta } from "./helpers/alerta.js";
import { fetch_wrapper } from "./helpers/fetch_wrapper.js";
import { validar_correo } from "./helpers/validacion_correo.js"

//FUNCIONALIDAD PARA MOSTRAR LOS DATOS ACTUALES DEL USUARIO CUANDO DESEA MODIFICAR SU PERFIL
var previsualizacion_imagen_editar_perfil = document.getElementById("previsualizacion-imagen-editar-perfil")
var input_editar_usuario = document.getElementById("input-editar-usuario");
var input_editar_correo = document.getElementById("input-editar-correo");
var link_editar_perfil = document.getElementById("link-editar-perfil");
link_editar_perfil.onclick = () => {
    fetch_wrapper.get("perfil").then(data => {
        console.log(data);
        if(data.ruta_imagen_perfil){
            previsualizacion_imagen_editar_perfil.src = data.ruta_imagen_perfil
        }
        input_editar_usuario.value = data.usuario;
        input_editar_correo.value = data.correo;
    })
}

//PREVISUALIZACION DE LA NUEVA IMAGEN DE PERFIL DEL USUARIO
var input_nueva_imagen_perfil = document.getElementById("input-nueva-imagen-perfil");
input_nueva_imagen_perfil.onchange = (e) => {
    previsualizacion_imagen_editar_perfil.src = URL.createObjectURL(e.target.files[0]);
}

//FUNCIONALIDAD MODIFICAR PERFIL
var form_editar_perfil = document.getElementById("form-editar-perfil");
var boton_guardar_edicion_perfil = document.getElementById("boton-guardar-edicion-perfil");
boton_guardar_edicion_perfil.onclick = () => {
    let datos_form_editar_perfil = new FormData(form_editar_perfil);
	if(!validar_correo(datos_form_editar_perfil.get("correo"))){
        alerta("Ingrese un correo válido", "alert-warning");
	}
    else if(datos_form_editar_perfil.get("clave").length<6 && datos_form_editar_perfil.get("clave")!=""){
        alerta("Ingrese una clave con 6 o mas caracteres", "alert-warning");
	}
    else if(datos_form_editar_perfil.get("clave")!=datos_form_editar_perfil.get("confirmar-clave")){
        alerta("Confirme correctamente su clave", "alert-warning");
	}else{
        fetch_wrapper.put("perfil",datos_form_editar_perfil).then(data => {
            console.log(data);
            if(data.status == 200){
                alerta(data.resultado, "alert-success");
                setTimeout(() => {
                    window.open("/dashboard","_self");
                }, 1000);
            }else{
                alerta(data.resultado, "alert-danger");
            }
        })
    }
}

//FUNCIONALIDAD ELIMINAR PERFIL
var boton_eliminar_perfil = document.getElementById("boton-eliminar-perfil");
boton_eliminar_perfil.onclick = () => {
    if(confirm("¿Desea eliminar su perfil?")){
        fetch_wrapper.delete("perfil").then(data => {
            if(data.status == 200){
                alerta(data.resultado, "alert-success");
                setTimeout(() => {
                    window.open("/","_self");
                }, 1000);
            }else{
                alerta(data.resultado, "alert-danger");
            }
        })
    }
}
