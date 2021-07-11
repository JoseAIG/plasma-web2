from flask import Flask, request, jsonify
from flask.templating import render_template
from config import *

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)

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

# ENDPOINT /registro METODO GET
@app.route("/registro")
def get_registro():
    return render_template("registro.html")

# ENDPOINT /registro METODO POST
@app.route('/registro', methods=['POST']) 
def post_registro():
    return registrar_usuario(request)

if __name__ == '__main__':
    app.run()