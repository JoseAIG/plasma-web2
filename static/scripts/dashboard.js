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