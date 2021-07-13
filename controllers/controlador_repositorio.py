from flask import current_app, session
import os, uuid
from app import db
from models.repositorio import Repositorio

# FUNCION PARA OBTENER LOS REPOSITORIOS DEL USUARIO
def obtener_repositorios_usuario():
    try:
        # HACER UNA CONSULTA EN LOS REPOSITORIOS CON EL ID DEL USUARIO
        repositorios_usuario = Repositorio.query.filter_by(id_usuario = session['id']).all()
        # RECORRER LOS REPOSITORIOS DEL USUARIO, GENERANDO UNA LISTA DE REPOSITORIOS PARA BRINDAR RESPUESTA
        lista_repositorios_usuario = []
        for repositorio in repositorios_usuario:
            datos_repositorio = {'id':repositorio.id, 'id_usuario':repositorio.id_usuario, 'nombre':repositorio.nombre, 'descripcion':repositorio.descripcion, 'fecha_creacion':repositorio.fecha_creacion.strftime("%d/%m/%Y"), 'ruta_imagen_repositorio':repositorio.ruta_imagen_repositorio}
            lista_repositorios_usuario.append(datos_repositorio)

        return {"repositorios_usuario":lista_repositorios_usuario , "status":200}, 200
    except Exception as e:
        print(e)
        return {"resultado":"No se pudieron obtener los repositorios", "status":500}, 500

# FUNCION PARA CREAR UN NUEVO REPOSITORIO
def crear_repositorio(request):
    try:
        # OBTENER LOS ELEMENTOS DE LA PETICION
        nombre = request.form['nombre']
        descripcion = request.form['descripcion']
        imagen = request.files['imagen']
        ruta_imagen_repositorio = None

        # COMPROBAR SI SE HA BRINDADO UNA DESCRIPCION DEL REPOSITORIO
        if descripcion == "":
            descripcion = None

        # COMPROBAR SI SE HA CARGADO UNA IMAGEN DEL REPOSITORIO
        if imagen.filename != '':
            # COMPROBAR SI LA RUTA PARA LAS IMAGENES DE PERFIL EXISTEN, DE NO EXISTIR, SE CREAN
            if not os.path.exists(current_app.config['REPOSITORY_IMAGES']):
                os.makedirs(current_app.config['REPOSITORY_IMAGES'])
            # OBTENER LA IMAGEN DE LA PETICION Y ALMACENARLA EN LA RUTA DE IMAGENES DE PERFIL TRAS GENERAR UN NOMBRE UNICO PARA ELLA
            nombre_imagen_repositorio = uuid.uuid4().hex + imagen.filename
            ruta_imagen_repositorio = os.path.join(current_app.config['REPOSITORY_IMAGES'],nombre_imagen_repositorio)
            imagen.save(ruta_imagen_repositorio)

        #INSTANCIAR UN NUEVO OBJETO REPOSITORIO PARA INSERTARLO EN LA BASE DE DATOS
        nuevo_repositorio = Repositorio(session['id'], nombre, descripcion, ruta_imagen_repositorio)
        db.session.add(nuevo_repositorio)
        db.session.commit()
        
        return {"resultado":"Repositorio creado exitosamente", "status":200}, 200
    except Exception as e:
        print(e)
        return {"resultado":"No se pudo crear el repositorio", "status":500}, 500

# FUNCION PARA EDITAR UN REPOSITORIO EXISTENTE
def editar_repositorio(request):
    try:
        cambio_realizado = False # FLAG PARA DETERMINAR SI UN CAMBIO FUE REALIZADO
        # OBTENER EL REGISTRO DEL REPOSITORIO A EDITAR
        repositorio = Repositorio.query.get(request.form['id'])
        # COMPROBAR SI EL NOMBRE HA SIDO CAMBIADO
        if request.form['nombre'] != repositorio.nombre:
            repositorio.nombre = request.form['nombre']
            cambio_realizado = True
        # COMPROBAR SI LA DESCRIPCION HA SIDO CAMBIADA
        if request.form['descripcion'] != repositorio.descripcion:
            repositorio.descripcion = request.form['descripcion']
            cambio_realizado = True
        # COMPROBAR SI SE HA CARGADO UNA IMAGEN
        if not request.files['imagen'].filename == '':
            # COMPROBAR SI LA RUTA PARA LAS IMAGENES DE PERFIL EXISTEN, DE NO EXISTIR, SE CREAN
            if not os.path.exists(current_app.config['REPOSITORY_IMAGES']):
                os.makedirs(current_app.config['REPOSITORY_IMAGES'])
            # OBTENER LA IMAGEN DE LA PETICION Y ALMACENARLA EN LA RUTA DE IMAGENES DE PERFIL TRAS GENERAR UN NOMBRE UNICO PARA ELLA
            imagen_repositorio = request.files['imagen']
            nombre_imagen_repositorio = uuid.uuid4().hex + imagen_repositorio.filename
            ruta_imagen_repositorio = os.path.join(current_app.config['REPOSITORY_IMAGES'],nombre_imagen_repositorio)
            imagen_repositorio.save(ruta_imagen_repositorio)
            # ACTUALIZAR EL VALOR DE LA RUTA DE LA IMAGEN DE PERFIL DEL USUARIO
            repositorio.ruta_imagen_repositorio = ruta_imagen_repositorio
            cambio_realizado = True
        # HECER COMMIT DE LOS CAMBIOS A LA DB DE HABERSE REALIZADO UN CAMBIO
        if cambio_realizado:
            db.session.commit()
            return {'status':200, 'resultado':"Repositorio actualizado exitosamente"}, 200
        else:
            return {'status':400, 'resultado':"Los datos brindados son los mismos que los actuales"}, 400
    except Exception as e:
        print(e)
        return {"resultado":"No se pudo editar el repositorio", "status":500}, 500

# FUNCION PARA ELIMINAR UN REPOSITORIO EXISTENTE
def eliminar_repositorio(request):
    try:
        # OBTENER EL REGISTRO DEL REPOSITORIO EN LA BASE DE DATOS Y ELIMINARLO
        repositorio = Repositorio.query.get(request.json['id'])
        db.session.delete(repositorio)
        db.session.commit()
        return {'status':200, 'resultado':"Repositorio eliminado exitosamente"}, 200
    except Exception as e:
        print(e)
        return {"resultado":"No se pudo eliminar el repositorio", "status":500}, 500