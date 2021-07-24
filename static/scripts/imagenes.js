//IMPORTS
import { alerta } from "./helpers/alerta.js";
import { fetch_wrapper } from "./helpers/fetch_wrapper.js";

//PREVISUALIZACION DE LA IMAGEN A CARGAR CUANDO ES SELECCIONADA EN EL MODAL NUEVA IMAGEN
var previsualizacion_imagen_crear_imagen = document.getElementById("previsualizacion-imagen-crear-imagen");
var input_imagen_crear_imagen = document.getElementById("input-imagen-crear-imagen");
input_imagen_crear_imagen.onchange = (e) => {
    previsualizacion_imagen_crear_imagen.src = URL.createObjectURL(e.target.files[0]);
}

//FUNCION PARA ESTABLECER LOS DATOS PARA CREAR UNA IMAGEN, INCLUYENDO LOS OPTION DEL SELECT REPOSITORIO AL CREAR IMAGEN
var link_nueva_imagen = document.getElementById("link-nueva-imagen");
var input_descripcion_crear_imagen = document.getElementById("input-descripcion-crear-imagen");
var select_repositorio_crear_imagen = document.getElementById("select-repositorio-crear-imagen");
export function establecer_datos_crear_imagen(value) {
    //LIMPIAR LA IMAGEN DE PREVISUALIZACION
    previsualizacion_imagen_crear_imagen.src = "/static/assets/icons/imagen.svg";
    //LIMPIAR EL INPUT TYPE FILE
    input_imagen_crear_imagen.value = "";
    //LIMPIAR LA DESCRIPCION DE LA NUEVA IMAGEN
    input_descripcion_crear_imagen.value = "";
    //LIMPIAR LOS TAGS DE LA IMAGEN EN EL MODAL DE CREACION
    limpiar_tags()
    tags_imagen = [];
    //LIMPIAR EL SELECT REPOSITORIO
    select_repositorio_crear_imagen.innerHTML = '<option value="">Seleccione un repositorio</option>'
    //SOLICITAR LOS REPOSITORIOS DEL USUARIO
    fetch_wrapper.get('/repositorio').then(data => {
        //RECORRER LOS REPOSITORIOS, CREANDO LOS OPTION Y AGREGANDOLOS AL SELECT
        for(let i=0; i<data.repositorios_usuario.length; i++){
            let option = document.createElement('option');
            option.value = data.repositorios_usuario[i].id;
            option.text = data.repositorios_usuario[i].nombre;
            select_repositorio_crear_imagen.appendChild(option);
        }

        //COMPROBAR SI SE HA BRINDADO EL PARAMETRO "value" PARA ASIGNAR EL VALOR (OPTION) DEL SELECT
        if(Number.isInteger(value)){
            select_repositorio_crear_imagen.value = value;
        }
    })
}
link_nueva_imagen.onclick = establecer_datos_crear_imagen;

//FUNCIONALIDAD PARA AGREGAR TAGS A LA IMAGEN
var tags_imagen = []; //ARREGLO QUE CONTIENE LOS TAGS DE LA IMAGEN
var contenedor_tags_crear_imagen = document.getElementById("contenedor-tags-crear-imagen");
var input_tags_crear_imagen = document.getElementById("input-tags-crear-imagen");
input_tags_crear_imagen.onkeyup = (e) => {
    //OBTENER EL TEXTO DEL TAG DE LA IMAGEN
    let texto_tag = e.target.value
    //SI SE PULSA ENTER, EL TAG NO ES VACIO Y EL TAG NO SE ENCUENTRA YA EN EL ARREGLO DE TAGS...
    if(e.key === 'Enter' && texto_tag!=""){
        if(tags_imagen.includes(texto_tag)){
            alerta("Ya el tag se encuentra agregado.","alert-warning");
        }else if(texto_tag.length > 15){
            alerta("Los tags no pueden tener mas de 15 caracteres.","alert-warning");
        }else{
            //INCLUIR EL TAG EN EN EL ARREGLO
            tags_imagen.push(texto_tag);
            //DIBUJAR LOS TAGS DE LA IMAGEN EN EL CONTENEDOR DE TAGS
            dibujar_tags(tags_imagen, contenedor_tags_crear_imagen);
            //LIMPIAR EL VALOR DEL INPUT TYPE TEXT
            input_tags_crear_imagen.value = "";
        }
    }
}

//FUNCION DE UTILIDAD PARA LIMPIAR LOS TAGS DE LA IMAGEN 
function limpiar_tags() {
    let tags_removibles = document.querySelectorAll(".tag-removible");
    tags_removibles.forEach((tag) => {
        tag.remove();
    })
}

