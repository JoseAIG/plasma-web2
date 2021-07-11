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
                return {'status': 200, 'resultado':"Inicio de sesion exitoso"}, 200
            else:
                return {'status': 401, 'resultado':"Credenciales invalidas"}, 401
        else:
            return {'status': 401, 'resultado':"Usuario no registrado"}, 401
    except Exception as e:
        print(e)
        return {'status': 500, 'resultado':"No se pudieron verificar las credenciales"}, 500
