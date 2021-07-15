//IMPORTS
import { fetch_wrapper } from "./helpers/fetch_wrapper.js";
import { establecer_datos_crear_imagen, establecer_contenido_editar_imagen } from "./imagenes.js";

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

//FUNCION PARA DIBUJAR LAS IMAGENES DE LOS REPOSITORIOS DENTRO DEL MODAL VISUALIZAR REPOSITORIO
var nombre_visualizar_repositorio = document.getElementById("nombre-visualizar-repositorio");
var previsualizacion_imagen_visualizar_repositorio = document.getElementById("previsualizacion-imagen-visualizar-repositorio");
var descripcion_visualizar_repositorio = document.getElementById("descripcion-visualizar-repositorio");
var contenedor_imagenes_visualizar_repositorio = document.getElementById("contenedor-imagenes-visualizar-repositorio");
export function dibujar_contenido_repositorio(id) {

    //LIMPIAR LOS VALORES DEL REPOSITORIO
    nombre_visualizar_repositorio.innerText = "";
    previsualizacion_imagen_visualizar_repositorio.src = "/static/assets/icons/repositorio.svg";
    descripcion_visualizar_repositorio.innerText = "";
    //MOSTRAR SPINNER DE CARGA
    contenedor_imagenes_visualizar_repositorio.innerHTML = '<div class="spinner-border" role="status"></div>';

    //SOLICITAR LOS DATOS DEL REPOSITORIO Y DIBUJAR LA INFORMACION
    fetch_wrapper.get('repositorio/'+id).then(data => {
        //LIMPIAR CONTENEDOR DE IMAGENES
        contenedor_imagenes_visualizar_repositorio.innerHTML = "";
        //OBTENER LOS DATOS DE LA RESPUESTA
        let id_usuario = data.id_usuario;
        let repositorio = data.repositorio;
        let imagenes_repositorio = data.imagenes_repositorio;
        //ESTABLECER LOS VALORES BASICOS DEL REPOSITORIO
        nombre_visualizar_repositorio.innerText = repositorio.nombre;
        previsualizacion_imagen_visualizar_repositorio.src = repositorio.ruta_imagen_repositorio;
        descripcion_visualizar_repositorio.innerText = repositorio.descripcion;

        //COMPROBAR QUE EL REPOSITORIO POSEA IMAGENES
        if(imagenes_repositorio.length){
            //DIBUJAR LAS IMAGENES DEL REPOSITORIO
            imagenes_repositorio.forEach(imagen => {
                let div = document.createElement('div');
                div.className = 'col'
                let div_card = document.createElement('div');
                div_card.className = 'card tarjeta-imagen';
                //CUERPO DE LA TARJETA
                let div_body = document.createElement('div');
                div_body.className = 'card-body';
                let img = document.createElement('img'); //IMAGEN
                img.src = imagen.ruta_imagen;
                img.onerror = () => {
                    img.src = "/static/assets/icons/imagen.svg";
                }
                div_body.appendChild(img);
                let p = document.createElement('p'); //DESCRIPCION
                p.innerText = imagen.descripcion;
                div_body.appendChild(p);
                div_card.appendChild(div_body);
                //CONTENEDOR DE TAGS DE LA IMAGEN
                let div_tags = document.createElement('div');
                div_tags.className = "contenedor-tags-publicacion";
                imagen.tags.forEach(tag =>{
                    let div_tag = document.createElement('div');
                    div_tag.className = "tag";
                    let span = document.createElement('span');
                    span.textContent = tag;
                    div_tag.appendChild(span);
                    div_tags.appendChild(div_tag)
                })
                div_card.appendChild(div_tags);
                //FOOTER DE LA TARJETA DE LA IMAGEN
                let div_footer = document.createElement('div');
                div_footer.className = "card-footer text-muted d-flex";
                div_footer.innerText = imagen.fecha_creacion;
                //SI EL DUEÑO DEL REPOSITORIO, POR ENDE DE LA IMAGEN, ES EL QUE VISUALIZA, AGREGAR EL BOTON EDITAR IMAGEN
                if(id_usuario == imagen.id_usuario){
                    let a = document.createElement('a');
                    a.setAttribute('data-bs-toggle', 'modal');
                    a.setAttribute('data-bs-dismiss', 'modal');
                    a.href = "#modal-editar-imagen"
                    a.style.marginLeft = "auto";
                    let img_editar = document.createElement('img');
                    img_editar.src = "/static/assets/icons/editar.svg";
                    img_editar.alt = "editar";
                    a.appendChild(img_editar);
                    div_footer.appendChild(a);
                    
                    //div_footer.innerHTML += '<a data-bs-toggle="modal" data-bs-dismiss="modal" href="#modal-editar-imagen" style="margin-left: auto"><img src="/static/assets/icons/editar.svg" alt="editar"></a>'

                    //DIBUJAR EL CONTENIDO DEL MODAL PARA EDITAR LA IMAGEN CUANDO SE PULSA EL ANCHOR TAG (LINK EDITAR)
                    console.log("Antes del evento click: ", imagen, imagen.tags);
                    a.addEventListener('click', () => {
                        console.log("me vais a dibujar esta imafen ve: ", imagen, imagen.tags);
                        establecer_contenido_editar_imagen(imagen);
                    })
                }
                div_card.appendChild(div_footer);

                div.appendChild(div_card);
                contenedor_imagenes_visualizar_repositorio.appendChild(div);
            })
        }else{
            //SI NO SE TIENEN REPOSITORIOS, MOSTRAR UN MENSAJE
            let h4 = document.createElement('h4');
            h4.className = 'text-center mx-auto mt-5 w-100';
            h4.innerText = 'Parece que aun no tienes imagenes en este repositorio... ¡Sube alguna!';
            contenedor_imagenes_visualizar_repositorio.appendChild(h4);
            //BOTON PARA CREAR UN NUEVO REPOSITORIO
            let button = document.createElement('button');
            button.className = "boton-acento mx-auto w-auto";
            button.innerText = "Nueva imagen";
            button.setAttribute("data-bs-toggle","modal");
            button.setAttribute("data-bs-target","#modal-crear-imagen");
            //AL PULSAR EL BOTON CREAR NUEVA IMAGEN EN LA VISTA DE REPOSITORIO SIN IMAGEN, ESTABLECER LOS DATOS DE LA IMAGEN
            button.onclick = () => {
                establecer_datos_crear_imagen();
            }
            contenedor_imagenes_visualizar_repositorio.appendChild(button);
        }

    })
}