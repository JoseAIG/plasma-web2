//IMPORT
import { fetch_wrapper } from "./helpers/fetch_wrapper.js";

var link_cerrar_sesion = document.getElementById("link-cerrar-sesion");
link_cerrar_sesion.onclick = () => {
    fetch_wrapper.post('/dashboard').then(data => {
        alert(data.resultado)
        if(data.status == 200){
            window.open("/","_self");
        }
    })
}