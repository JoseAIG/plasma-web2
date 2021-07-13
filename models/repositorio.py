from datetime import datetime
from app import db

class Repositorio(db.Model):
    __tablename__ = 'repositorios'
    id = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuarios.id'))
    nombre = db.Column(db.String(25), nullable=False)
    descripcion = db.Column(db.String(100), nullable=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    ruta_imagen_repositorio = db.Column(db.String(150), nullable=True)
    # RELACION UNO A MUCHOS CON IMAGENES, ON DELETE CASCADE
    imagenes = db.relationship('Imagen', cascade="all,delete")

    # CONSTRUCTOR
    def __init__(self, id_usuario, nombre, descripcion, ruta_imagen_repositorio):
        self.id_usuario = id_usuario
        self.nombre = nombre
        self.descripcion = descripcion
        self.ruta_imagen_repositorio = ruta_imagen_repositorio
