from flask import session, current_app
import os, uuid, ast
from app import db
from models.imagen import Imagen

# FUNCION PARA OBTENER LAS IMAGENES SUBIDAS
def obtener_imagenes():
    try:
        # BUSCAR TODAS LAS IMAGENES EN ORDEN DESCENDENTE POR ID
        imagenes = Imagen.query.order_by(Imagen.id.desc()).all()

        # RECORRER LAS IMAGENES, GENERANDO UNA LISTA PARA BRINDARLA COMO RESPUESTA
        lista_imagenes = []
        for imagen in imagenes:
            datos_imagen = {'id':imagen.id, 'id_usuario':imagen.repositorio.usuario.id, 'usuario':imagen.repositorio.usuario.usuario, 'ruta_imagen_perfil': imagen.repositorio.usuario.ruta_imagen_perfil, 'id_repositorio':imagen.id_repositorio, 'nombre_repositorio':imagen.repositorio.nombre, 'descripcion':imagen.descripcion, 'tags':imagen.tags ,'fecha_creacion':imagen.fecha_creacion.strftime("%d/%m/%Y"), 'ruta_imagen':imagen.ruta_imagen}
            lista_imagenes.append(datos_imagen)

        return {"id_usuario": session['id'], "imagenes":lista_imagenes, "status":200}, 200
    except Exception as e:
        print(e)
        return {"resultado":"No se pudieron obtener las imagenes", "status":500}, 500

# FUNCION  PARA OBTENER IMAGENES CON UN TAG ESPECIFICO
def obtener_imagenes_tag(tag):
    try:
        # BUSCAR TODAS LAS IMAGENES QUE POSEAN ESE TAG EN EL ARREGLO DE TAGS DE FORMA DESCENCIENTE
        imagenes_tag = Imagen.query.filter(Imagen.tags.any(tag)).order_by(Imagen.id.desc()).all()

        # RECORRER LOS RESULTADOS DE LAS IMAGENES, GENERANDO UNA LISTA DE IMAGENES PARA BRINDAR RESPUESTA
        lista_imagenes_tag = []
        for imagen in imagenes_tag:
            datos_imagen = {'id':imagen.id, 'id_usuario':imagen.repositorio.usuario.id, 'usuario':imagen.repositorio.usuario.usuario, 'ruta_imagen_perfil': imagen.repositorio.usuario.ruta_imagen_perfil, 'id_repositorio':imagen.id_repositorio, 'nombre_repositorio':imagen.repositorio.nombre, 'descripcion':imagen.descripcion, 'tags':imagen.tags ,'fecha_creacion':imagen.fecha_creacion.strftime("%d/%m/%Y"), 'ruta_imagen':imagen.ruta_imagen}
            lista_imagenes_tag.append(datos_imagen)

        return {"id_usuario": session['id'], "imagenes_tag":lista_imagenes_tag, "status":200}, 200
    except Exception as e:
        print(e)
        return {"resultado":"No se pudieron obtener las imagenes", "status":500}, 500

# FUNCION PARA CREAR UNA NUEVA IMAGEN
def crear_imagen(request):
    try:
        # OBTENER LOS DATOS DE LA PETICION
        repositorio = request.form['repositorio']
        imagen = request.files['imagen']
        descripcion = request.form['descripcion']
        tags = request.form['tags']
        fecha_creacion = request.form['fecha_creacion']
        
        # PARSEAR LOS TAGS RECIBIDOS COMO UN ARREGLO EN STRING A UN ARREGLO PROPIAMENTE
        tags = ast.literal_eval(tags)

        # ASEGURARSE QUE SE HAYA CARGADO UNA IMAGEN
        if imagen.filename != '':
            # COMPROBAR SI LA RUTA PARA LAS IMAGENES EXISTEN, DE NO EXISTIR, SE CREAN
            if not os.path.exists(current_app.config['POST_IMAGES']):
                os.makedirs(current_app.config['POST_IMAGES'])
            # OBTENER LA IMAGEN DE LA PETICION Y ALMACENARLA EN LA RUTA DE IMAGENES DE PERFIL TRAS GENERAR UN NOMBRE UNICO PARA ELLA
            nombre_imagen = uuid.uuid4().hex + imagen.filename
            ruta_imagen = os.path.join(current_app.config['POST_IMAGES'],nombre_imagen)
            imagen.save(ruta_imagen)

        # INSTANCIAR UN MODELO IMAGEN Y AGREGARLO A LA BASE DE DATOS
        nueva_imagen = Imagen(repositorio, descripcion, tags, ruta_imagen, fecha_creacion)
        db.session.add(nueva_imagen)
        db.session.commit()
        return {"resultado":"Imagen creada exitosamente", "status":200}, 200
    except Exception as e:
        print(e)
        return {"resultado":"No se pudo crear la imagen", "status":500}, 500

# FUNCION PARA EDITAR UNA IMAGEN YA EXISTENTE
def editar_imagen(request):
    try:
        # OBTENER LOS DATOS DE LA PETICION
        id = request.form['id']
        descripcion = request.form['descripcion']
        repositorio = request.form['repositorio']
        tags = request.form['tags']

        # PARSEAR LOS TAGS RECIBIDOS COMO UN ARREGLO EN STRING A UN ARREGLO PROPIAMENTE
        tags = ast.literal_eval(tags)

        # FLAG PARA CONOCER SI SE REALIZO UN CAMBIO
        cambio_realizado = False

        # OBTENER EL REGISTRO DE LA IMAGEN EN LA BASE DE DATOS
        imagen = Imagen.query.get(id)

        # COMPROBAR SI LA DESCRIPCION FUE CAMBIADA
        if imagen.descripcion != descripcion:
            imagen.descripcion = descripcion
            cambio_realizado = True
        # COMPROBAR SI EL REPOSITORIO FUE CAMBIADO
        if imagen.repositorio != repositorio:
            imagen.id_repositorio = repositorio
            cambio_realizado = True
        # COMPROBAR SI SE HAN CAMBIADO LOS TAGS DE LA IMAGEN
        if imagen.tags != tags:
            print("tags cambiados" + str(tags))
            imagen.tags = tags
            cambio_realizado = True

        # HECER COMMIT DE LOS CAMBIOS A LA DB DE HABERSE REALIZADO UN CAMBIO
        if cambio_realizado:
            db.session.commit()
            return {"resultado":"Imagen editada exitosamente", "status":200}, 200
        else:
            return {'status':400, 'resultado':"Los datos brindados son los mismos que los actuales"}, 400

    except Exception as e:
        print(e)
        return {"resultado":"No se pudo editar la imagen", "status":500}, 500

# FUNCION PARA ELIMINAR UNA IMAGEN
def eliminar_imagen(request):
    try:
        # OBTENER EL REGISTRO DE LA IMAGEN EN LA BASE DE DATOS Y ELIMINARLO
        imagen = Imagen.query.get(request.json['id'])
        db.session.delete(imagen)
        db.session.commit()
        return {"resultado":"Imagen eliminada exitosamente", "status":200}, 200
    except Exception as e:
        print(e)
        return {"resultado":"No se pudo eliminar la imagen", "status":500}, 500
