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
        alert("Ingrese un nombre para su repositorio.");
    }
    else if(datos_form_crear_repositorio.get('nombre').length > 25){
        alert("Ingrese un nombre que contenga menos de 25 caracteres.");
    }
    else if(datos_form_crear_repositorio.get('descripcion').length > 100){
        alert("La descripcion del repositoio no puede tener mas de 100 caracteres.");
    }else{
        fetch_wrapper.post('repositorio', datos_form_crear_repositorio).then(data => {
            alert(data.resultado);
            if(data.status == 200){
                window.open(window.location.href,"_self");
            }
        })
    }
}

//FUNCIONALIDAD DE PA PREVISUALIZACION DE LA IMAGEN EN EL MODAL EDITAR REPOSITORIO
var previsualizacion_imagen_editar_repositorio = document.getElementById("previsualizacion-imagen-editar-repositorio");
var input_imagen_editar_repositorio = document.getElementById("input-imagen-editar-repositorio");
input_imagen_editar_repositorio.onchange = (e) => {
    previsualizacion_imagen_editar_repositorio.src = URL.createObjectURL(e.target.files[0]);
}

//FUNCIONALIDAD PARA EDITAR UN REPOSITORIO (MOSTRAR LA INFORMACION DEL REPOSITORIO EN EL MODAL), LLAMADA EN "perfil_usuario.js"
var input_nombre_editar_repositorio = document.getElementById("input-nombre-editar-repositorio");
var input_descripcion_editar_repositorio = document.getElementById("input-descripcion-editar-repositorio");
export function editar_repositorio(repositorio) {
    console.log("editar el repositorio con funcion externa", repositorio.id);
    input_imagen_editar_repositorio.value = "";
    previsualizacion_imagen_editar_repositorio.src = repositorio.ruta_imagen_repositorio;
    input_nombre_editar_repositorio.value = repositorio.nombre;
    input_descripcion_editar_repositorio.value = repositorio.descripcion;
    //ASIGNAR LA FUNCIONALIDAD DE EDICION DEL REPOSITORIO CON EL ID DEL REPOSITORIO ESPECIFICO
    guardar_edicion_repositorio(repositorio.id);
    //ASIGNAR LA FUNCIONALIDAD DE ELIMINACION DEL REPOSITORIO CON EL ID DEL REPOSITORIO ESPECIFICO
    eliminar_repositorio(repositorio.id);
}

//FUNCIONALIDAD PARA GUARDAR LA EDICION DEL REPOSITORIO
var form_editar_repositorio = document.getElementById("form-editar-repositorio");
var boton_guardar_edicion_repositorio = document.getElementById("boton-guardar-edicion-repositorio");
function guardar_edicion_repositorio(id) {
    boton_guardar_edicion_repositorio.onclick = () => {
        //OBTENER LOS DATOS DEL FORM PARA LA EDICION DEL REPOSITORIO
        let datos_form_editar_repositorio = new FormData(form_editar_repositorio);
        datos_form_editar_repositorio.append('id', id);
        //COMPROBAR QUE LOS DATOS DEL FORMULARIO SEAN VALIDOS
        if(datos_form_editar_repositorio.get('nombre') == ""){
            alert("Ingrese un nombre para su repositorio.");
        }
        else if(datos_form_editar_repositorio.get('nombre').length > 25){
            alert("Ingrese un nombre que contenga menos de 25 caracteres.");
        }
        else if(datos_form_editar_repositorio.get('descripcion').length > 100){
            alert("La descripcion del repositoio no puede tener mas de 100 caracteres.");
        }else{
            fetch_wrapper.put('repositorio', datos_form_editar_repositorio).then(data => {
                alert(data.resultado);
                if(data.status == 200){
                    window.open("/perfil-usuario","_self");
                }
            })
        }
    }
}

//FUNCIONALIDAD PARA ELIMINAR UN REPOSITORIO
var boton_eliminar_repositorio = document.getElementById("boton-eliminar-repositorio");
function eliminar_repositorio(id) {
    boton_eliminar_repositorio.onclick = () => {
        if(confirm("¿Desea eliminar este repositorio?")){
            fetch_wrapper.delete('repositorio',{id:id}).then(data => {
                alert(data.resultado);
                if(data.status == 200){
                    window.open("/perfil-usuario","_self");
                }
            })
        }
    }
}