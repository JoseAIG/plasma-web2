from datetime import datetime
from app import db

class Imagen(db.Model):
    __tablename__ = 'imagenes'
    id = db.Column(db.Integer, primary_key=True)
    id_repositorio = db.Column(db.Integer, db.ForeignKey('repositorios.id'))
    descripcion = db.Column(db.String(60), nullable=True)
    tags = db.Column(db.ARRAY(db.String(15)), nullable=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    ruta_imagen = db.Column(db.String(150), nullable=False)

    # CONSTRUCTOR
    def __init__(self, id_repositorio, descripcion, tags, ruta_imagen, fecha_creacion):
        self.id_repositorio = id_repositorio
        self.descripcion = descripcion
        self.tags = tags
        self.ruta_imagen = ruta_imagen
        self.fecha_creacion = datetime.strptime(fecha_creacion,"%d/%m/%Y")