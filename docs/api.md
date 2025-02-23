### /login/

***Entrada***
 - correo
 - contrasena

***Salida***
 - tokenDeSesion

### /logout/

***Entrada***
- tokenDeSesion

### POST /registro/

Crear cuenta.

***Entrada***
 - correo
 - contrasena

***Salida***
 - tokenSesion

### DELETE /registro/

Borrar cuenta.

***Entrada***
 - tokenSesion
 - correo
 - contrasena

***Salida***

## Obtener cosas de la BD

### GET /perfil/

Obtiene los datos del perfil de un usuario.

***Entrada***
 - tokenDeSesion
 - idUsuario

***Salida***
 - idUsuario
 - correo
 - acceso
 - primerNombre
 - segundoNombre
 - primerApellido
 - segundoApellido
 - fechaDeNacimiento
 - intereses
 - pais
 - maxGradoEstudios
 - certificaciones
 - actividades
 - proyectos
 - curriculum
 - portafolio
 - categorias

### GET /catalogo/

Obtiene el catalogo de convocvatorias que se le mostrará al usuario.

***Entrada***
 - tokenSesion

***Salida***
 - convocatorias

### GET /busquedas/

Obtiene las busquedas recientes del usuario.

***Entrada***
 - tokenSesion

***Salida***
 - busquedas

### GET /notificaciones/

Obtiene las notificaiones recientes del usuario.

***Entrada***
 - tokenSesion

***Salida***
 - notificaciones

### GET /siguiendo/

Obtiene las cuentas que un usuario sigue.

***Entrada***
 - tokenSesion
 - idUsuario

***Salida***
 - cuentasSeguidas

### GET /seguidores/

Obtiene a los usuarios que siguen a otro usuario.

***Entrada***
 - tokenSesion
 - idUsuario

***Salida***
 - seguidores

### GET /convocatoria/

Obtienen los datos particulares de una convocatoria.

***Entrada***
 - tokenSesion
 - idConvocatoria

***Salida***
 - nombre
 - fechaPublicacion
 - fechaInicio
 - fechaFinal
 - tipo
 - contenido
 - imagenes
 - comentarios
 - categorias

### GET /categorias/

Obtiene una lista de las categorias disponibles.

***Entrada***
 - tokenSesion

***Salida***
 - categorias

### GET /guardadas/

Obtiene las convocatorias guardadas por un usuario.

***Entrada***
 - tokenSesion

***Salida***
 - convocatoriasGuardadas

## Modificar cosas de la BD

### POST /correo/

Añade un correo al usuario.

***Entrada***
 - tokenSesion
 - contrasena
 - correoNuevo

***Salida***

### DELETE /correo/

Elimina un correo del usuario.

***Entrada***
 - tokenSesion
 - contrasena
 - correo

***Salida***

### POST /contrasena/

Modifica la contrasena del usuario.

***Entrada***
 - tokenSesion
 - viejaContrasena
 - nuevaContrasena

***Salida***

### POST /data/

Altera uno de los datos del usuario.

Modifica los datos del usuario

***Entrada***
 - tokenSesion
 - campos
 - datos

***Salida***

### POST /convocatoria/

Permite que un usuario publique una convocatoria.

***Entrada***
 - tokenSesion
 - nombre
 - contenido
 - imagenes
 - fechaInicio
 - fechaFinal
 - categorias

***Salida***

### DELETE /convocatoria/

Borra una convocatoria publicada por el usuario.

***Entrada***
 - tokenSesion
 - idConvocatoria

***Salida***

### POST /comentario/

Permite que el usuario comente una convocatoria

***Entrada***
 - tokenSesion
 - idConvocatoria
 - texto

***Salida***

### DELETE /comentario/

Permite al usuario borrar algun comentario quye haya hecho.

***Entrada***
 - tokenSesion
 - idComentario

***Salida***

### POST /seguir/

Permite que un usuario siga a otro.

***Entrada***
 - tokenSesion
 - idUsuario

***Salida***

### DELETE /seguir/

Permite que el usuario deje de seguir una cuenta.

***Entrada***
 - tokenSesion
 - idUsuario

***Salida***

### POST /guardadas/

Permite al usuario guardar una convocatoria.

***Entrada***
 - tokenSesion
 - idConvocatoria

***Salida***

### DELETE /guardadas/

Permite al usuario eliminar una convocatoria de sus convocatorias guardadas.

***Entrada***
 - tokenSesion
 - idConvocatoria

***Salida***