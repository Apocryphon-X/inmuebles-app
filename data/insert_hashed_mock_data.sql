-- Archivo SQL con contraseñas hashed utilizando bcrypt y opiniones en los comentarios
-- Insertar datos en la tabla Usuarios
INSERT INTO Usuarios (nombre, correo, telefono, contrasenia, tipo_usuario) VALUES
('María López', 'maria.lopez@example.com', '5551234568', '$2b$10$gF/6hERoq2y36I27uSAfcO9tFC4bk.MPgXYti9ijvMCEM4KkLlodS', 'ARRENDATARIO'),
('Carlos García', 'carlos.garcia@example.com', '5551234567', '$2b$10$Glc0GGcils3NlJwTqbnVreniAyCoctR5EShuiEGgvalB7WagtsSVe', 'ALUMNO'),
('Pedro Martínez', 'pedro.martinez@example.com', '5555678901', '$2b$10$GaRipihPeyCtlP1/6ZLVi.rZvbdy.CSq.JGJsp.OLKoWNq9O.3lye', 'ARRENDATARIO'),
('Ana Sánchez', 'ana.sanchez@example.com', '5554567890', '$2b$10$W2PIPk3WqW4cH/cw5PR9tu59XhOAVNO/RYNNGilMLDpN23EzUddNG', 'ALUMNO'),
('Juan Pérez', 'juan.perez@example.com', '5551234567', '$2b$10$2zGm1K5Ees9LOUJscPlZAu4bLdvLbP.IQjUbvDZSdO.7I1UdVEh1u', 'ARRENDATARIO');

-- Insertar datos en la tabla Perfiles
INSERT INTO Perfiles (id_usuario) VALUES
(1), (2), (3), (4), (5);

-- Insertar datos en la tabla Publicaciones
INSERT INTO Publicaciones (id_arrendatario, nombre_inmueble, renta_mensual, tipo_inmueble, ubicacion, informacion_inmueble, fecha_publicacion) VALUES
(1, 'Recamara en Coyoacan', 3000, 'Recamara', 'Coyoacan', 'Recamara amplia y bien iluminada, ideal para estudiantes. Incluye cama y armario.', '2024-11-17'),
(3, 'Casa en Iztapalapa', 9000, 'Casa', 'Iztapalapa', 'Casa de 3 recamaras, 2 baños, con patio trasero y estacionamiento.', '2024-11-16'),
(5, 'Departamento en Centro Historico', 7000, 'Departamento', 'Centro Historico', 'Departamento amueblado de 2 recamaras, baño completo y cocina equipada.', '2024-11-15'),
(3, 'Casa en Condesa', 14000, 'Casa', 'Condesa', 'Casa moderna de 4 recamaras, jardin y seguridad privada.', '2024-11-14'),
(1, 'Recamara en Roma Norte', 4000, 'Recamara', 'Roma Norte', 'Recamara acogedora cerca de transporte publico y restaurantes.', '2024-11-12');

-- Insertar datos en la tabla Imagenes
INSERT INTO Imagenes (id_publicacion, url) VALUES
(1, '/images/1_1.jpg'),
(1, '/images/2_1.jpg'),
(2, '/images/3_1.jpg'),
(3, '/images/4_1.jpg'),
(4, '/images/4_2.jpg'),
(4, '/images/5_1.jpg'),
(5, '/images/5_2.jpg');

-- Insertar datos en la tabla Comentarios con opiniones
INSERT INTO Comentarios (id_publicacion, id_usuario, contenido_comentario, valoracion, fecha_hora) VALUES
(1, 3, 'La recamara es perfecta para estudiantes, comoda y bien iluminada.', 4, '2024-11-17 10:30:00'),
(2, 4, 'La casa es muy espaciosa y tiene un patio ideal para familias.', 5, '2024-11-16 15:45:00'),
(3, 4, 'El departamento es funcional, aunque un poco caro para la zona.', 3, '2024-11-15 14:00:00'),
(4, 3, 'La casa en Condesa es moderna y bien ubicada. Me encanto el jardin.', 5, '2024-11-14 11:20:00'),
(5, 4, 'La recamara es acogedora, pero un poco pequena para mi gusto.', 2, '2024-11-12 09:50:00');
