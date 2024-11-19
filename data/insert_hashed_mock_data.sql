-- Archivo SQL con contraseñas hashed utilizando bcrypt
-- Insertar datos en la tabla Usuarios
INSERT INTO Usuarios (nombre, correo, telefono, contrasenia, tipo_usuario) VALUES
('María López', 'maria.lopez@example.com', '5551234568', '$2b$10$B5Y30517KR6Ay42KdJ1YzuSiBy4KjSU/nKbaIjzULj5/8FjW8dlsy', 'ARRENDATARIO'),
('Carlos García', 'carlos.garcia@example.com', '555123456789', '$2b$10$3wGKjcqpr6uFz44oSBiUoeHrwqwMsRZoMQfNMkxxe16ZKZFY6bQgm', 'ALUMNO'),
('Pedro Martínez', 'pedro.martinez@example.com', '5555678901', '$2b$10$kEon8/JNgIcELKSsDM2H1esCMlbm6tNIrq/DECLF21vY6acX2NbpW', 'ARRENDATARIO'),
('Ana Sánchez', 'ana.sanchez@example.com', '5554567890', '$2b$10$cuaqKaUDEdf5vLGgSjoFruJnB5nJW8NZQImhojC4hCNJOKiusXu2S', 'ALUMNO'),
('Juan Pérez', 'juan.perez@example.com', '5551234567', '$2b$10$YpUv.zIDcPfhn7LMNs2hxOdxrQ8gRdevMFNWe0bg/coPi3XyNWGd6', 'ARRENDATARIO');

-- Insertar datos en la tabla Perfiles
INSERT INTO Perfiles (id_usuario) VALUES
(1), (2), (3), (4), (5);

-- Insertar datos en la tabla Publicaciones
INSERT INTO Publicaciones (id_arrendatario, nombre_inmueble, renta_mensual, informacion_inmueble, fecha_publicacion) VALUES
(1, 'Departamento en Coyoacán', 5000, 'Departamento de 2 recámaras, 1 baño, cocina y sala. Incluye servicios de agua y gas.', '2024-11-17'),
(2, 'Casa en Iztapalapa', 8000, 'Casa de 3 recámaras, 2 baños, patio trasero, excelente ubicación.', '2024-11-16'),
(5, 'Departamento en Centro Histórico', 6000, 'Departamento amueblado de 1 recámara, baño completo, cerca de transporte público.', '2024-11-15'),
(2, 'Casa en Condesa', 12000, 'Casa moderna de 4 recámaras, jardín y alberca.', '2024-11-14'),
(1, 'Loft en Polanco', 10000, 'Loft amueblado en zona exclusiva, seguridad 24/7.', '2024-11-13'),
(5, 'Estudio en Roma Norte', 7000, 'Estudio acogedor cerca de restaurantes y tiendas.', '2024-11-12');

-- Insertar datos en la tabla Imagenes
INSERT INTO Imagenes (id_publicacion, url) VALUES
(1, 'images/image1.jpg'),
(1, 'images/image2.jpg'),
(2, 'images/image3.jpg'),
(3, 'images/image4.jpg'),
(4, 'images/image5.jpg'),
(4, 'images/image6.jpg'),
(5, 'images/image7.jpg'),
(5, 'images/image8.jpg'),
(6, 'images/image9.jpg');

-- Insertar datos en la tabla Comentarios
INSERT INTO Comentarios (id_publicacion, id_usuario, contenido_comentario, fecha_hora) VALUES
(1, 3, 'Interesado en el departamento. ¿Está disponible?', '2024-11-17 10:30:00'),
(2, 4, 'La casa parece muy bien ubicada. ¿Podemos agendar una cita para verla?', '2024-11-16 15:45:00'),
(3, 4, 'Me interesa el departamento. ¿Está amueblado?', '2024-11-15 14:00:00'),
(4, 3, '¿Podría enviarme más fotos de la casa?', '2024-11-14 11:20:00'),
(5, 4, '¿Aceptan mascotas en el loft?', '2024-11-13 16:10:00'),
(6, 3, '¿Está incluido el servicio de internet?', '2024-11-12 09:50:00');
