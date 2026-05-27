# Guia de ejecucion del proyecto

Este documento explica como levantar el sistema, configurar las APIs necesarias, probar el frontend, el backend, Telegram, clima y la exportacion de reportes.

## Requisitos

- Docker Desktop instalado y ejecutandose.
- Node.js instalado si quieres correr el frontend fuera de Docker.
- Python 3.11 instalado si quieres correr el backend fuera de Docker.
- Git Bash, PowerShell o una terminal similar.

## Stack del proyecto

- Frontend: React con TypeScript.
- Backend: Python con FastAPI.
- Base de datos: MariaDB.
- Contenedores: Docker y Docker Compose.
- Reportes: PDF y Excel desde el backend.
- Integraciones: Telegram Bot API y Open-Meteo para clima.

## Estructura principal

```text
PrograProf/
  back/        Backend FastAPI
  front/       Frontend React
  docs/        Documentacion
  docker-compose.yml
```

## Variables de entorno

Crea un archivo `.env` en la raiz del proyecto, al mismo nivel que `docker-compose.yml`.

Ejemplo:

```env
BACKEND_PORT=5000
FRONTEND_PORT=3000

DATABASE_URL=mysql+pymysql://emergencyuser:emergencypass@database:3306/emergency_management

REACT_APP_API_URL=http://localhost:5000

TELEGRAM_BOT_TOKEN=tu_token_de_bot
TELEGRAM_CHAT_ID=tu_chat_id

SECRET_KEY=change-me
JWT_SECRET=change-me-too
LOG_LEVEL=INFO
```

Notas:

- `REACT_APP_API_URL` es la URL que usa el frontend para llamar al backend.
- Si corres con Docker, normalmente debe quedar como `http://localhost:5000`.
- El clima usa Open-Meteo y no requiere API key.
- Google Maps aparece en la configuracion del proyecto, pero los endpoints nuevos de clima/reportes/Telegram no dependen de esa key.

## Como configurar Telegram

1. En Telegram, abre una conversacion con `@BotFather`.
2. Ejecuta `/newbot`.
3. Sigue las instrucciones y copia el token del bot.
4. Coloca el token en `.env`:

```env
TELEGRAM_BOT_TOKEN=123456:ABCDEF...
```

5. Para obtener el `TELEGRAM_CHAT_ID`, envia un mensaje al bot.
6. Abre esta URL en el navegador, reemplazando el token:

```text
https://api.telegram.org/botTU_TOKEN/getUpdates
```

7. Busca el valor `chat.id` en la respuesta.
8. Colocalo en `.env`:

```env
TELEGRAM_CHAT_ID=123456789
```

Si usas un grupo:

- Agrega el bot al grupo.
- Envia un mensaje en el grupo.
- Vuelve a consultar `getUpdates`.
- El `chat.id` de grupos normalmente es un numero negativo.

## Levantar todo con Docker

Desde la raiz del proyecto:

```powershell
docker compose up --build
```

Servicios esperados:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Documentacion API FastAPI: `http://localhost:5000/docs`
- MariaDB: puerto `3306`

Para detener:

```powershell
docker compose down
```

Para detener y borrar volumenes de base de datos:

```powershell
docker compose down -v
```

Usa `-v` solo si quieres reiniciar la base de datos desde cero.

## Probar backend

Prueba conexion a base de datos:

```powershell
Invoke-RestMethod http://localhost:5000/db-test
```

Prueba clima:

```powershell
Invoke-RestMethod http://localhost:5000/api/fire-risk
```

Prueba estado de Telegram:

```powershell
Invoke-RestMethod http://localhost:5000/telegram/status
```

Enviar mensaje de prueba a Telegram:

```powershell
Invoke-RestMethod -Method Post http://localhost:5000/telegram/send `
  -ContentType "application/json" `
  -Body '{"message":"Prueba Phoenix S.O.S"}'
```

## Probar frontend

Abre:

```text
http://localhost:3000
```

