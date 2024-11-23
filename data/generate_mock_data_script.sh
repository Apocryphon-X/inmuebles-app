#!/bin/bash

# Archivo de salida para el nuevo script SQL
output_file="insert_hashed_mock_data.sql"

# Array de usuarios con sus datos
declare -A usuarios
usuarios["Luis Torres"]="luis.torres@example.com,5559876543,contraseniaLuis,ARRENDATARIO"
usuarios["Sofia Ruiz"]="sofia.ruiz@example.com,5558765432,contraseniaSofia,ARRENDATARIO"
usuarios["Diego Gomez"]="diego.gomez@example.com,5557654321,contraseniaDiego,ALUMNO"
usuarios["Andrea Morales"]="andrea.morales@example.com,5556543210,contraseniaAndrea,ALUMNO"
usuarios["Jorge Fernandez"]="jorge.fernandez@example.com,5555432109,contraseniaJorge,ARRENDATARIO"

# Generar el encabezado del archivo de salida
echo "-- Archivo SQL con contraseñas hashed utilizando bcrypt y opiniones en los comentarios" > $output_file
echo "-- Insertar datos en la tabla Usuarios" >> $output_file
echo "INSERT INTO Usuarios (nombre, correo, telefono, contrasenia, tipo_usuario) VALUES" >> $output_file

# Insertar usuarios con contraseñas hashed
i=1
for nombre in "${!usuarios[@]}"; do
    # Separar los datos del usuario
    IFS=',' read -r correo telefono contrasenia tipo_usuario <<< "${usuarios[$nombre]}"

    # Generar hash de contraseña usando node y bcrypt
    echo -n "Hasheando: $contrasenia ... "
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
echo "INSERT INTO Publicaciones (id_arrendatario, nombre_inmueble, renta_mensual, tipo_inmueble, ubicacion, informacion_inmueble, fecha_publicacion) VALUES" >> $output_file
echo "(1, 'Recamara en Alvaro Obregon', 5000, 'Recamara', 'Alvaro Obregon', 'Recamara pequeña pero funcional, ideal para estudiantes.', '2024-11-17')," >> $output_file
echo "(1, 'Departamento en Benito Juarez', 8000, 'Departamento', 'Benito Juarez', 'Departamento amplio de 2 recamaras con estacionamiento.', '2024-11-16')," >> $output_file
echo "(4, 'Casa en Miguel Hidalgo', 15000, 'Casa', 'Miguel Hidalgo', 'Casa de 3 recamaras, jardin grande y seguridad privada.', '2024-11-15')," >> $output_file
echo "(5, 'Recamara en Coyoacan', 4000, 'Recamara', 'Coyoacan', 'Recamara amueblada, cerca de transporte y comercios.', '2024-11-14')," >> $output_file
echo "(5, 'Casa en Iztapalapa', 3500, 'Casa', 'Iztapalapa', 'Casa comoda y accesible, ideal para familias pequeñas.', '2024-11-12');" >> $output_file

# Insertar datos en la tabla Imagenes
echo -e "\n-- Insertar datos en la tabla Imagenes" >> $output_file
echo "INSERT INTO Imagenes (id_publicacion, url) VALUES" >> $output_file
echo "(1, '/images/1_1.jpg')," >> $output_file
echo "(1, '/images/1_2.jpg')," >> $output_file
echo "(2, '/images/2_1.jpg')," >> $output_file
echo "(3, '/images/3_1.jpg')," >> $output_file
echo "(4, '/images/4_1.jpg')," >> $output_file
echo "(5, '/images/5_1.jpg');" >> $output_file

# Insertar datos en la tabla Comentarios
echo -e "\n-- Insertar datos en la tabla Comentarios con opiniones" >> $output_file
echo "INSERT INTO Comentarios (id_publicacion, id_usuario, contenido_comentario, valoracion, fecha_hora) VALUES" >> $output_file
echo "(1, 3, 'La recamara es pequeña pero funcional, me gusto.', 4, '2024-11-17 10:30:00')," >> $output_file
echo "(2, 4, 'El departamento esta bien ubicado y comodo.', 5, '2024-11-16 15:45:00')," >> $output_file
echo "(3, 4, 'La casa es espaciosa pero un poco cara.', 3, '2024-11-15 14:00:00')," >> $output_file
echo "(4, 3, 'La recamara esta en excelente estado, muy comoda.', 5, '2024-11-14 11:20:00')," >> $output_file
echo "(5, 4, 'La casa es accesible pero necesita mantenimiento.', 3, '2024-11-12 09:50:00');" >> $output_file

echo "Script SQL generado con datos válidos en $output_file"

