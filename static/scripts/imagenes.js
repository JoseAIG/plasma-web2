//IMPORTS
import { fetch_wrapper } from "./helpers/fetch_wrapper.js";

//PREVISUALIZACION DE LA IMAGEN A CARGAR CUANDO ES SELECCIONADA EN EL MODAL NUEVA IMAGEN
var previsualizacion_imagen_crear_imagen = document.getElementById("previsualizacion-imagen-crear-imagen");
var input_imagen_crear_imagen = document.getElementById("input-imagen-crear-imagen");
input_imagen_crear_imagen.onchange = (e) => {
    previsualizacion_imagen_crear_imagen.src = URL.createObjectURL(e.target.files[0]);
}

//FUNCION PARA ESTABLECER LOS OPTION DEL SELECT REPOSITORIO AL CREAR IMAGEN
var link_nueva_imagen = document.getElementById("link-nueva-imagen");
var input_descripcion_crear_imagen = document.getElementById("input-descripcion-crear-imagen");
var select_repositorio_crear_imagen = document.getElementById("select-repositorio-crear-imagen");
function establecer_datos_crear_imagen() {
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
            alert("Ya el tag se encuentra agregado.")
        }else if(texto_tag.length > 15){
            alert("Los tags no pueden tener mas de 15 caracteres.");
        }else{
            //INCLUIR EL TAG EN EN EL ARREGLO
            tags_imagen.push(texto_tag);
            //DIBUJAR LOS TAGS DE LA IMAGEN
            dibujar_tags(tags_imagen);
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
function dibujar_tags(tags) {
    //LIMPIAR LA LISTA DE TAGS
    limpiar_tags();
    //RECORRER LOS TAGS DE LA IMAGEN PARA DIBUJARLOS
    tags.forEach(tag => {
        //CREAR EL TAG Y AGREGARLO AL CONTENEDOR DE TAGS Y AL ARREGLO
        let div = document.createElement('div');
        div.className = 'tag tag-removible';
        div.style.order = tags_imagen.indexOf(tag); //COLOCAR EL FLEX ORDER SEGUN EL VALOR DEL INDICE DE LA POSICION DEL TAG EN EL ARREGLO DE TAGS
        //SPAN CON EL TEXTO DEL TAG
        let span = document.createElement('span');
        span.textContent = tag;
        div.appendChild(span);
        //IMAGEN ELIMINAR TAG
        let img = document.createElement('img');
        img.src = "/static/assets/icons/remover.svg";
        img.alt = "X";
        div.appendChild(img);
        contenedor_tags_crear_imagen.prepend(div);
        //EVENTO PARA ELIMINAR EL TAG
        img.onclick = () => {
            //REMOVER EL CONTENEDOR DEL TAG DEL DOM
            div.remove();
            //BUSCAR EL INDICE DEL TAG EN EL ARREGLO PARA REMOVERLO
            let indice_tag = tags_imagen.indexOf(tag)
            tags_imagen.splice(indice_tag,1);
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
    //COMPROBAR QUE LOS CAMPOS SEAN VALIDOS PARA REALIZAR LA SOLICITUD
    if(datos_form_crear_imagen.get('imagen').name == ""){
        alert("Debe insertar una imagen.");
    }
    else if(datos_form_crear_imagen.get('descripcion').length > 60){
        alert("Ingrese una descripcion con maximo 60 caracteres.");
    }
    else if(datos_form_crear_imagen.get('repositorio') == ""){
        alert("Seleccione un repositorio donde se guardara la imagen");
    }
    else{
        fetch_wrapper.post('imagen',datos_form_crear_imagen).then(data => {
            alert(data.resultado);
            if(data.status == 200){
                window.open(window.location.href,"_self");
            }
        })
    }
}