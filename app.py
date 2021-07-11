from flask import Flask, request, session, jsonify
from flask.helpers import url_for
from flask.templating import render_template
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import redirect
from config import *

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)
db = SQLAlchemy(app)

# CONTROLADOR USUARIO
from controllers.controlador_usuario import *

@app.before_request
def before_request():
    # COMPROBAR SI NO SE POSEE UNA SESION ACTIVA AL RELIZAR SOLICITUDES AL ENDPOINT DE DASHBOARD PARA REDIRIGIR AL LANDING PAGE
    if 'usuario' and 'correo' not in session and request.endpoint in ['dashboard']:
        return redirect(url_for('landing_page'))
    # COMPROBAR SI SE POSEE UNA SESION ACTIVA AL REALIZAR SOLICITUDES AL ENDPOINT DEL LANDING PAGE, REGISTRO Y LOGIN PARA REDIRIGIR AL DASHBOARD
    elif 'usuario' and 'correo' in session and request.endpoint in ['landing_page', 'registro', 'login']:
        return redirect(url_for('dashboard'))

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

# ENDPOINT /dashboard METODO GET
@app.route('/dashboard')
def dashboard():
    return "Esta es la vista del dashboard"

if __name__ == '__main__':
    db.init_app(app)

    with app.app_context():
        db.create_all()

    app.run()