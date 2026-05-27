# Sistema de Gestion de Emergencias y Despacho de Unidades

## Descripcion

Este proyecto consiste en una aplicacion web para apoyar la gestion de emergencias y el despacho de unidades de bomberos. El sistema permite registrar llamados, despachar carros, consultar emergencias activas, revisar historial, ver datos climaticos, enviar notificaciones por Telegram y exportar reportes en PDF y Excel.

El proyecto ya cuenta con frontend, backend, base de datos e integraciones principales. Por lo tanto, no corresponde describirlo como un prototipo solo de frontend.

## Estado actual del proyecto

Actualmente el sistema incluye:

- Frontend en React con TypeScript.
- Backend en Python con FastAPI.
- Base de datos MariaDB mediante Docker.
- Modelos y servicios backend con SQLAlchemy.
- Pantalla de despacho.
- Pantalla de emergencias activas.
- Pantalla de historial.
- Detalle de emergencia con acciones operativas.
- Datos climaticos visibles en el frontend.
- API para enviar mensajes a Telegram.
- Exportacion de reportes en PDF y Excel.

## Objetivo general

Desarrollar una plataforma web integral para la gestion de llamados de emergencia, despacho de unidades y seguimiento operativo de incidentes, permitiendo centralizar la informacion, automatizar procesos criticos y mejorar la trazabilidad de la operacion.

## Tecnologias

### Frontend

- React
- TypeScript
- Create React App / React Scripts
- React Router
- Axios
- Bootstrap
- Leaflet / React Leaflet

### Backend

- Python 3.11
- FastAPI
- SQLAlchemy
- PyMySQL
- Pydantic
- Uvicorn
- OpenPyXL para exportacion Excel
- ReportLab para exportacion PDF

### Base de datos e infraestructura

- MariaDB 11
- Docker
- Docker Compose
- Redis como servicio opcional de infraestructura

### Integraciones

- Telegram Bot API
- Open-Meteo para datos climaticos
- Google Maps en utilidades/configuracion del proyecto

## Estructura del proyecto

```text
PrograProf/
  back/                 Backend FastAPI
    app.py
    models.py
    services/
    schemas/
    utils/
    requirements.txt
    Esquema.sql

  front/                Frontend React + TypeScript
    src/
    public/
    package.json
    tsconfig.json

  docs/                 Documentacion
    README_EJECUCION.md
    README_español.md

  docker-compose.yml
  README.md
```

## Funcionalidades principales

### 1. Registro y despacho de emergencias

- Registro de llamados desde el frontend.
- Clasificacion por clave/tipo de emergencia.
- Asignacion de carros desde reglas y datos disponibles.
- Creacion de incidente en backend.

### 2. Gestion de emergencias activas

- Listado de incidentes en curso.
- Acceso al detalle de cada emergencia.
- Visualizacion de unidades asignadas.
- Cronologia de eventos del incidente.
- Cierre de incidente.

### 3. Historial y trazabilidad

- Consulta de emergencias cerradas.
- Revision de datos del incidente.
- Acceso a reportes descargables.

### 4. Exportacion documental

El sistema expone reportes en:

- PDF
- Excel

Endpoints principales:

```text
GET /reportes/emergencias.pdf
GET /reportes/emergencias.xlsx
GET /reportes/emergencias/{codigo}.pdf
GET /reportes/emergencias/{codigo}.xlsx
```

### 5. Datos climaticos

El backend entrega datos climaticos mediante:

```text
GET /api/fire-risk
```

El frontend muestra estos datos en la barra de navegacion.

### 6. Telegram

El backend permite enviar mensajes a Telegram mediante:

```text
GET /telegram/status
POST /telegram/send
```

Ademas, al crear un despacho, el backend intenta enviar una notificacion automaticamente si existen las variables:

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

## Configuracion rapida

Crear un archivo `.env` en la raiz del proyecto:

```env
BACKEND_PORT=5000
FRONTEND_PORT=3000
REACT_APP_API_URL=http://localhost:5000

TELEGRAM_BOT_TOKEN=tu_token_de_bot
TELEGRAM_CHAT_ID=tu_chat_id

SECRET_KEY=change-me
JWT_SECRET=change-me-too
LOG_LEVEL=INFO
```

Luego ejecutar:

```powershell
docker compose up --build
```

Servicios esperados:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Documentacion FastAPI: `http://localhost:5000/docs`
- MariaDB: `localhost:3306`

## Verificacion

Build del frontend:

```powershell
cd front
npm install
npm run build
```

Validacion rapida del backend:

```powershell
python -m py_compile back/app.py back/services/weather_service.py back/services/telegram_service.py back/services/report_service.py
```

Pruebas con backend levantado:

```powershell
Invoke-RestMethod http://localhost:5000/db-test
Invoke-RestMethod http://localhost:5000/api/fire-risk
Invoke-RestMethod http://localhost:5000/telegram/status
```

## Documentacion relacionada

- `docs/README_EJECUCION.md`: guia detallada para correr el proyecto y configurar APIs.
- `docs/Requerimientos_BD.md`: requerimientos y notas de base de datos.
- `docs/epicas.md`: epicas del proyecto.

## Plan de desarrollo

El proyecto se organiza en cuatro areas principales:

1. Mejora e integracion del frontend.
2. Gestion de emergencias y reglas de despacho.
3. Gestion operativa de carros y llamados activos.
4. Persistencia, integraciones, reportes y servicios externos.
