#!/bin/bash

# Archivo de salida para el nuevo script SQL
output_file="insert_hashed_mock_data.sql"

# Array de usuarios con sus datos
declare -A usuarios
usuarios["Juan Pérez"]="juan.perez@example.com,5551234567,contrasenia123,ARRENDATARIO"
usuarios["María López"]="maria.lopez@example.com,5551234568,contrasenia456,ARRENDATARIO"
usuarios["Carlos García"]="carlos.garcia@example.com,5551234567,contrasenia789,ALUMNO"
usuarios["Ana Sánchez"]="ana.sanchez@example.com,5554567890,contrasenia101,ALUMNO"
usuarios["Pedro Martínez"]="pedro.martinez@example.com,5555678901,contrasenia202,ARRENDATARIO"

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
echo "(1, 'Recamara en Coyoacan', 3000, 'Recamara', 'Coyoacan', 'Recamara amplia y bien iluminada, ideal para estudiantes. Incluye cama y armario.', '2024-11-17')," >> $output_file
echo "(3, 'Casa en Iztapalapa', 9000, 'Casa', 'Iztapalapa', 'Casa de 3 recamaras, 2 baños, con patio trasero y estacionamiento.', '2024-11-16')," >> $output_file
echo "(5, 'Departamento en Centro Historico', 7000, 'Departamento', 'Centro Historico', 'Departamento amueblado de 2 recamaras, baño completo y cocina equipada.', '2024-11-15')," >> $output_file
echo "(3, 'Casa en Condesa', 14000, 'Casa', 'Condesa', 'Casa moderna de 4 recamaras, jardin y seguridad privada.', '2024-11-14')," >> $output_file
echo "(1, 'Recamara en Roma Norte', 4000, 'Recamara', 'Roma Norte', 'Recamara acogedora cerca de transporte publico y restaurantes.', '2024-11-12');" >> $output_file

# Insertar datos en la tabla Imagenes
echo -e "\n-- Insertar datos en la tabla Imagenes" >> $output_file
echo "INSERT INTO Imagenes (id_publicacion, url) VALUES" >> $output_file
echo "(1, '/images/1_1.jpg')," >> $output_file
echo "(1, '/images/2_1.jpg')," >> $output_file
echo "(2, '/images/3_1.jpg')," >> $output_file
echo "(3, '/images/4_1.jpg')," >> $output_file
echo "(4, '/images/4_2.jpg')," >> $output_file
echo "(4, '/images/5_1.jpg')," >> $output_file
echo "(5, '/images/5_2.jpg');" >> $output_file

# Insertar datos en la tabla Comentarios
echo -e "\n-- Insertar datos en la tabla Comentarios con opiniones" >> $output_file
echo "INSERT INTO Comentarios (id_publicacion, id_usuario, contenido_comentario, valoracion, fecha_hora) VALUES" >> $output_file
echo "(1, 3, 'La recamara es perfecta para estudiantes, comoda y bien iluminada.', 4, '2024-11-17 10:30:00')," >> $output_file
echo "(2, 4, 'La casa es muy espaciosa y tiene un patio ideal para familias.', 5, '2024-11-16 15:45:00')," >> $output_file
echo "(3, 4, 'El departamento es funcional, aunque un poco caro para la zona.', 3, '2024-11-15 14:00:00')," >> $output_file
echo "(4, 3, 'La casa en Condesa es moderna y bien ubicada. Me encanto el jardin.', 5, '2024-11-14 11:20:00')," >> $output_file
echo "(5, 4, 'La recamara es acogedora, pero un poco pequena para mi gusto.', 2, '2024-11-12 09:50:00');" >> $output_file

echo "Script SQL corregido generado en $output_file"