//FUNCIONALIDAD PARA DIBUJAR LOS TAGS EN EL CONTENEDOR DE TAGS
function dibujar_tags(tags, contenedor) {
    //LIMPIAR LA LISTA DE TAGS
    limpiar_tags();
    //HACER UNA COPIA DEL ARREGLO DE LOS TAGS Y RECORRERLO DE REVERSA DIBUJAR LOS TAGS ADECUADAMENTE
    [...tags].reverse().forEach(tag => {
        //CREAR EL TAG Y AGREGARLO AL CONTENEDOR DE TAGS Y AL ARREGLO
        let div = document.createElement('div');
        div.className = 'tag tag-removible';
        //SPAN CON EL TEXTO DEL TAG
        let span = document.createElement('span');
        span.textContent = tag;
        div.appendChild(span);
        //IMAGEN ELIMINAR TAG
        let img = document.createElement('img');
        img.src = "/static/assets/icons/remover.svg";
        img.alt = "X";
        div.appendChild(img);
        contenedor.prepend(div);
        //EVENTO PARA ELIMINAR EL TAG
        img.onclick = () => {
            //REMOVER EL CONTENEDOR DEL TAG DEL DOM
            div.remove();
            //BUSCAR EL INDICE DEL TAG EN EL ARREGLO PARA REMOVERLO
            let indice_tag = tags_imagen.indexOf(tag)
            tags_imagen.splice(indice_tag,1);
            let indice_tag_editar = tags_editar_imagen.indexOf(tag);
            tags_editar_imagen.splice(indice_tag_editar,1);
        }
    })
}

//FUNCIONALIDAD PARA GUARDAR UNA IMAGEN
var form_crear_imagen = document.getElementById("form-crear-imagen");
var boton_guardar_imagen = document.getElementById("boton-guardar-imagen");
boton_guardar_imagen.onclick = () => {
    //OBTENER LOS DATOS DEL FORMULARIO CREAR IMAGEN
    let datos_form_crear_imagen = new FormData(form_crear_imagen);
    //INSERTAR LOS TAGS DE LA IMAGEN EN LOS DATOS DEL FORMULARIO
    datos_form_crear_imagen.append('tags',JSON.stringify(tags_imagen));
    //INSERTAR LA FECHA DE CREACION ACTUAL DE LA IMAGEN SEGUN EL BROWSER
    let fecha_actual = new Date();
    datos_form_crear_imagen.append('fecha_creacion', fecha_actual.getDate()+"/"+(fecha_actual.getMonth()+1)+"/"+fecha_actual.getFullYear()); 
    //COMPROBAR QUE LOS CAMPOS SEAN VALIDOS PARA REALIZAR LA SOLICITUD
    if(datos_form_crear_imagen.get('imagen').name == ""){
        alerta("Debe insertar una imagen.","alert-warning");
    }
    else if(datos_form_crear_imagen.get('descripcion').length > 60){
        alerta("Ingrese una descripcion con maximo 60 caracteres.","alert-warning");
    }
    else if(datos_form_crear_imagen.get('repositorio') == ""){
        alerta("Seleccione un repositorio donde se guardara la imagen.","alert-warning");
    }
    else{
        fetch_wrapper.post('imagen',datos_form_crear_imagen).then(data => {
            if(data.status == 200){
                alerta(data.resultado,"alert-success");
                setTimeout(() => {
                    window.open(window.location.href,"_self");                    
                }, 1000);
            }else{
                alerta(data.resultado,"alert-danger");
            }
        })
    }
}

//FUNCION PARA ESTABLECER EL CONTENIDO DEL MODAL EDITAR IMAGEN
var previsualizacion_imagen_editar_imagen = document.getElementById("previsualizacion-imagen-editar-imagen");
//var input_imagen_editar_imagen = document.getElementById("input-imagen-editar-imagen");
var input_descripcion_editar_imagen = document.getElementById("input-descripcion-editar-imagen");
var select_repositorio_editar_imagen = document.getElementById("select-repositorio-editar-imagen");
var contenedor_tags_editar_imagen = document.getElementById("contenedor-tags-editar-imagen");
var input_tags_editar_imagen = document.getElementById("input-tags-editar-imagen");
export function establecer_contenido_editar_imagen(imagen) {
    previsualizacion_imagen_editar_imagen.src = imagen.ruta_imagen;
    input_descripcion_editar_imagen.value = imagen.descripcion;
    select_repositorio_editar_imagen.innerHTML = '<option value="">Seleccione un repositorio</option>'
    
    //SOLICITAR LOS REPOSITORIOS DEL USUARIO
    fetch_wrapper.get('/repositorio').then(data => {
        //RECORRER LOS REPOSITORIOS, CREANDO LOS OPTION Y AGREGANDOLOS AL SELECT
        for(let i=0; i<data.repositorios_usuario.length; i++){
            let option = document.createElement('option');
            option.value = data.repositorios_usuario[i].id;
            option.text = data.repositorios_usuario[i].nombre;
            select_repositorio_editar_imagen.appendChild(option);
        }
        //ESTABLECER EL VALOR ACTUAL DEL SELECT SEGUN EL REPOSITORIO DONDE SE ENCUENTRA
        select_repositorio_editar_imagen.value = imagen.id_repositorio
    })

    //COPIAR LOS TAGS DE LA IMAGEN EN EL ARREGLO DE TAGS
    tags_editar_imagen = [...imagen.tags];
    //DIBUJAR LOS TAGS DE LA IMAGEN EN EL CONTENEDOR DE TAGS
    dibujar_tags(tags_editar_imagen, contenedor_tags_editar_imagen);
    //ESTABLECER LA FUNCIONALIDAD DE EDICION DE IMAGEN Y ELIMINACION (PASANDO SU ID PARA PODER REALIZAR LAS OPERACIONES)
    editar_imagen(imagen.id);
    eliminar_imagen(imagen.id);
}

