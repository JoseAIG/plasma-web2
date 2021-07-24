//IMPORT
import { alerta } from "./helpers/alerta.js";
import { fetch_wrapper } from "./helpers/fetch_wrapper.js";
import { establecer_contenido_editar_imagen } from "./imagenes.js";
import { dibujar_contenido_repositorio } from "./repositorios.js";

var imagen_icono_perfil = document.getElementById("imagen-icono-perfil");
window.onload = () => {
    //CARGAR EL ICONO DEL USUARIO AL CARGAR LA PAGINA
    fetch_wrapper.get("perfil").then(data => {
        if(data.ruta_imagen_perfil){
            imagen_icono_perfil.src = data.ruta_imagen_perfil
        }
    })
    //OBTENER LAS IMAGENES MAS RECIENTES
    obtener_imagenes_recientes();
}

//FUNCIONALIDAD PARA OBTENER LAS IMAGENES MAS RECIENTES
export function obtener_imagenes_recientes() {
    //SI EL ENDPOINT ES /dashboard SOLICITAR LAS IMAGENES PARA MOSTRARLAS EN LA VISTA DE ENTRADA
    if(window.location.pathname == "/dashboard"){
        //LIMPIAR LA INFORMACION DEL DASHBOARD
        informacion_dashboard.innerText = "";
        //LIMPIAR EL CONTENEDOR DE IMAGENES DEL DASHBOARD
        contenedor_imagenes_dashboard.innerHTML = "";
        //MOSTRAR EL SPINNER DE CARGA
        document.getElementById("carga-imagenes-dashboard").className = "d-flex justify-content-center";
        //REALIZAR LA SOLCITUD DE LAS IMAGENES
        fetch_wrapper.get('imagen').then(data => {
            //DIBUJAR LAS PUBLICACIONES DE LAS IMAGENES MAS RECIENTES
            dibujar_imagenes_publicaciones(data.id_usuario, data.imagenes, "Las más recientes publicaciones");
        })
    }
}

//FUNCIONALIDAD PARA DIBUJAR LAS PUBLICACIONES DE LAS IMAGENES DEL INICIO
var informacion_dashboard = document.getElementById("informacion-dashboard");
var contenedor_imagenes_dashboard = document.getElementById("contenedor-imagenes-dashboard"); 
export function dibujar_imagenes_publicaciones(id_usuario, imagenes, mensaje) {
    //ESTABLECER LA INFORMACION DE LA BUSQUEDA DEL DASHBOARD
    informacion_dashboard.innerText = mensaje;
    //OCULTAR EL SPINNER DE CARGA
    document.getElementById("carga-imagenes-dashboard").className = "d-none";

    //COMPROBAR QUE EXISTAN IMAGENES PARA MOSTRAR
    if(imagenes.length){
        //RECORRER LAS IMAGENES CREANDO LOS ELEMENTOS PARA FORMAR LAS TARJETAS DE INICIO
        imagenes.forEach(imagen =>{
            //TARJETA
            let div = document.createElement('div');
            div.className = "card tarjeta-publicacion";
            //HEADER DE LA TARJETA
            let div_header = document.createElement('div');
            div_header.className = "card-header";
            let img_icono = document.createElement('img'); //ICONO DEL USUARIO
            img_icono.className = "icono-perfil";
            img_icono.src = imagen.ruta_imagen_perfil;
            img_icono.onerror = () => {
                img_icono.src = 'static/assets/icons/usuario.svg'
            }
            div_header.appendChild(img_icono);
            let span_usuario = document.createElement('span');

            let a_usuario = document.createElement('a'); //ANCHOR TAG DEL PERFIL DEL USUARIO
            a_usuario.style.textDecoration = 'none'
            a_usuario.innerText = imagen.usuario
            a_usuario.href = "perfil-usuario?usuario="+imagen.usuario;
            span_usuario.appendChild(a_usuario);

            span_usuario.innerHTML += " > ";

            let a = document.createElement('a'); //ANCHOR TAG DEL REPOSITORIO AL QUE PERTENECE LA IMAGEN
            a.style.textDecoration = 'none';
            a.innerText = imagen.nombre_repositorio;
            a.setAttribute('data-bs-toggle','modal');
            a.href = "#modal-visualizar-repositorio"
            a.onclick = () => {
                //DIBUJAR EL CONTENIDO DEL REPOSITORIO EN EL MODAL CUANDO SE CLICKEA EL LINK
                dibujar_contenido_repositorio(imagen.id_repositorio);
            }
            span_usuario.appendChild(a);
            div_header.appendChild(span_usuario);
            div.appendChild(div_header);
            //BODY DE LA TARJETA
            let div_body = document.createElement('div');
            let img = document.createElement('img');
            img.src = imagen.ruta_imagen;
            img.onerror = () => {
                img.src = 'static/assets/icons/imagen.svg'
            }
            div_body.appendChild(img);
            let p = document.createElement('p');
            p.innerText = imagen.descripcion;
            div_body.appendChild(p);
            div.appendChild(div_body);
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
            div.appendChild(div_tags);
            //FOOTER DE LA TARJETA
            let div_footer = document.createElement('div');
            div_footer.className = "card-footer text-muted d-flex";
            div_footer.innerText = imagen.fecha_creacion;
            div.appendChild(div_footer);
            //SI EL PROPIETARIO DE LA IMAGEN ESTA VISUALIZANDO LA PUBLICACION DE LA IMAGEN BRINDARLE LA OPCION DE EDITAR LA IMAGEN
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
                
                //EVENTO CUANDO SE PULSA EL ANCHOR TAG (LINK) EDITAR IMAGEN
                a.addEventListener('click', () => {
                    //ESTABLECER ACCION DEL BOTON CERRAR MODAL EDITAR IMAGEN (CERRAR MODAL SIN ABRIR EL REPO AL QUE PERTENECE LA IMAGEN)
                    let boton_cerrar_editar_imagen = document.getElementById("boton-cerrar-editar-imagen");
                    boton_cerrar_editar_imagen.removeAttribute('data-bs-toggle');
                    boton_cerrar_editar_imagen.removeAttribute('data-bs-target');
                    boton_cerrar_editar_imagen.innerText = "Cerrar";
                    //ESTABLECER EL CONTENIDO DE LA IMAGEN EN EL MODAL DE EDICION IMAGEN
                    establecer_contenido_editar_imagen(imagen);
                })
            }

            //AGREGAR EL DIV DE LA TARJETA EN EL CONTENEDOR DE IMAGENES DEL DASHBOARD
            contenedor_imagenes_dashboard.appendChild(div);
        })
    }else{
        //DE NO EXISTIR IMAGENES, MOSTRAR UN MENSAJE
        let h3 = document.createElement('h3');
        h3.innerText = "Parece que no hay imagenes...";
        h3.className = "text-center";
        contenedor_imagenes_dashboard.appendChild(h3);
    }
}

//FUNCIONALIDAD PARA CERRAR SESION
var link_cerrar_sesion = document.getElementById("link-cerrar-sesion");
link_cerrar_sesion.onclick = () => {
    fetch_wrapper.post('/dashboard').then(data => {
        alerta(data.resultado, "alert-primary");
        if(data.status == 200){
            setTimeout(() => {
                window.open("/","_self");
            }, 1000);
        }
    })
}
