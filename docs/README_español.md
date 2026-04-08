# Sistema de Gestión de Emergencias y Despacho de Unidades

## Descripción

Este proyecto consiste en el desarrollo de una aplicación web orientada a la gestión de emergencias y despacho de unidades de bomberos. El sistema permite registrar llamados, visualizar su ubicación en un mapa, clasificar el tipo de emergencia, asignar carros según reglas predefinidas y realizar seguimiento operativo del incidente.

Actualmente, el sistema cuenta con un frontend funcional (pero básico) que permite simular parte del flujo operativo. Sin embargo, aún no dispone de backend, base de datos ni lógica persistente para la gestión de estados, historial, formularios operativos y despacho automatizado. Por ello, el proyecto se enfoca en la mejora del frontend existente y en la construcción de la arquitectura completa del sistema.

---

## Objetivo general

Desarrollar una plataforma web integral para la gestión de llamados de emergencia, despacho de unidades y seguimiento operativo de incidentes, permitiendo centralizar la información, automatizar procesos críticos y mejorar la trazabilidad de la operación.

---

## Estado actual del proyecto

Actualmente se dispone de un frontend funcional con las siguientes características:

- Visualización de un mapa central basado en Google Maps
- Representación de cuatro cuarteles mediante pines fijos
- Registro inicial de llamados mediante intersección de calles
- Ubicación visual de la emergencia mediante un pin en el mapa
- Selección del tipo de llamado a partir de categorías predefinidas
- Visualización lateral de carros con botones asociados a sus estados
- Navegación entre vistas principales del sistema

## Limitaciones actuales

El sistema todavía no cuenta con:

- Backend
- Base de datos
- Persistencia de llamados
- Persistencia del historial
- Gestión real de estados de carros
- Gestión real de llamados activos
- Formularios operativos asociados a incidentes
- Generación de código Morse
- Integración con Telegram
- Exportación de formularios a Excel o PDF
- Reglas de despacho automatizadas conectadas a datos reales

## Funcionalidades objetivo

### 1. Registro y gestión de emergencias
- Ingreso de un llamado mediante dos calles o intersecciones
- Ubicación automática de la emergencia en el mapa
- Selección del tipo de emergencia desde un catálogo predefinido
- Aplicación de reglas operativas según tipo de llamado
- Visualización y actualización del estado del incidente

### 2. Gestión de carros y disponibilidad
- Visualización de carros por cuartel
- Estados operativos de los carros:
  - Verde: disponible en cuartel
  - Amarillo: no disponible temporalmente o en transición
  - Rojo: asignado a una emergencia
- Asignación de carros según reglas del tipo de llamado
- Restricción de despacho de carros no disponibles

### 3. Seguimiento de llamados activos
- Listado de llamados en curso
- Acceso al detalle de cada llamado activo
- Formularios operativos asociados al incidente
- Registro de eventos relevantes:
  - hora de llegada
  - solicitud de más carros
  - necesidad de ambulancia
  - solicitud de apoyo institucional
  - cierre del llamado

### 4. Historial y trazabilidad
- Registro histórico de todos los llamados realizados
- Consulta de incidentes anteriores
- Persistencia de formularios y cambios de estado
- Exportación de información a formatos Excel y PDF

### 5. Automatización operativa
- Cálculo automático de carros requeridos según tipo de llamado
- Determinación de personal requerido
- Generación de despacho preliminar
- Generación de código Morse según reglas operativas
- Envío automático de notificaciones a grupo de Telegram mediante API

---

## Alcance

El sistema permitirá:

- Registrar emergencias indicando ubicación, tipo y observaciones
- Gestionar el estado de las emergencias (pendiente, en proceso, en ruta, finalizado)
- Registrar y administrar carros (estado, disponibilidad)
- Asignar carros a emergencias
- Visualizar información operativa en un panel centralizado
- Actualizar estados en tiempo real

---

## Tecnologías

- Frontend: React + Vite + Bun
- Backend: Node.js (Express o Fastify)
- Base de datos: PostgreSQL o MongoDB
- Tiempo real: WebSockets (Socket.io)
- Contenedores: Docker y Docker Compose

---

## Arquitectura tecnológica propuesta

### Frontend
- React
- Bun
- Vite

### Backend
- Python
- Flask

### Base de datos
- PostgreSQL

### Contenedorización
- Docker
- Docker Compose

### Integraciones
- Google Maps API
- Telegram Bot API

## Módulos principales del sistema

- Módulo de visualización geográfica
- Módulo de registro de llamados
- Módulo de clasificación de emergencias
- Módulo de reglas de despacho
- Módulo de gestión de carros
- Módulo de llamados activos
- Módulo de historial
- Módulo de formularios operativos
- Módulo de exportación documental
- Módulo de notificaciones externas

## Estructura referencial del proyecto
root/
├─ frontend/
│  ├─ src/
│  ├─ public/
│  └─ package.json
├─ backend/
│  ├─ src/
│  ├─ routes/
│  ├─ controllers/
│  ├─ services/
│  └─ models/
├─ database/
│  ├─ schema/
│  ├─ seeds/
│  └─ migrations/
├─ docker/
│  ├─ frontend/
│  ├─ backend/
│  └─ database/
├─ docs/
│  └─ epicas.md
├─ docker-compose.yml
└─ README.md
---

# Plan de Desarrollo
El proyecto se desarrollará bajo metodología Scrum en 15 sprints, con las siguientes épicas principales:

## Épica 1. Mejora e integración del frontend
Refactorización del frontend actual para mejorar interfaz, validaciones, navegación y preparación para integración con servicios backend.

## Épica 2. Gestión de emergencias y reglas de despacho
Desarrollo de la lógica funcional para registrar llamados, clasificar tipos de emergencia y determinar recursos requeridos.

## Épica 3. Gestión operativa de carros y llamados activos
Administración de estados de carros, asignación de unidades, seguimiento de incidentes activos y registro de formularios operativos.

## Épica 4. Plataforma tecnológica, persistencia e integraciones
Construcción del backend, base de datos, historial, exportaciones y servicios externos necesarios para soportar la operación completa.
---