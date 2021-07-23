# Plasma (plasma-web2)

Aplicativo web de repositorio de imágenes.

Backend en **Flask**.

**Desarrollo Web II - Universidad Rafael Urdaneta - 2021B**

Desarrollado por: José Inciarte C.I. 27.696.083

---

## Funcionalidades de la aplicación:

### Usuarios

- Registro de usuarios.
- Inicio de sesión (login) y finalizacion de sesión (logout).
- Modificacion de los datos del perfil del usuario.
- Eliminación del perfil del usuario.

### Dashboard

- Visualizar las imágenes publicadas más recientes.
- Buscar imágenes publicadas por medio de algún tag.
- Refrescar las publicaciones de las imágenes.
- Visualizar el repositorio al que pertenece una imagen publicada.
- Acceder al perfil del usuario al que pertenece una imagen publicada.

### Repositorios

- Creación de repositorios.
- Edición de los datos de un repositorio existente.
- Eliminación de un repositorio existente.
- Visualización de repositorios desde la vista del perfil de un usuario.
- Visualizacion del repositorio al que pertenece una imagen publicada vista en el dashboard.

### Imágenes

- Creacion/carga de imágenes a un repositorio que posea el usuario.
- Edición de los datos de una imágen publicada por parte del usuario propietario:
    - Modificacion de la descripcion de la imágen.
    - Modificación del repositorio donde se encuentra la imágen (del usuario propietario).
    - Modificación de los tags que posee la imágen.
- Eliminación de imágenes.
- Visualización de imágenes recientes en el dashboard.
- Visualización de imágenes con un tag específico al realizar una búsqueda.
- Visualización de imágenes en la perspectiva de visualización de un repositorio.

### Otras bondades
 
- Vista personalizada Error 404: Recurso no encontrado.
- Interfáz responsiva, adaptable a pantallas de distintas resoluciones (Computadores, tabletas y smartphones).

---

### Enlaces de relevancia

- Deploy en [Heroku](https://plasma-web2.herokuapp.com/)
- Documentación de los Endpoints (API) en [Postman](https://documenter.getpostman.com/view/15909681/TzmCgCmf)
- Diseño de la aplicación en [Google Drive](https://drive.google.com/file/d/1G1vxchvDOMSVaR9xYmfwbT7_02K8oMfq/view)