//IMPORTS
import { fetch_wrapper } from "./helpers/fetch_wrapper.js";

//FUNCIONALIDAD PARA LA PREVISUALIZACION DE LA IMAGEN AL MOMENTO DE CREAR UN REPOSITORIO
var previsualizacion_imagen_crear_repositorio = document.getElementById("previsualizacion-imagen-crear-repositorio");
var input_imagen_crear_repositorio = document.getElementById("input-imagen-crear-repositorio");
input_imagen_crear_repositorio.onchange = (e) => {
    previsualizacion_imagen_crear_repositorio.src = URL.createObjectURL(e.target.files[0]);
}

//FUNCIONALIDAD PARA CREAR UN NUEVO REPOSITORIO
var form_crear_repositorio = document.getElementById("form-crear-repositorio");
var boton_guardar_repositorio = document.getElementById("boton-guardar-repositorio");
boton_guardar_repositorio.onclick = () => {
    let datos_form_crear_repositorio = new FormData(form_crear_repositorio);
    if(datos_form_crear_repositorio.get('nombre') == ""){
        alert("Ingrese un nombre para su repositorio:");
    }
    else if(datos_form_crear_repositorio.get('nombre').length > 25){
        alert("Ingrese un nombre que contenga menos de 25 caracteres.");
    }
    else if(datos_form_crear_repositorio.get('descripcion').length > 100){
        alert("La descripcion del repositoio no puede tener mas de 100 caracteres.");
    }else{
        fetch_wrapper.post('repositorio', datos_form_crear_repositorio).then(data => {
            console.log(data);
            alert(data.resultado);
            if(data.status == 200){
                window.open("/perfil-usuario","_self");
            }
        })
    }
}