//IMPORT
import { fetch_wrapper } from "./helpers/fetch_wrapper.js";

//CARGAR EL ICONO DEL USUARIO AL CARGAR LA PAGINA
var imagen_icono_perfil = document.getElementById("imagen-icono-perfil");
window.onload = () => {
    fetch_wrapper.get("perfil").then(data => {
        if(data.ruta_imagen_perfil){
            imagen_icono_perfil.src = data.ruta_imagen_perfil
        }
    })

    //SI EL ENDPOINT ES /dashboard SOLICITAR LAS IMAGENES PARA MOSTRARLAS EN LA VISTA DE ENTRADA
    if(window.location.pathname == "/dashboard"){
        fetch_wrapper.get('imagen').then(data => {
            console.log("Lista de imagenes: ", data.imagenes);
            dibujar_imagenes_publicaciones(data.imagenes);
        })
    }
}

//FUNCIONALIDAD PARA CERRAR SESION
var link_cerrar_sesion = document.getElementById("link-cerrar-sesion");
link_cerrar_sesion.onclick = () => {
    fetch_wrapper.post('/dashboard').then(data => {
        alert(data.resultado)
        if(data.status == 200){
            window.open("/","_self");
        }
    })
}

//FUNCIONALIDAD PARA DIBUJAR LAS PUBLICACIONES DE LAS IMAGENES DEL INICIO
var div_contenido_principal = document.getElementById("div-contenido-principal");
function dibujar_imagenes_publicaciones(imagenes) {

    //OCULTAR EL SPINNER DE CARGA
    document.getElementById("carga-imagenes-dashboard").className = "d-none";

    //RECORRER LAS IMAGENES CREANDO LOS ELEMENTOS PARA FORMAR LAS TARJETAS DE INICIO
    imagenes.forEach(imagen =>{
        //TARJETA
        let div = document.createElement('div');
        div.className = "card tarjeta-publicacion";
        //HEADER DE LA TARJETA
        let div_header = document.createElement('div');
        div_header.className = "card-header";
        let img_icono = document.createElement('img');
        img_icono.className = "rounded-circle";
        img_icono.src = imagen.ruta_imagen_perfil;
        img_icono.onerror = () => {
            img_icono.src = 'static/assets/icons/usuario.svg'
        }
        div_header.appendChild(img_icono);
        let span_usuario = document.createElement('span');
        span_usuario.innerText = imagen.usuario + " > " + imagen.nombre_repositorio;
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
        div_footer.className = "card-footer text-muted";
        div_footer.innerText = imagen.fecha_creacion;
        div.appendChild(div_footer);

        //AGREGAR EL DIV DE LA TARJETA EN EL CONTENEDOR PRINCIPAL
        div_contenido_principal.appendChild(div);
    })

}