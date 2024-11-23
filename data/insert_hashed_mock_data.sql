-- Archivo SQL con contraseñas hashed utilizando bcrypt y opiniones en los comentarios
-- Insertar datos en la tabla Usuarios
INSERT INTO Usuarios (nombre, correo, telefono, contrasenia, tipo_usuario) VALUES
('Jorge Fernandez', 'jorge.fernandez@example.com', '5555432109', '$2b$10$rd759i5ajA7j/SZ1SVv8.OhtPhwBYrK1xfNVy2W1zw4h6JU/9re7q', 'ARRENDATARIO'),
('Diego Gomez', 'diego.gomez@example.com', '5557654321', '$2b$10$CsLJjAJy5RRXdhr3nt6uueEhvQYQcb/EpMkVmOAGjWFrKg4xMgGKi', 'ALUMNO'),
('Andrea Morales', 'andrea.morales@example.com', '5556543210', '$2b$10$xjNHCAST9vCZ5uNYJ22wkOj5hLD9aJNtjIqJ4hrSsoXS8QVOkrVMa', 'ALUMNO'),
('Luis Torres', 'luis.torres@example.com', '5559876543', '$2b$10$SWsM.JFvm/TluKr.7IHDLeTr6b3uf6NOWzMChw2NCCodiQEpH8R36', 'ARRENDATARIO'),
('Sofia Ruiz', 'sofia.ruiz@example.com', '5558765432', '$2b$10$4FGUB349UNH8FewVAQt/OuTehIXlMCCGluy1wqWsnag.DkQdGU1mG', 'ARRENDATARIO');

-- Insertar datos en la tabla Perfiles
INSERT INTO Perfiles (id_usuario) VALUES
(1), (2), (3), (4), (5);

-- Insertar datos en la tabla Publicaciones
INSERT INTO Publicaciones (id_arrendatario, nombre_inmueble, renta_mensual, tipo_inmueble, ubicacion, informacion_inmueble, fecha_publicacion) VALUES
(1, 'Recamara en Alvaro Obregon', 5000, 'Recamara', 'Alvaro Obregon', 'Recamara pequeña pero funcional, ideal para estudiantes.', '2024-11-17'),
(1, 'Departamento en Benito Juarez', 8000, 'Departamento', 'Benito Juarez', 'Departamento amplio de 2 recamaras con estacionamiento.', '2024-11-16'),
(4, 'Casa en Miguel Hidalgo', 15000, 'Casa', 'Miguel Hidalgo', 'Casa de 3 recamaras, jardin grande y seguridad privada.', '2024-11-15'),
(5, 'Recamara en Coyoacan', 4000, 'Recamara', 'Coyoacan', 'Recamara amueblada, cerca de transporte y comercios.', '2024-11-14'),
(5, 'Casa en Iztapalapa', 3500, 'Casa', 'Iztapalapa', 'Casa comoda y accesible, ideal para familias pequeñas.', '2024-11-12');

-- Insertar datos en la tabla Imagenes
INSERT INTO Imagenes (id_publicacion, url) VALUES
(1, '/images/1_1.jpg'),
(1, '/images/1_2.jpg'),
(2, '/images/2_1.jpg'),
(3, '/images/3_1.jpg'),
(4, '/images/4_1.jpg'),
(5, '/images/5_1.jpg');

-- Insertar datos en la tabla Comentarios con opiniones
INSERT INTO Comentarios (id_publicacion, id_usuario, contenido_comentario, valoracion, fecha_hora) VALUES
(1, 3, 'La recamara es pequeña pero funcional, me gusto.', 4, '2024-11-17 10:30:00'),
(2, 4, 'El departamento esta bien ubicado y comodo.', 5, '2024-11-16 15:45:00'),
(3, 4, 'La casa es espaciosa pero un poco cara.', 3, '2024-11-15 14:00:00'),
(4, 3, 'La recamara esta en excelente estado, muy comoda.', 5, '2024-11-14 11:20:00'),
(5, 4, 'La casa es accesible pero necesita mantenimiento.', 3, '2024-11-12 09:50:00');