En el navbar deberias ver datos climaticos:

- Condicion
- Temperatura
- Humedad
- Viento
- Lluvia
- IPO

Si aparece "Cargando datos climaticos..." por mucho tiempo, revisa:

- Que el backend este arriba en `http://localhost:5000`.
- Que `REACT_APP_API_URL=http://localhost:5000`.
- Que el endpoint `http://localhost:5000/api/fire-risk` responda.

## Exportar reportes

Desde el frontend:

- Entra a `Historial`.
- Usa los botones `Descargar PDF` y `Descargar Excel`.
- Entra al detalle de una emergencia.
- Usa los botones `Descargar PDF` y `Descargar Excel` del incidente.

Tambien puedes probar directamente:

```text
http://localhost:5000/reportes/emergencias.pdf
http://localhost:5000/reportes/emergencias.xlsx
```

Para una emergencia especifica:

```text
http://localhost:5000/reportes/emergencias/CODIGO_INCIDENTE.pdf
http://localhost:5000/reportes/emergencias/CODIGO_INCIDENTE.xlsx
```

Reemplaza `CODIGO_INCIDENTE` por un codigo real, por ejemplo el que aparece en emergencias activas o historial.

## Envio automatico a Telegram

Cuando se crea un despacho desde el endpoint `/despacho`, el backend intenta enviar el mensaje a Telegram si estas variables existen:

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

Si no estan configuradas, el despacho sigue funcionando, pero no se envia mensaje.

## Correr frontend sin Docker

Desde `front/`:

```powershell
npm install
npm start
```

Para generar build de produccion:

```powershell
npm run build
```

El build debe terminar con:

```text
Compiled successfully.
```

## Correr backend sin Docker

Desde `back/`, instala dependencias:

```powershell
pip install -r requirements.txt
```

Define la variable de base de datos. Ejemplo para Docker con MariaDB levantado:

```powershell
$env:DATABASE_URL="mysql+pymysql://emergencyuser:emergencypass@localhost:3306/emergency_management"
```

Opcionalmente define Telegram:

```powershell
$env:TELEGRAM_BOT_TOKEN="tu_token"
$env:TELEGRAM_CHAT_ID="tu_chat_id"
```

Levanta FastAPI:

```powershell
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Si lo corres asi, el backend queda en:

```text
http://localhost:8000
```

En ese caso, cambia el frontend a:

```env
REACT_APP_API_URL=http://localhost:8000
```

## Problemas comunes

### El frontend no conecta al backend

Revisa `REACT_APP_API_URL`.

Con Docker normalmente:

```env
REACT_APP_API_URL=http://localhost:5000
```

### Telegram no envia mensajes

Revisa:

- Que `TELEGRAM_BOT_TOKEN` sea correcto.
- Que `TELEGRAM_CHAT_ID` sea correcto.
- Que el bot haya recibido al menos un mensaje.
- Si es grupo, que el bot este dentro del grupo.

Prueba:

```powershell
Invoke-RestMethod http://localhost:5000/telegram/status
```

### Los reportes no descargan

Revisa que el backend este activo:

```powershell
Invoke-RestMethod http://localhost:5000/db-test
```

Y prueba directo:

```text
http://localhost:5000/reportes/emergencias.pdf
```

### El clima no aparece

Prueba:

```powershell
Invoke-RestMethod http://localhost:5000/api/fire-risk
```

Si responde con `condition: "No disponible"`, el backend no pudo consultar Open-Meteo en ese momento.

## Checklist rapido

1. Crear `.env` en la raiz.
2. Configurar `REACT_APP_API_URL`.
3. Configurar `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` si se usara Telegram.
4. Ejecutar `docker compose up --build`.
5. Abrir `http://localhost:3000`.
6. Probar clima en el navbar.
7. Crear o revisar emergencias.
8. Descargar PDF/Excel desde Historial o desde una emergencia.
9. Probar envio de Telegram con `/telegram/send`.
