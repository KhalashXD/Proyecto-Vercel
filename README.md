# Emergency Management and Unit Dispatch System

## Table of Contents

1. [About the Project](#about-the-project)
2. [Current Status](#current-status)
3. [Technology Stack](#technology-stack)
4. [Repository Structure](#repository-structure)
5. [Quick Start](#quick-start)
6. [Configuration](#configuration)
7. [Main Features](#main-features)
8. [Testing and Verification](#testing-and-verification)
9. [Documentation](#documentation)
10. [License](#license)
11. [Contact](#contact)

## About the Project

The **Emergency Management and Unit Dispatch System** is a web platform designed to support the operational workflow of fire departments during emergency response.

It centralizes emergency registration, unit dispatch, active incident monitoring, incident history, weather visibility, Telegram notifications, and report exports in PDF and Excel formats.

## Current Status

The project currently includes:

- A React frontend written in TypeScript.
- A FastAPI backend written in Python.
- A MariaDB database initialized through Docker.
- Active emergency and history views.
- Dispatch endpoints connected to backend services.
- Weather data exposed to the frontend.
- Telegram notification API support.
- PDF and Excel report exports.

Some operational flows are still evolving, but the repository now has a real backend and database integration. It is no longer only a frontend prototype.

## Technology Stack

### Frontend

- React
- TypeScript
- Create React App / React Scripts
- Axios
- React Router
- Bootstrap
- Leaflet / React Leaflet

### Backend

- Python 3.11
- FastAPI
- SQLAlchemy
- PyMySQL
- Pydantic
- Uvicorn
- OpenPyXL for Excel exports
- ReportLab for PDF exports

### Database and Infrastructure

- MariaDB 11
- Docker
- Docker Compose
- Redis, included as an optional infrastructure service

### Integrations

- Telegram Bot API
- Open-Meteo weather API
- Google Maps support is present in configuration and helper utilities

## Repository Structure

```text
PrograProf/
  back/                 FastAPI backend
    app.py
    models.py
    services/
    schemas/
    utils/
    requirements.txt
    Esquema.sql

  front/                React + TypeScript frontend
    src/
    public/
    package.json
    tsconfig.json

  docs/                 Project documentation
    README_EJECUCION.md
    README_español.md

  docker-compose.yml
  README.md
```

## Quick Start

Create a `.env` file in the repository root:

```env
BACKEND_PORT=5000
FRONTEND_PORT=3000
REACT_APP_API_URL=http://localhost:5000

TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

SECRET_KEY=change-me
JWT_SECRET=change-me-too
LOG_LEVEL=INFO
```

Then run:

```bash
docker compose up --build
```

Expected local URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- FastAPI docs: `http://localhost:5000/docs`
- MariaDB: `localhost:3306`

## Configuration

### Frontend

The frontend uses Create React App environment variables. The API URL must use the `REACT_APP_` prefix:

```env
REACT_APP_API_URL=http://localhost:5000
```

### Backend

The backend needs a database URL. Docker Compose provides this automatically:

```env
DATABASE_URL=mysql+pymysql://emergencyuser:emergencypass@database:3306/emergency_management
```

### Telegram

Set these variables in the root `.env` file:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_group_or_channel_id
```

If these variables are missing, the system still works, but Telegram messages are not sent.

### Weather

Weather data is provided through Open-Meteo and does not require an API key.

## Main Features

- Emergency dispatch registration.
- Active incident listing.
- Incident detail and operational action forms.
- Incident closure and history.
- Unit and personnel data endpoints.
- Weather panel in the frontend navigation bar.
- Telegram message endpoint and optional automatic dispatch notification.
- PDF and Excel exports for incident reports and history.

## Testing and Verification

Frontend production build:

```bash
cd front
npm install
npm run build
```

Backend syntax check:

```bash
python -m py_compile back/app.py back/services/weather_service.py back/services/telegram_service.py back/services/report_service.py
```

Basic backend checks after Docker is running:

```bash
curl http://localhost:5000/db-test
curl http://localhost:5000/api/fire-risk
curl http://localhost:5000/telegram/status
```

Report endpoints:

```text
http://localhost:5000/reportes/emergencias.pdf
http://localhost:5000/reportes/emergencias.xlsx
```

## Documentation

Additional documentation is available in:

- `docs/README_EJECUCION.md`: Spanish setup and execution guide.
- `docs/README_español.md`: Spanish project overview.
- `docs/Requerimientos_BD.md`: Database and requirements notes.
- `docs/epicas.md`: Project epics.

## License

This project is currently under academic and internal development.

Until an official license is defined, all rights are reserved.

## Contact

Project team:

- Vania Medic
- Jaime Gardilcic
- Fernando Reyes
