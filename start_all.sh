#!/bin/bash

echo "Iniciando backend..."
(cd backend && npm start) &
BACKEND_PID=$!

echo "Iniciando frontend..."
(cd frontend && npm start) &
FRONTEND_PID=$!

echo "Backend y frontend iniciados en segundo plano."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

# Esperar a que ambos procesos terminen (opcional, si quieres que el script no finalice)
# wait $BACKEND_PID
# wait $FRONTEND_PID
