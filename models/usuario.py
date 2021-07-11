from datetime import datetime
from app import db
from datetime import datetime

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(60), nullable=False, unique=True)
    correo = db.Column(db.String(60), nullable=False, unique=True)
    clave = db.Column(db.String(65), nullable=False)
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)

    # CONSTRUCTOR
    def __init__(self, usuario, correo, clave):
        self.usuario = usuario
        self.correo = correo
        self.clave = clave