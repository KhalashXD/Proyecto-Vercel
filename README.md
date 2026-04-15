# Emergency Management and Unit Dispatch System

## Table of Contents
1. [About the Project](#about-the-project)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [Release Workflow](#release-workflow)
7. [Testing](#testing)
8. [Roadmap](#roadmap)
9. [Development Rules](#development-rules)
10. [License](#license)
11. [Contact](#contact)

## About the Project

The **Emergency Management and Unit Dispatch System** is a web platform designed to support the operational workflow of fire departments during emergency response. Its purpose is to centralize emergency registration, dispatch planning, active incident monitoring, operational form completion, and historical traceability in a single system.

The current project status includes a **functional but limited frontend prototype**. At this stage, the interface already represents the intended workflow, but the application still lacks a backend, database, persistent business logic, real-time synchronization, automated dispatch execution, and operational history storage.

### Current Frontend Capabilities

The current frontend prototype includes:

- A central Google Maps view
- Four fixed station markers representing fire stations
- Emergency registration through street intersection input
- Visual placement of the emergency on the map with a marker
- Emergency type selection from predefined categories
- A side panel showing fire units and their possible status buttons
- Navigation across the main platform views

### Operational Vision

The final system is expected to support the complete emergency lifecycle:

- Register an incoming emergency call
- Determine its location from street intersections
- Classify the emergency according to predefined operational rules
- Calculate the required vehicles and personnel
- Dispatch available units
- Generate operational notifications
- Track all active incidents
- Fill in incident-related operational forms
- Request additional support during an active event
- Close incidents and preserve full historical records
- Export forms and reports in Excel and PDF formats

### General Objective

Develop a comprehensive platform for emergency call management, vehicle dispatch, operational tracking, and incident traceability, enabling a more efficient, centralized, and scalable emergency response workflow.
---

## Prerequisites

Before running the project, make sure the following tools are installed:

- Node.js 20.x or later
- Bun
- Docker
- Docker Compose
- Git
- PostgreSQL
- A Google Maps API key
- A Telegram Bot token and target group or channel configuration

### Recommended Development Environment

- Visual Studio Code
- Postman or Insomnia
- DBeaver or pgAdmin
---
## Installation

Clone the repository:

```bash
git clone https://github.com/your-org/emergency-dispatch-system.git
cd emergency-dispatch-system
cd frontend
bun install
cd ..
cd backend
npm install
cd ..
docker compose up --build
cd backend
npm run dev
cd ..
cd frontend
bun run dev
```

---


### Configuration

```md
## Configuration

Create environment files for both frontend and backend.

### Frontend Environment

Create a file named `frontend/.env`:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000

PORT=3000
NODE_ENV=development

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/emergency_dispatch

TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_group_or_channel_id

GOOGLE_MAPS_API_KEY=your_google_maps_api_key

CORS_ORIGIN=http://localhost:5173

cd backend
npm run migrate

npm run seed


---

### Usage

```md
## Usage

Once the application is running, the intended workflow is:

### 1. Open the main dashboard
The initial page displays:

- A central map
- Four fire station markers
- A side panel with vehicles and their states
- Navigation to active incidents and history

### 2. Register a new emergency
The operator enters:

- Street A
- Street B
- Emergency type
- Optional notes or observations

The system should then:

- Resolve and display the emergency location on the map
- Associate the event with a structured emergency category
- Load the operational rules linked to that category

### 3. Review suggested dispatch
Based on the configured rules, the system should determine:

- Required number of units
- Required vehicle types
- Estimated required personnel
- Available and unavailable units

### 4. Dispatch available units
The operator confirms dispatch and the system should:

- Mark units as assigned
- Create an active incident
- Update the current status of selected vehicles
- Trigger notifications and dispatch events

### 5. Manage the active incident
Inside an active incident, the user should be able to complete operational forms such as:

- Arrival confirmation
- Additional units request
- Ambulance request
- Institutional or governmental support request
- Incident update logs
- Incident closure

### 6. Review incident history
After closure, incidents should remain available in the history view with:

- Timeline of changes
- Vehicles assigned
- Forms submitted
- Final incident status
- Exportable documents

## Release Workflow

The project should follow a simple and controlled release process.

### Branching Strategy

- `main`: stable production-ready branch
- `develop`: integration branch for ongoing work
- `feature/*`: new features
- `fix/*`: bug fixes
- `hotfix/*`: urgent production fixes
- `release/*`: release preparation branches

### Suggested Workflow

1. Create a feature branch from `develop`
2. Implement the feature with clear commits
3. Open a pull request to `develop`
4. Run tests and code review
5. Merge approved changes into `develop`
6. Create a `release/*` branch when preparing a version
7. Validate deployment artifacts and documentation
8. Merge the release into `main`
9. Tag the release using semantic versioning

### Versioning Convention

Use semantic versioning:

- `MAJOR`: breaking changes
- `MINOR`: new backward-compatible features
- `PATCH`: backward-compatible fixes

Examples:

- `v1.0.0`
- `v1.1.0`
- `v1.1.1`

## Testing

Testing should cover both business logic and platform behavior.

### Backend Testing

Recommended tools:

- Jest
- Supertest

Suggested coverage:

- Emergency registration logic
- Dispatch rule evaluation
- Vehicle state transitions
- Incident creation and closure
- Form submission validation
- Export service generation
- Telegram notification service behavior

Example:

```bash
cd backend
npm run test


---

### Roadmap

```md
## Roadmap

The project is planned around four major epics.

### Epic 1. Frontend Redesign and Integration Preparation
Refactor and improve the current frontend so it becomes visually clearer, more maintainable, and ready for backend integration.

**Goals:**
- Improve layout and usability
- Standardize components and navigation
- Add proper validation and form feedback
- Prepare API integration layer
- Improve active incident and history views

### Epic 2. Emergency Registration and Dispatch Logic
Implement the core business rules for emergency registration, categorization, and resource calculation.

**Goals:**
- Create emergency type catalog
- Define dispatch rules by emergency type
- Calculate required units and personnel
- Validate unit availability before dispatch
- Support dispatch confirmation logic

### Epic 3. Vehicle Management and Active Incident Operations
Develop the logic for vehicle state control and ongoing incident management.

**Goals:**
- Persist vehicle state transitions
- Manage active incidents in real time
- Record operational forms during incidents
- Request additional support resources
- Close incidents with full traceability

### Epic 4. Persistence, Integrations, and Reporting
Build the backend platform, database, external integrations, and export capabilities required for full production readiness.

**Goals:**
- Implement backend API
- Design and connect the database
- Add authentication and role management if needed
- Integrate Telegram notifications
- Generate Excel and PDF outputs
- Store historical records and logs

## Development Rules

To keep the project consistent and maintainable, the following rules should be followed.

### General Rules

- Use English for code, branch names, commits, and documentation
- Keep business rules centralized in backend services
- Avoid duplicating business logic in the frontend
- Write meaningful commit messages
- Document architectural decisions in `/docs`
- Prefer small, reviewable pull requests

### Code Style

- Use ESLint and Prettier
- Follow consistent naming conventions
- Use typed contracts when possible
- Keep components and services focused on a single responsibility
- Avoid large files with mixed concerns

### Frontend Rules

- Separate UI components from data-fetching logic
- Use reusable form components
- Keep route structure simple and explicit
- Represent operational states consistently across the UI
- Design with clarity and speed of use in mind, since the platform is operationally critical

### Backend Rules

- Organize by modules or domains
- Keep controllers thin
- Place validation close to request boundaries
- Place business rules in service layers
- Use explicit DTOs, schemas, or validators
- Log critical state transitions and dispatch actions

### Database Rules

- Use migrations for every schema change
- Never manually alter production schema without migration history
- Seed only controlled baseline data
- Preserve auditability for critical operational records

### Definition of Done

A task is considered complete only if:

- The code is implemented
- The code is reviewed
- Relevant tests pass
- Documentation is updated
- No critical linting or formatting issues remain
- The feature is deployable within the current environment

## License

This project is currently under academic and internal development.

Until an official license is defined, **all rights are reserved**.

If this repository will be made public, it is recommended to replace this section with one of the following:

- MIT License
- Apache License 2.0
- GNU GPLv3

Example placeholder:

```text
Copyright (c) 2026
All rights reserved.


---

### Contact

```md
## Contact

**Project Team**

- Vania Medic
- Jaime Gardilcic
- Fernando Reyes

For project coordination, technical discussions, or repository management, add the corresponding institutional or project email addresses in this section.

Example:

```text
Email: your-team@email.com
