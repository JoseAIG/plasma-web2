//FUNCION PARA VALIDAR UN CORREO ELECTRONICO
function validar_correo(correo) {    
	//OBTENER LOS INDICES DEL ARROBA Y DEL ULTIMO PUNTO
    let posicionArroba = correo.indexOf("@");
    let posicionUltimoArroba = correo.lastIndexOf("@");
    let posicionUltimoPunto = correo.lastIndexOf(".");
    
    //SI LOS VALORES SON EXISTENTES PROCEDER
    if(posicionArroba && posicionUltimoPunto){
    	//SI EL PRIMER ARROBA NO POSEE EL INDICE DEL ULTIMO ARROBA (MAS DE UN ARROBA) INVALIDAR
    	if(posicionArroba!=posicionUltimoArroba){
    		return false;
    	}
    	//COMPROBAR POSICIONES ERRONEAS DE ARROBA Y PUNTOS PARA INVALIDAR, DE NO CUMPLIRSE NINGUNA CONDICION, MARCAR COMO VALIDO.
		if(posicionArroba<1 || posicionUltimoPunto<1 || posicionUltimoPunto==posicionArroba+1 || posicionUltimoPunto<posicionArroba || (correo.length-1) == posicionUltimoPunto || (correo.length-1) == posicionUltimoArroba){
			return false;
		}else{
			return true;
		}   
    }
}

//EXPORTAR LA FUNCION PARA VALIDAR CORREO
export {
    validar_correo
}