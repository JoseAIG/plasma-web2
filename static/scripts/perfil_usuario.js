//IMPORTS
import { fetch_wrapper } from "./helpers/fetch_wrapper.js";
import { editar_repositorio, dibujar_contenido_repositorio } from "./repositorios.js";

window.addEventListener('load',()=>{
    //OBTENER LOS DATOS DEL PERFIL DEL USUARIO
    fetch_wrapper.get("perfil").then(data => {
        //DIBUJAR LOS DATOS DEL USUARIO
        dibujar_datos_usuario(data)
    })

    //OBTENER LOS REPOSITORIOS DEL USUARIO
    fetch_wrapper.get('/repositorio').then(data => {
        //DIBUJAR LAS TARJETAS DE LOS REPOSITORIOS DEL USUARIO
        dibujar_tarjetas_repositorios(data.repositorios_usuario);
    })
})

//FUNCION PARA DIBUJAR LOS DATOS DEL USUARIO
var imagen_perfil_usuario = document.getElementById("imagen-perfil-usuario");
var nombre_usuario = document.getElementById("nombre-usuario");
var correo_usuario = document.getElementById("correo-usuario");
var fecha_registro = document.getElementById("fecha-registro");
function dibujar_datos_usuario(datos) {
    if(imagen_perfil_usuario){
        imagen_perfil_usuario.src = datos.ruta_imagen_perfil;
    }
    nombre_usuario.innerText = datos.usuario;
    correo_usuario.innerText = datos.correo;
    fecha_registro.innerText = datos.fecha_registro;
}

//FUNCION PARA DUBUJAR LAS TARJETAS DE LOS REPOSITORIOS EN EL PERFIL DEL USUARIO
var contenedor_tarjetas_repositorios = document.getElementById("contenedor-tarjetas-repositorios");
function dibujar_tarjetas_repositorios(repositorios) {
    //LIMPIAR EL CONTENEDOR DE TARJETAS DE REPOSITORIOS
    contenedor_tarjetas_repositorios.innerHTML = '';
    //COMPROBAR SI EL USUARIO POSEE REPOSITORIOS
    if(repositorios.length){
        //RECORRER LOS REPOSITORIOS CREANDO LAS TARJETAS PARA CADA UNO
        for(let i=0; i<repositorios.length; i++){
            let col_div = document.createElement('div');
            col_div.className = 'col';
            let card_div = document.createElement('div');
            card_div.className = 'card';
            //IMAGEN DEL REPOSITORIO
            let img = document.createElement('img');
            if(repositorios[i].ruta_imagen_repositorio){
                img.src = repositorios[i].ruta_imagen_repositorio;
            }else{
                img.src = "static/assets/icons/repositorio.svg";
            }
            img.onerror = () => {
                img.src = "static/assets/icons/repositorio.svg";
            }
            card_div.appendChild(img);
            //CUERPO DE LA TARJETA DEL REPOSITORIO
            let card_body_div = document.createElement('div');
            card_body_div.className = 'card-body';
            //NOMBRE DEL REPOSITORIO
            let h5 = document.createElement('h5')
            h5.innerText = repositorios[i].nombre;
            card_body_div.appendChild(h5);
            //DESCRIPCION DEL REPOSITORIO
            if(repositorios[i].descripcion){
                let p = document.createElement('p')
                p.innerText = repositorios[i].descripcion;
                card_body_div.appendChild(p);
            }
            //BOTON EDITAR REPOSITORIO
            let button = document.createElement('button');
            button.innerText = "Editar";
            button.setAttribute("data-bs-toggle","modal");
            button.setAttribute("data-bs-target","#modal-editar-repositorio");
            //EVENTO DEL BOTON EDITAR REPOSITORIO
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                editar_repositorio(repositorios[i]);
            })
            card_body_div.appendChild(button);

            card_div.appendChild(card_body_div);
            //EVENTO PARA VISUALIZAR EL REPOSITORIO
            card_div.style.cursor = "pointer";
            card_div.setAttribute("data-bs-toggle", "modal");
            card_div.setAttribute("data-bs-target", "#modal-visualizar-repositorio");
            card_div.addEventListener('click', () => {
                //DIBUJAR EL CONTENIDO DEL REPOSITORIO (IMAGENES QUE CONTIENE E INFORMACION) (FUNCION EN "repositorios.js")
                dibujar_contenido_repositorio(repositorios[i].id);
            })
            col_div.appendChild(card_div);
            contenedor_tarjetas_repositorios.appendChild(col_div);
        }
    }else{
        //SI NO SE TIENEN REPOSITORIOS, MOSTRAR UN MENSAJE
        let h4 = document.createElement('h4');
        h4.className = 'text-center mx-auto mt-5 w-100';
        h4.innerText = 'Parece que aun no tienes repositorios... ¡Crea alguno!';
        contenedor_tarjetas_repositorios.appendChild(h4);
        //BOTON PARA CREAR UN NUEVO REPOSITORIO
        let button = document.createElement('button');
        button.className = "boton-acento mx-auto w-auto";
        button.innerText = "Nuevo repositorio";
        button.setAttribute("data-bs-toggle","modal");
        button.setAttribute("data-bs-target","#modal-crear-repositorio");
        contenedor_tarjetas_repositorios.appendChild(button);
    }

}