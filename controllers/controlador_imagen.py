from flask import current_app
import os, uuid, ast
from app import db
from models.imagen import Imagen

# FUNCION PARA CREAR UNA NUEVA IMAGEN
def crear_imagen(request):
    try:
        # OBTENER LOS DATOS DE LA PETICION
        repositorio = request.form['repositorio']
        imagen = request.files['imagen']
        descripcion = request.form['descripcion']
        tags = request.form['tags']
        
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
        nueva_imagen = Imagen(repositorio, descripcion, tags, ruta_imagen)
        db.session.add(nueva_imagen)
        db.session.commit()
        return {"resultado":"Imagen creada exitosamente", "status":200}, 200
    except Exception as e:
        print(e)
        return {"resultado":"No se pudo crear la imagen", "status":500}, 500