from flask import Flask, request, jsonify
from flask.templating import render_template
from flask_sqlalchemy import SQLAlchemy
from config import *

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)
db = SQLAlchemy(app)

# CONTROLADOR USUARIO
from controllers.controlador_usuario import *

# ENDPOINT / METODO GET
@app.route("/")
def index():
    return render_template("inicio.html")

# ENDPOINT /login METODO GET
@app.route("/login")
def login():
    return render_template("login.html")
    
# ENDPOINT /login METODO POST
@app.route('/login', methods=['POST']) 
def post_login():
    return verificar_credenciales(request)

# ENDPOINT /registro METODO GET
@app.route("/registro")
def get_registro():
    return render_template("registro.html")

# ENDPOINT /registro METODO POST
@app.route('/registro', methods=['POST']) 
def post_registro():
    return registrar_usuario(request)

if __name__ == '__main__':
    db.init_app(app)

    with app.app_context():
        db.create_all()

    app.run()