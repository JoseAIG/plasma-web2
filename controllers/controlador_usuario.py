from flask import session
import bcrypt
from app import db
from models.usuario import Usuario

# FUNCION PARA REGISTRAR UN USUARIO EN LA BASE DE DATOS
def registrar_usuario(request):
    try:
        # OBTENER EL HASH DE LA CLAVE DEL USUARIO
        hash_clave = bcrypt.hashpw(request.form['clave'].encode('utf8'), bcrypt.gensalt()).decode()
        # INSTANCIAR UN NUEVO USUARIO E INGRESARLO A LA BASE DE DATOS
        nuevo_usuario = Usuario(request.form['usuario'], request.form['correo'], hash_clave)
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
        return {'id':usuario.id, 'usuario':usuario.usuario, 'correo':usuario.correo, 'fecha_registro':usuario.fecha_registro, 'status':200}, 200
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
        # HECER COMMIT DE LOS CAMBIOS A LA DB DE HABERSE REALIZADO UN CAMBIO Y ACTUALIZAR LOS VALORES DE LA SESION
        if cambio_realizado:
            db.session.commit()
            session['usuario'] = usuario.usuario
            session['correo'] = usuario.correo
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