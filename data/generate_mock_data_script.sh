#!/bin/bash

# Archivo de salida para el nuevo script SQL
output_file="insert_hashed_mock_data.sql"

# Array de usuarios con sus datos
declare -A usuarios
usuarios["Juan Pérez"]="juan.perez@example.com,5551234567,contrasenia123,ARRENDATARIO"
usuarios["María López"]="maria.lopez@example.com,5551234568,contrasenia456,ARRENDATARIO"
usuarios["Carlos García"]="carlos.garcia@example.com,555123456789,contrasenia789,ALUMNO"
usuarios["Ana Sánchez"]="ana.sanchez@example.com,5554567890,contrasenia101,ALUMNO"
usuarios["Pedro Martínez"]="pedro.martinez@example.com,5555678901,contrasenia202,ARRENDATARIO"

# Generar el encabezado del archivo de salida
echo "-- Archivo SQL con contraseñas hashed utilizando bcrypt" > $output_file
echo "-- Insertar datos en la tabla Usuarios" >> $output_file
echo "INSERT INTO Usuarios (nombre, correo, telefono, contrasenia, tipo_usuario) VALUES" >> $output_file

# Insertar usuarios con contraseñas hashed
i=1
for nombre in "${!usuarios[@]}"; do
    # Separar los datos del usuario
    IFS=',' read -r correo telefono contrasenia tipo_usuario <<< "${usuarios[$nombre]}"

    # Generar hash de contraseña usando node y bcrypt
    echo -n "Hashing: $contrasenia ..."
    hashed_password=$(node -e "const bcrypt = require('bcrypt'); console.log(bcrypt.hashSync('$contrasenia', 10));")
    echo "Hecho."

    # Generar línea SQL para el usuario
    echo -n "('$nombre', '$correo', '$telefono', '$hashed_password', '$tipo_usuario')" >> $output_file

    # Agregar coma si no es el último elemento
    if (( i < ${#usuarios[@]} )); then
        echo "," >> $output_file
    else
        echo ";" >> $output_file
    fi
    ((i++))
done

# Insertar datos en la tabla Perfiles
echo -e "\n-- Insertar datos en la tabla Perfiles" >> $output_file
echo "INSERT INTO Perfiles (id_usuario) VALUES" >> $output_file
echo "(1), (2), (3), (4), (5);" >> $output_file

# Insertar datos en la tabla Publicaciones
echo -e "\n-- Insertar datos en la tabla Publicaciones" >> $output_file
echo "INSERT INTO Publicaciones (id_arrendatario, nombre_inmueble, renta_mensual, informacion_inmueble, fecha_publicacion) VALUES" >> $output_file
echo "(1, 'Departamento en Coyoacán', 5000, 'Departamento de 2 recámaras, 1 baño, cocina y sala. Incluye servicios de agua y gas.', '2024-11-17')," >> $output_file
echo "(2, 'Casa en Iztapalapa', 8000, 'Casa de 3 recámaras, 2 baños, patio trasero, excelente ubicación.', '2024-11-16')," >> $output_file
echo "(5, 'Departamento en Centro Histórico', 6000, 'Departamento amueblado de 1 recámara, baño completo, cerca de transporte público.', '2024-11-15')," >> $output_file
echo "(2, 'Casa en Condesa', 12000, 'Casa moderna de 4 recámaras, jardín y alberca.', '2024-11-14')," >> $output_file
echo "(1, 'Loft en Polanco', 10000, 'Loft amueblado en zona exclusiva, seguridad 24/7.', '2024-11-13')," >> $output_file
echo "(5, 'Estudio en Roma Norte', 7000, 'Estudio acogedor cerca de restaurantes y tiendas.', '2024-11-12');" >> $output_file

# Insertar datos en la tabla Imagenes
echo -e "\n-- Insertar datos en la tabla Imagenes" >> $output_file
echo "INSERT INTO Imagenes (id_publicacion, url) VALUES" >> $output_file
echo "(1, 'images/image1.jpg')," >> $output_file
echo "(1, 'images/image2.jpg')," >> $output_file
echo "(2, 'images/image3.jpg')," >> $output_file
echo "(3, 'images/image4.jpg')," >> $output_file
echo "(4, 'images/image5.jpg')," >> $output_file
echo "(4, 'images/image6.jpg')," >> $output_file
echo "(5, 'images/image7.jpg')," >> $output_file
echo "(5, 'images/image8.jpg')," >> $output_file
echo "(6, 'images/image9.jpg');" >> $output_file

# Insertar datos en la tabla Comentarios
echo -e "\n-- Insertar datos en la tabla Comentarios" >> $output_file
echo "INSERT INTO Comentarios (id_publicacion, id_usuario, contenido_comentario, fecha_hora) VALUES" >> $output_file
echo "(1, 3, 'Interesado en el departamento. ¿Está disponible?', '2024-11-17 10:30:00')," >> $output_file
echo "(2, 4, 'La casa parece muy bien ubicada. ¿Podemos agendar una cita para verla?', '2024-11-16 15:45:00')," >> $output_file
echo "(3, 4, 'Me interesa el departamento. ¿Está amueblado?', '2024-11-15 14:00:00')," >> $output_file
echo "(4, 3, '¿Podría enviarme más fotos de la casa?', '2024-11-14 11:20:00')," >> $output_file
echo "(5, 4, '¿Aceptan mascotas en el loft?', '2024-11-13 16:10:00')," >> $output_file
echo "(6, 3, '¿Está incluido el servicio de internet?', '2024-11-12 09:50:00');" >> $output_file

echo "Script SQL generado en $output_file"