//EVENTO FUNCIONALIDAD PARA AGREGAR TAGS A LA IMAGEN QUE SE ESTÁ EDITANDO
var tags_editar_imagen = []; //ARREGLO QUE CONTIENE LOS TAGS DE LA IMAGEN A EDITAR
input_tags_editar_imagen.onkeyup = (e) => {
    //OBTENER EL TEXTO DEL TAG DE LA IMAGEN
    let texto_tag = e.target.value
    //SI SE PULSA ENTER, EL TAG NO ES VACIO Y EL TAG NO SE ENCUENTRA YA EN EL ARREGLO DE TAGS...
    if(e.key === 'Enter' && texto_tag!=""){
        if(tags_editar_imagen.includes(texto_tag)){
            alerta("Ya el tag se encuentra agregado.","alert-warning");
        }else if(texto_tag.length > 15){
            alerta("Los tags no pueden tener mas de 15 caracteres.","alert-warning");
        }else{
            //INCLUIR EL TAG EN EN EL ARREGLO
            tags_editar_imagen.push(texto_tag);
            //DIBUJAR LOS TAGS DE LA IMAGEN EN EL CONTENEDOR DE TAGS
            dibujar_tags(tags_editar_imagen, contenedor_tags_editar_imagen);
            //LIMPIAR EL VALOR DEL INPUT TYPE TEXT
            input_tags_editar_imagen.value = "";
        }
    }
}

//FUNCIONALIDAD PARA EDITAR LOS DATOS DE UNA IMAGEN
var form_editar_imagen = document.getElementById("form-editar-imagen");
var boton_guardar_editar_imagen = document.getElementById("boton-guardar-editar-imagen");
function editar_imagen(id) {
    boton_guardar_editar_imagen.onclick = () => {
        //OBTENER LOS DATOS DEL FORM DATA EDITAR IMAGEN
        let datos_form_editar_imagen = new FormData(form_editar_imagen);
        //INCLUIR EL ID DE LA IMAGEN EN LOS DATOS DEL FORM DATA
        datos_form_editar_imagen.append('id',id);
        //INCLUIR LOS TAGS DE LA IMAGEN EDITADA EN LOS DATOS DEL FORM DATA A ENVIAR
        datos_form_editar_imagen.append('tags',JSON.stringify(tags_editar_imagen));
        //COMPROBAR QUE LOS CAMPOS SEAN VALIDOS PARA REALIZAR LA PETICION
        if(datos_form_editar_imagen.get('descripcion').length > 60){
            alerta("Ingrese una descripcion con maximo 60 caracteres.","alert-warning");
        }
        else if(datos_form_editar_imagen.get('repositorio') == ""){
            alerta("Seleccione un repositorio donde se guardara la imagen.","alert-warning");
        }else{
            fetch_wrapper.put('imagen',datos_form_editar_imagen).then(data => {
                if(data.status == 200){
                    alerta(data.resultado,"alert-success");
                    setTimeout(() => {
                        window.open(window.location.href,"_self");                    
                    }, 1000);
                }else{
                    alerta(data.resultado,"alert-danger");
                }
            })
        }
    }   
}

//FUNCIONALIDAD PARA ELIMINAR UNA IMAGEN
var boton_eliminar_imagen = document.getElementById("boton-eliminar-imagen");
function eliminar_imagen(id) {
    boton_eliminar_imagen.onclick = () => {
        if(confirm("¿Desea eliminar esta imagen?")){
            fetch_wrapper.delete('imagen',{id:id}).then(data => {
                if(data.status == 200){
                    alerta(data.resultado,"alert-success");
                    setTimeout(() => {
                        window.open(window.location.href,"_self");                    
                    }, 1000);
                }else{
                    alerta(data.resultado,"alert-danger");
                }
            })
        }
    }
}