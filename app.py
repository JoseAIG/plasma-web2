from flask import Flask, request, session
from flask.helpers import url_for
from flask.templating import render_template
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import redirect
from config import *

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)
db = SQLAlchemy(app)

# CONTROLADORES
from controllers.controlador_usuario import *
from controllers.controlador_repositorio import *
from controllers.controlador_imagen import *

@app.before_request
def before_request():
    # COMPROBAR SI NO SE POSEE UNA SESION ACTIVA AL RELIZAR SOLICITUDES AL ENDPOINT DE DASHBOARD PARA REDIRIGIR AL LANDING PAGE
    if 'usuario' and 'correo' not in session and request.endpoint in ['dashboard']:
        return redirect(url_for('landing_page'))
    # COMPROBAR SI SE POSEE UNA SESION ACTIVA AL REALIZAR SOLICITUDES AL ENDPOINT DEL LANDING PAGE, REGISTRO Y LOGIN PARA REDIRIGIR AL DASHBOARD
    elif 'usuario' and 'correo' in session and request.endpoint in ['landing_page', 'registro', 'login']:
        return redirect(url_for('dashboard'))

# FAVICON
@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('assets/favicon.ico')

# VISTA 404, RECURSO NO ENCONTRADO
@app.errorhandler(404)
def error_404(e):
    return render_template("404.html") 

# ENDPOINT / METODO GET
@app.route("/")
def landing_page():
    return render_template("inicio.html")

# ENDPOINT /registro
@app.route('/registro', methods = ['GET', 'POST'])
def registro():
    if request.method == 'GET':
        return render_template("registro.html")
    elif request.method == 'POST':
        return registrar_usuario(request)

# ENPOINT /login
@app.route('/login', methods = ['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template("login.html")
    elif request.method == 'POST':
        return verificar_credenciales(request)

# ENDPOINT /dashboard
@app.route('/dashboard', methods = ['GET', 'POST'])
def dashboard():
    if request.method == 'GET':
        return render_template("dashboard.html")
    elif request.method == 'POST':
        session.clear()
        return {"resultado": "Sesion finalizada", "status":200}, 200

# ENDPOINT /perfil
@app.route('/perfil', methods = ['GET', 'PUT', 'DELETE'])
def perfil():
    if request.method == 'GET':
        return obtener_datos_usuario()
    elif request.method == 'PUT':
        return modificar_usuario(request)
    elif request.method == 'DELETE':
        return eliminar_usuario()

# ENDPOINT /repositorio
@app.route('/repositorio', methods = ['GET', 'POST', 'PUT', 'DELETE'])
def repositorio():
    if request.method == 'GET':
        return obtener_repositorios_usuario()
    elif request.method == 'POST':
        return crear_repositorio(request)
    elif request.method == 'PUT':
        return editar_repositorio(request)
    elif request.method == 'DELETE':
        return eliminar_repositorio(request)

# ENDPOINT /repositorio/id
@app.route('/repositorio/<id>', methods = ['GET'])
def repositorio_id(id):
    if request.method == 'GET':
        return obtener_datos_repositorio(id)

# ENDPOINT /imagen
@app.route('/imagen', methods = ['GET', 'POST', 'PUT', 'DELETE'])
def imagen():
    if request.method == 'GET':
        return obtener_imagenes()
    if request.method == 'POST':
        return crear_imagen(request)

# ENDPOINT /imagen/tag
@app.route('/imagen/<tag>', methods = ['GET'])
def imagen_tag(tag):
    if request.method == 'GET':
        return obtener_imagenes_tag(tag)

# ENDPOINT /usuario
@app.route('/perfil-usuario', methods = ['GET'])
def perfil_usuario():
    if request.method == 'GET':
        return render_template('perfil_usuario.html')

if __name__ == '__main__':
    db.init_app(app)

    with app.app_context():
        db.create_all()

    app.run()