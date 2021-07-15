//IMPORTS
import { fetch_wrapper } from "./helpers/fetch_wrapper.js";
import { obtener_imagenes_recientes, dibujar_imagenes_publicaciones } from "./dashboard.js";

//FUNCION PARA REALIZAR BUSQUEDAS DE IMAGENES POR UN TAG
var form_busqueda = document.getElementById("form-busqueda");
var boton_buscar = document.getElementById("boton-buscar");
var informacion_dashboard = document.getElementById("informacion-dashboard");
var contenedor_imagenes_dashboard = document.getElementById("contenedor-imagenes-dashboard"); 
//var contenedor_resultados = document.getElementById("contenedor-resultados");
const realizar_busqueda = (e) => {
    e.preventDefault();
    //OBTENER LOS DATOS DEL FORM DE LA BUSQUEDA PARA REALIZAR LA PETICION
    let datos_form_buscar = new FormData(form_busqueda);
    let tag = datos_form_buscar.get('tag');
    //COMPROBAR QUE EL TAG SEA VALIDO PARA REALIZAR LA SOLICITUD DE LA BUSQUEDA
    if(!(tag == "" || tag == " ")){
        //LIMPIAR LA INFORMACION DEL DASHBOARD
        informacion_dashboard.innerText = "";
        //LIMPIAR EL CONTENEDOR DE IMAGENES DEL DASHBOARD
        contenedor_imagenes_dashboard.innerHTML = "";
        //MOSTRAR EL SPINNER DE CARGA
        document.getElementById("carga-imagenes-dashboard").className = "d-flex justify-content-center";
        //MOSTRAR EL BOTON QUITAR BUSQUEDA
        boton_quitar_busqueda.style.display = "flex";
        //REALIZAR LA PETICION DE LAS IMAGENES CON EL TAG A BUSCAR
        fetch_wrapper.get('imagen/'+tag)
        .then(data => {
            console.log(data);        
            //OCULTAR EL SPINNER DE CARGA
            document.getElementById("carga-imagenes-dashboard").className = "d-none";
            //DIBUJAR LAS PUBLICACIONES DE LAS IMAGENES QUE COINCIDAN CON EL TAG DE LA BUSQUEDA
            dibujar_imagenes_publicaciones(data.imagenes_tag, "Imagenes con el tag: " + tag);
        })
    }
}
boton_buscar.onclick=realizar_busqueda;

//FUNCIONALIDAD PARA QUITAR LA BUSQUEDA
var input_busqueda = document.getElementById("input-busqueda");
var boton_quitar_busqueda = document.getElementById("boton-quitar-busqueda");
const quitar_busqueda = (e) => {
    e.preventDefault();
    //OCULTAR EL BOTON REMOVER BUSQUEDA
    boton_quitar_busqueda.style.display = "none";
    //LIMPIAR EL VALOR DEL INPUT DE BUSQUEDA
    input_busqueda.value = "";
    //LIMPIAR LA INFORMACION DEL DASHBOARD
    informacion_dashboard.innerText = "";
    //LIMPIAR EL CONTENEDOR DE IMAGENES DEL DASHBOARD
    contenedor_imagenes_dashboard.innerHTML = "";
    //OBTENER LAS IMAGENES MAS RECIENTES
    obtener_imagenes_recientes();
}
boton_quitar_busqueda.onclick = quitar_busqueda;