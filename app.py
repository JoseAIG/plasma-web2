from flask import Flask, jsonify
from flask.templating import render_template
from config import *

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)

# @app.route("/")
# def index():
#     return "Hello World."

# ENDPOINT / METODO GET
@app.route("/")
def index():
    return render_template("inicio.html")

# ENDPOINT /login METODO GET
@app.route("/login")
def login():
    return render_template("login.html")

# ENDPOINT /registro METODO POST
@app.route('/registro', methods=['POST']) 
def registro():
    # return jsonify(status = 200, resultado = "Operacion en proceso"), 200
    return {'status': 200, 'resultado':"Operacion en proceso"}, 200

if __name__ == '__main__':
    app.run()