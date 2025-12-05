#!/bin/bash

# Script para verificar e iniciar servicios necesarios para TechLab Backend

# --- 1. Verificar MongoDB ---
echo "Verificando el estado de MongoDB..."

# Usamos mongosh para enviar un comando 'ping' a la base de datos.
# La opción --quiet suprime la salida exitosa, solo muestra errores.
if mongosh --eval "db.adminCommand('ping')" --quiet &> /dev/null; then
    echo "✅ MongoDB está corriendo y accesible."
else
    echo "❌ Error: No se pudo conectar a MongoDB."
    echo "   Asegúrate de que el servicio de MongoDB esté iniciado."
    exit 1
fi


# --- 2. Verificar MinIO (Servicio de Usuario de Systemd) ---
echo "" # Línea en blanco para separar secciones
echo "Verificando el estado de MinIO (servicio de usuario)..."

# Comprobar si el servicio systemd a nivel de usuario está activo
if systemctl --user is-active --quiet minio; then
    echo "✅ El servicio de MinIO (usuario) está corriendo."
# Si no está activo, intentar iniciarlo
else
    echo "-> El servicio de MinIO (usuario) no está activo. Intentando iniciarlo..."
    systemctl --user start minio &> /dev/null
    
    # Esperar un segundo y volver a comprobar
    sleep 1
    if systemctl --user is-active --quiet minio; then
        echo "✅ Servicio MinIO (usuario) iniciado correctamente."
    else
        echo "❌ Error: No se pudo iniciar el servicio 'minio' a nivel de usuario."
        echo "   Para diagnosticar, ejecuta: systemctl --user status minio"
        exit 1
    fi
fi

echo ""
echo "🚀 ¡Todos los servicios están listos!"
