from flask import current_app, session
import bcrypt
import os, uuid
from app import db
from models.usuario import Usuario
from models.repositorio import Repositorio

# FUNCION PARA REGISTRAR UN USUARIO EN LA BASE DE DATOS
def registrar_usuario(request):
    try:
        # OBTENER EL HASH DE LA CLAVE DEL USUARIO
        hash_clave = bcrypt.hashpw(request.form['clave'].encode('utf8'), bcrypt.gensalt()).decode()
        # COMPROBAR SI SE HA CARGADO UNA IMAGEN DE PERFIL
        if not request.files['imagen'].filename == '':
            # COMPROBAR SI LA RUTA PARA LAS IMAGENES DE PERFIL EXISTEN, DE NO EXISTIR, SE CREAN
            if not os.path.exists(current_app.config['PROFILE_IMAGES']):
                os.makedirs(current_app.config['PROFILE_IMAGES'])
            # OBTENER LA IMAGEN DE LA PETICION Y ALMACENARLA EN LA RUTA DE IMAGENES DE PERFIL TRAS GENERAR UN NOMBRE UNICO PARA ELLA
            imagen_perfil = request.files['imagen']
            nombre_imagen_perfil = uuid.uuid4().hex + imagen_perfil.filename
            ruta_imagen_perfil = os.path.join(current_app.config['PROFILE_IMAGES'],nombre_imagen_perfil)
            imagen_perfil.save(ruta_imagen_perfil)
            # INSTANCIAR UN NUEVO USUARIO CON LA RUTA DE LA IMAGEN DEFINIDA
            nuevo_usuario = Usuario(request.form['usuario'], request.form['correo'], hash_clave, ruta_imagen_perfil)
        else:
            # INSTANCIAR UN NUEVO USUARIO SIN UNA RUTA PARA LA IMAGEN
            nuevo_usuario = Usuario(request.form['usuario'], request.form['correo'], hash_clave, None)
        db.session.add(nuevo_usuario)
        db.session.commit()
        return {'status': 200, 'resultado':"Usuario registrado exitosamente"}, 200
    except Exception as e:
        print(e)
        return {'status': 500, 'resultado':"No se pudo realizar el registro"}, 500

# FUNCION PARA VALIDAR LAS CREDENCIALES DE UN USUARIO (EMPLEADO PARA INICIO DE SESION)
def verificar_credenciales(request):
    try:
        # BUSCAR EL REGISTRO DEL USUARIO
        usuario = Usuario.query.filter((Usuario.usuario == request.form['usuario']) | (Usuario.correo == request.form['usuario'])).first()
        # DE EXISTIR EL USUARIO EN LA BASE DE DATOS COMPROBAR LA CLAVE INGRESADA CON SU HASH
        if usuario is not None:
            if bcrypt.checkpw(request.form['clave'].encode('utf-8'), usuario.clave.encode('utf-8')):
                session['id'] = usuario.id
                session['usuario'] = usuario.usuario
                session['correo'] = usuario.correo
                return {'status': 200, 'resultado':"Inicio de sesion exitoso"}, 200
            else:
                return {'status': 401, 'resultado':"Credenciales invalidas"}, 401
        else:
            return {'status': 401, 'resultado':"Usuario no registrado"}, 401
    except Exception as e:
        print(e)
        return {'status': 500, 'resultado':"No se pudieron verificar las credenciales"}, 500

# FUNCION PARA OBTENER LOS DATOS DE UN USUARIO
def obtener_datos_usuario():
    try:
        usuario = Usuario.query.get(session['id'])
        return {'id':usuario.id, 'usuario':usuario.usuario, 'correo':usuario.correo, 'fecha_registro':usuario.fecha_registro.strftime("%d/%m/%Y"), 'ruta_imagen_perfil':usuario.ruta_imagen_perfil, 'status':200}, 200
    except Exception as e:
        print(e)
        return {'status': 500, 'resultado':"No se pudo obtener los datos del usuario"}, 500

