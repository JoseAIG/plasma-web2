//IMPORTS
import { alerta } from "./helpers/alerta.js";
import { fetch_wrapper } from "./helpers/fetch_wrapper.js";
import { editar_repositorio, dibujar_contenido_repositorio } from "./repositorios.js";

window.addEventListener('load',()=>{
    //OBTENER LOS DATOS DEL USUARIO QUE TIENE LA SESION ACTIVA
    fetch_wrapper.get('perfil').then(data => {
        //ESTABLECER EL CONTENIDO DE LA VISTA DE PERFIL DEL USUARIO
        establecer_contenido_vista_perfil(data);
    })
})

//FUNCION PARA ESTABLECER EL CONTENIDO DE LA VISTA DEL PERFIL DE UN USUARIO
function establecer_contenido_vista_perfil(usuario_logueado) {
    //OBTENER LOS PARAMETROS DE BUSQUEDA DE LA URL
    const urlSearchParams = new URLSearchParams(window.location.search);
    const parametros = Object.fromEntries(urlSearchParams.entries());
    //COMPROBAR SI SE HA BRINDADO EL PARAMETRO DE BUSQUEDA DE "usuario" PARA SOLICITAR LOS DATOS DEL USUARIO ESPECIFICO
    if(parametros.usuario){
        fetch_wrapper.get("perfil-usuario/"+parametros.usuario).then(data => {
            console.log(data);
            if(data.status == 200){
                //DIBUJAR LOS DATOS DEL USUARIO
                dibujar_datos_usuario(data.datos_usuario);
                //DIBUJAR LAS TARJETAS DE LOS REPOSITORIOS DEL USUARIO, COMPROBANDO SI EL USUARIO LOGUEADO ES EL PROPIETARIO PARA BRINDAR LA FUNCIONALIDAD DE EDICION
                dibujar_tarjetas_repositorios(data.repositorios_usuario, data.datos_usuario.id, usuario_logueado.id);
            }
            //EN CASO DE QUE EL USUARIO SOLICITADO NO EXISTA DIBUJAR LA INFORMACION EN LA VISTA DE PERFIL DEL USUARIO
            else if(data.status == 404){
                dibujar_usuario_inexistente();
            }
        })
    }else{
        //DE NO HABER BRINDADO EL PARAMETRO DE BUSQUEDA DE "usuario" EN LA URL, SOLICITAR LOS REPOSITORIOS Y LOS DATOS DEL PERFIL USUARIO QUE ESTA LOGUEADO EN LA APLICACION
        fetch_wrapper.get('/repositorio').then(data => {
            //DIBUJAR LOS DATOS DEL USUARIO
            dibujar_datos_usuario(usuario_logueado);
            //DIBUJAR LAS TARJETAS DE LOS REPOSITORIOS DEL USUARIO
            dibujar_tarjetas_repositorios(data.repositorios_usuario, usuario_logueado.id, usuario_logueado.id);
        })
    }
}

//FUNCION PARA DIBUJAR LOS DATOS DEL USUARIO
var imagen_perfil_usuario = document.getElementById("imagen-perfil-usuario");
var nombre_usuario = document.getElementById("nombre-usuario");
var correo_usuario = document.getElementById("correo-usuario");
var fecha_registro = document.getElementById("fecha-registro");
function dibujar_datos_usuario(datos) {
    //SI EXISTEN LOS DATOS DEL USUARIO DIBUJARLOS
    if(datos){
        if(imagen_perfil_usuario){
            imagen_perfil_usuario.src = datos.ruta_imagen_perfil;
        }
        nombre_usuario.innerText = datos.usuario;
        correo_usuario.innerText = datos.correo;
        fecha_registro.innerText = datos.fecha_registro;
    }
}

