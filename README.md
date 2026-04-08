# Emergency Management and Unit Dispatch System

## Description

This project consists of the development of a web application focused on emergency management and fire unit dispatch. The system allows registering incoming calls, visualizing their location on a map, classifying the type of emergency, assigning vehicles based on predefined rules, and tracking the operational status of each incident.

Currently, the system includes a functional (but basic) frontend that simulates part of the operational workflow. However, it does not yet have a backend, database, or persistent logic for managing states, history, operational forms, and automated dispatch. Therefore, the project focuses on improving the existing frontend and building the complete system architecture.

---

## General Objective

Develop a comprehensive web platform for emergency call management, unit dispatch, and operational incident tracking, allowing centralized information, automation of critical processes, and improved operational traceability.

---

## Current Project Status

The system currently includes a functional frontend with the following features:

- Central map visualization based on Google Maps  
- Representation of four stations using fixed pins  
- Initial call registration using street intersections  
- Visual location of the emergency using a map pin  
- Emergency type selection from predefined categories  
- Side panel visualization of vehicles with state buttons  
- Navigation between main system views  

---

## Current Limitations

The system does not yet include:

- Backend  
- Database  
- Call persistence  
- History persistence  
- Real vehicle state management  
- Real active call management  
- Operational forms associated with incidents  
- Morse code generation  
- Telegram integration  
- Export of forms to Excel or PDF  
- Automated dispatch rules connected to real data  

---

## Target Functionalities

### 1. Emergency Registration and Management

- Register a call using two streets or intersections  
- Automatic emergency location on the map  
- Select emergency type from predefined catalog  
- Apply operational rules based on emergency type  
- Visualize and update incident status  

### 2. Vehicle and Availability Management

- Vehicle visualization by station  
- Operational vehicle states:
  - Green: available at station  
  - Yellow: temporarily unavailable or transitioning  
  - Red: assigned to an emergency  
- Vehicle assignment based on emergency rules  
- Dispatch restriction for unavailable vehicles  

### 3. Active Incident Tracking

- List of active incidents  
- Access to active incident details  
- Operational forms associated with incidents  
- Event logging:
  - arrival time  
  - request for additional units  
  - ambulance request  
  - institutional support request  
  - incident closure  

### 4. History and Traceability

- Historical record of all calls  
- Previous incident lookup  
- Persistence of forms and state changes  
- Export to Excel and PDF formats  

### 5. Operational Automation

- Automatic calculation of required units by emergency type  
- Required personnel estimation  
- Preliminary dispatch generation  
- Morse code generation based on operational rules  
- Automatic notifications to Telegram group via API  

---

## Scope

The system will allow:

- Register emergencies with location, type, and notes  
- Manage emergency states (pending, in progress, en route, completed)  
- Register and manage vehicles (status, availability)  
- Assign vehicles to emergencies  
- Visualize operational information in a centralized panel  
- Update states in real time  

---

## Technologies

- Frontend: React + Vite + Bun  
- Backend: Node.js (Express or Fastify)  
- Database: PostgreSQL or MongoDB  
- Real-time: WebSockets (Socket.io)  
- Containers: Docker and Docker Compose  

---

## Proposed Technology Architecture

### Frontend
- React  
- Bun  
- Vite  

### Backend
- Python  
- Flask  

### Database
- PostgreSQL  

### Containerization
- Docker  
- Docker Compose  

### Integrations
- Google Maps API  
- Telegram Bot API  

---

## Main System Modules

- Geographic visualization module  
- Call registration module  
- Emergency classification module  
- Dispatch rules module  
- Vehicle management module  
- Active incidents module  
- History module  
- Operational forms module  
- Document export module  
- External notifications module  

---

## Project Structure
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
# Development Plan

The project will be developed using Scrum methodology in 15 sprints, with the following main epics:

## Epic 1. Frontend Improvement and Integration

Refactor the current frontend to improve UI, validations, navigation, and preparation for backend service integration.

## Epic 2. Emergency Management and Dispatch Rules

Develop functional logic to register calls, classify emergency types, and determine required resources.

## Epic 3. Operational Vehicle Management and Active Incidents

Manage vehicle states, assign units, track active incidents, and record operational forms.

## Epic 4. Technology Platform, Persistence, and Integrations

Build backend, database, history, exports, and external services required to support full system operation.

---
# Contact
Vania Medic
Jaime Gardilcic
Fernando Reyes