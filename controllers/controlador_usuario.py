# FUNCION PARA REGISTRAR UN USUARIO EN LA BASE DE DATOS
def registrar_usuario(request):
    try:
        # print(request.form['usuario'] + " - " + request.form['correo'] + " - " + request.form['clave'] + str(request.files['archivo']))
        print(request.form['usuario'] + " - " + request.form['correo'] + " - " + request.form['clave'])
        return {'status': 200, 'resultado':"Operacion en proceso"}, 200
    except:
        return {'status': 500, 'resultado':"No se pudo realizar el registro"}, 500
        # return jsonify(status = 200, resultado = "Operacion en proceso"), 200