//FUNCION PARA DUBUJAR LAS TARJETAS DE LOS REPOSITORIOS EN EL PERFIL DEL USUARIO
//LA FUNCION "dibujar_tarjetas_repositorios" RECIBE TRES PARAMETROS PARA AJUSTAR LA VISTA DEL PERFIL DEL USUARIO EN FUNCION DE LOS DISTINTOS CASOS QUE PUEDAN PRESENTARSE
var informacion_repositorios_perfil = document.getElementById("informacion-repositorios-perfil");
var contenedor_tarjetas_repositorios = document.getElementById("contenedor-tarjetas-repositorios");
function dibujar_tarjetas_repositorios(repositorios, id_usuario, id_usuario_logueado) {
    console.log(id_usuario, id_usuario_logueado);
    //OCULTAR EL SPINNER DE CARGA
    document.getElementById('carga-repositorios-perfil').className = 'd-none';
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
            //COMPROBAR SI EL USUARIO LOGUEADO ES EL PROPIETARIO DEL PERFIL DEL USUARIO AL QUE ESTA ACCEDIENDO
            if(id_usuario == id_usuario_logueado){
                //MOSTRAR INFORMACION
                informacion_repositorios_perfil.innerText = "Mis repositorios";
                //ESTABLECER BOTON EDITAR REPOSITORIO
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
            }
            card_div.appendChild(card_body_div);
            //EVENTO PARA VISUALIZAR EL REPOSITORIO
            card_div.style.cursor = "pointer";
            card_div.setAttribute("data-bs-toggle", "modal");
            card_div.setAttribute("data-bs-target", "#modal-visualizar-repositorio");
            card_div.addEventListener('click', () => {
                //DIBUJAR EL CONTENIDO DEL REPOSITORIO (IMAGENES QUE CONTIENE E INFORMACION) (FUNCION EN "repositorios.js")
                if(id_usuario == id_usuario_logueado){
                    //SI ES EL PROPIETARIO DEL USUARIO
                    dibujar_contenido_repositorio(repositorios[i].id);
                }else{
                    //SI EL USUARIO ES UN TERCERO
                    dibujar_contenido_repositorio(repositorios[i].id, true);
                }
            })
            col_div.appendChild(card_div);
            contenedor_tarjetas_repositorios.appendChild(col_div);
        }
    }else{
        //COMPROBAR SI EL USUARIO LOGUEADO ES EL PROPIETARIO DEL PERFIL DEL USUARIO AL QUE ESTA ACCEDIENDO PARA BRINDARLE PA POSIBILIDAD DE CREAR UN NUEVO REPOSITORIO
        if(id_usuario == id_usuario_logueado){
            //MENSAJE DE NO HAY REPOSITORIOS
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
        }else{
            //MENSAJE DE NO HAY REPOSITORIOS
            let h4 = document.createElement('h4');
            h4.className = 'text-center mx-auto mt-5 w-100';
            h4.innerText = 'Este usuario aún no tiene repositorios';
            contenedor_tarjetas_repositorios.appendChild(h4);
        }

    }

}

//FUNCION PARA DIBUJAR UN MENSAJE DE ERROR 404 CUANDO SE ACCEDE AL PERFIL DE UN USUARIO INEXISTENTE
function dibujar_usuario_inexistente() {
    //OCULTAR EL SPINNER DE CARGA
    document.getElementById('carga-repositorios-perfil').className = 'd-none';
    //REMOVER EL MENSAJE DE REPOSITORIOS
    informacion_repositorios_perfil.innerText = "";
    //MOSTRAR ALERTA DE USUARIO INEXISTENTE
    alerta("Este usuario no existe.", "alert-danger");
    //MOSTRAR MENSAJE DE USUARIO INEXISTENTE
    let h4 = document.createElement('h4');
    h4.className = 'text-center mx-auto mt-5 w-100';
    h4.innerText = 'Este usuario no existe...';
    contenedor_tarjetas_repositorios.appendChild(h4);
    let p = document.createElement('p');
    p.className = "text-center mx-auto mt-2 w-100";
    p.innerText = "Error: 404";
    contenedor_tarjetas_repositorios.appendChild(p);
    //BOTON PARA CREAR UN NUEVO REPOSITORIO
    let button = document.createElement('button');
    button.className = "boton-acento mx-auto w-auto";
    button.innerText = "Volver a inicio";
    button.onclick = () => {
        window.location.href = "/dashboard";
    }
    contenedor_tarjetas_repositorios.appendChild(button);
}