# FUNCION PARA MODIFICAR LOS DATOS DE UN USUARIO
def modificar_usuario(request):
    try:
        cambio_realizado = False # FLAG PARA DETERMINAR SI UN CAMBIO FUE REALIZADO
        # OBTENER EL REGISTRO DEL USUARIO EN LA BASE DE DATOS
        usuario = Usuario.query.get(session['id'])
        # COMPROBAR SI EL NOMBRE DE USUARIO FUE CAMBIADO
        if usuario.usuario != request.form['usuario']:
            usuario.usuario = request.form['usuario']
            cambio_realizado = True
        # COMPROBAR SI EL CORREO DEL USUARIO FUE CAMBIADO
        if usuario.correo != request.form['correo']:
            usuario.correo = request.form['correo']
            cambio_realizado = True
        # COMPROBAR SI SE SOLICITA UN CAMBIO DE CLAVE
        if request.form['clave'] != "":
            # OBTENER EL HASH DE LA NUEVA CLAVE DEL USUARIO
            hash_clave = bcrypt.hashpw(request.form['clave'].encode('utf8'), bcrypt.gensalt()).decode()
            usuario.clave = hash_clave
            cambio_realizado = True
        # COMPROBAR SI SE HA ENVIADO UNA NUEVA IMAGEN DE PERFIL
        if not request.files['imagen'].filename == '':
            # COMPROBAR SI LA RUTA PARA LAS IMAGENES DE PERFIL EXISTEN, DE NO EXISTIR, SE CREAN
            if not os.path.exists(current_app.config['PROFILE_IMAGES']):
                os.makedirs(current_app.config['PROFILE_IMAGES'])
            # OBTENER LA IMAGEN DE LA PETICION Y ALMACENARLA EN LA RUTA DE IMAGENES DE PERFIL TRAS GENERAR UN NOMBRE UNICO PARA ELLA
            imagen_perfil = request.files['imagen']
            nombre_imagen_perfil = uuid.uuid4().hex + imagen_perfil.filename
            ruta_imagen_perfil = os.path.join(current_app.config['PROFILE_IMAGES'],nombre_imagen_perfil)
            imagen_perfil.save(ruta_imagen_perfil)
            # ACTUALIZAR EL VALOR DE LA RUTA DE LA IMAGEN DE PERFIL DEL USUARIO
            usuario.ruta_imagen_perfil = ruta_imagen_perfil
            cambio_realizado = True
        # HECER COMMIT DE LOS CAMBIOS A LA DB DE HABERSE REALIZADO UN CAMBIO Y ACTUALIZAR LOS VALORES DE LA SESION
        if cambio_realizado:
            db.session.commit()
            session['usuario'] = usuario.usuario
            session['correo'] = usuario.correo
            print(session)
            return {'status':200, 'resultado':"Datos actualizados exitosamente"}, 200
        else:
            return {'status':400, 'resultado':"Los datos brindados son los mismos que los actuales"}, 400
    except Exception as e:
        print(e)
        return {'status':500, 'resultado':"No se pudo modificar el perfil"}, 500

# FUNCION PARA LA ELIMINACION DE UN USUARIO
def eliminar_usuario():
    try:
        # OBTENER EL REGISTRO DEL USUARIO EN LA BASE DE DATOS Y ELIMINARLO
        usuario = Usuario.query.get(session['id'])
        db.session.delete(usuario)
        db.session.commit()
        # ELIMINAR LA SESION
        session.clear()
        return {'status':200, 'resultado':"Perfil eliminado exitosamente"}, 200
    except Exception as e:
        print(e)
        return {'status':500, 'resultado':"No se pudo eliminar el perfil"}, 500

# FUNCION PARA OBTENER LOS DATOS DEL PERFIL DE UN USUARIO
def obtener_perfil_usuario(usuario):
    try:
        print("se obtendran los datos del perfil del usuario " + usuario)

        # OBTENER LOS DATOS DEL PERFIL DEL USUARIO
        usuario = Usuario.query.filter(Usuario.usuario == usuario).first()

        # SI NO EXISTE EL USUARIO DEVOLVER LA VISTA DE 404
        if not usuario:
            print("no existe ese usuario")
            return {"resultado": "No existe ese usuario", "status":404}, 404

        datos_usuario = {'id':usuario.id, 'usuario':usuario.usuario, 'correo':usuario.correo, 'fecha_registro':usuario.fecha_registro.strftime("%d/%m/%Y"), 'ruta_imagen_perfil':usuario.ruta_imagen_perfil}

        # OBTENER LOS REPOSITORIOS DEL USUARIO
        repositorios_usuario = Repositorio.query.filter(Repositorio.id_usuario == usuario.id).order_by(Repositorio.id.desc()).all()
        lista_repositorios_usuario = []
        for repositorio in repositorios_usuario:
            datos_repositorio = {'id':repositorio.id, 'id_usuario':repositorio.id_usuario, 'nombre':repositorio.nombre, 'descripcion':repositorio.descripcion, 'fecha_creacion':repositorio.fecha_creacion.strftime("%d/%m/%Y"), 'ruta_imagen_repositorio':repositorio.ruta_imagen_repositorio}
            lista_repositorios_usuario.append(datos_repositorio)

        return {"datos_usuario": datos_usuario, "repositorios_usuario":lista_repositorios_usuario, "status":200}, 200
    except Exception as e:
        print(e)
        return {"resultado": "No se pudo obtener el perfil del usuario", "status":500}, 500
