-- Crear tabla Usuarios
CREATE TABLE Usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    telefono INTEGER NOT NULL,
    contrasenia TEXT NOT NULL,
    tipo_usuario TEXT NOT NULL CHECK(tipo_usuario IN ('ALUMNO', 'ARRENDATARIO'))
);

-- Crear tabla Perfiles
CREATE TABLE Perfiles (
    id_perfil INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

-- Crear tabla Publicaciones
CREATE TABLE Publicaciones (
    id_publicacion INTEGER PRIMARY KEY AUTOINCREMENT,
    id_arrendatario INTEGER,
    nombre_inmueble TEXT NOT NULL,
    renta_mensual INTEGER NOT NULL,
    tipo_inmueble TEXT NOT NULL CHECK(tipo_inmueble IN ('Casa', 'Recamara', 'Departamento')),
    ubicacion TEXT NOT NULL,
    informacion_inmueble TEXT NOT NULL,
    fecha_publicacion TEXT NOT NULL,
    FOREIGN KEY (id_arrendatario) REFERENCES Usuarios(id_usuario) ON DELETE SET NULL
);

-- Crear tabla Imagenes
CREATE TABLE Imagenes (
    id_imagen INTEGER PRIMARY KEY AUTOINCREMENT,
    id_publicacion INTEGER,
    url TEXT NOT NULL,
    FOREIGN KEY (id_publicacion) REFERENCES Publicaciones(id_publicacion) ON DELETE CASCADE
);

-- Crear tabla Comentarios
CREATE TABLE Comentarios (
    id_comentario INTEGER PRIMARY KEY AUTOINCREMENT,
    id_publicacion INTEGER,
    id_usuario INTEGER,
    contenido_comentario TEXT NOT NULL,
    valoracion INTEGER NOT NULL CHECK(valoracion BETWEEN 1 AND 5),
    fecha_hora TEXT NOT NULL,
    FOREIGN KEY (id_publicacion) REFERENCES Publicaciones(id_publicacion) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

