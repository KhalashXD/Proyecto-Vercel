# Database Schema – Emergency Management System

## Descripción general

La base de datos **emergency_management** almacena toda la información operativa del sistema de despacho de bomberos y gestión de emergencias. Está diseñada para MySQL/MariaDB (compatible con XAMPP) y utiliza el motor InnoDB con soporte de transacciones, claves foráneas y caracteres UTF8mb4.

### Tecnologías
- **Motor:** InnoDB
- **Charset:** utf8mb4 / utf8mb4_unicode_ci
- **Requerimientos:** MySQL 5.7+ o MariaDB 10.2+

---

## Modelo entidad-relación (resumen)

stations (1) ──────< vehicles (N)
emergency_types (1) ──< incidents (N)
incidents (1) ────< incident_vehicles (N) ────> vehicles (1)
incidents (1) ────< operational_forms (1)
incidents (1) ────< incident_events (N)
emergency_types (1) ──< dispatch_rules (N)


---

## Tablas

### 1. `stations` – Estaciones de bomberos

Almacena las estaciones base desde donde operan los vehículos.

| Campo        | Tipo              | Descripción                                   |
|--------------|-------------------|-----------------------------------------------|
| id           | INT AUTO_INCREMENT| Clave primaria                                |
| code         | VARCHAR(20)       | Código único de la estación (ej. 'S1')       |
| name         | VARCHAR(255)      | Nombre único de la estación                  |
| address      | TEXT              | Dirección física                              |
| latitude     | DECIMAL(10,8)     | Coordenada geográfica                         |
| longitude    | DECIMAL(11,8)     | Coordenada geográfica                         |
| phone        | VARCHAR(20)       | Teléfono de contacto                          |
| email        | VARCHAR(100)      | Correo electrónico                            |
| created_at   | TIMESTAMP         | Fecha de creación                             |
| updated_at   | TIMESTAMP         | Última actualización automática               |

**Índices:** `idx_code(code)`

---

### 2. `emergency_types` – Tipos de emergencia

Catálogo de tipos de incidentes con sus requerimientos operacionales.

| Campo               | Tipo               | Descripción                                        |
|---------------------|--------------------|----------------------------------------------------|
| id                  | INT AUTO_INCREMENT | Clave primaria                                     |
| code                | VARCHAR(20)        | Código único (INC, ACC, RES, ASI, FLS, MAT, etc.)  |
| name                | VARCHAR(255)       | Nombre del tipo                                    |
| description         | TEXT               | Descripción amplia                                 |
| required_units      | INT                | Número de unidades necesarias por defecto          |
| required_personnel  | INT                | Número de bomberos/personal requeridos             |
| morse_code          | VARCHAR(100)       | Código Morse asociado (para alertas)               |
| priority            | INT                | Prioridad (1 = más alta)                           |
| active              | BOOLEAN            | Si el tipo está habilitado                         |
| created_at          | TIMESTAMP          | Creación                                           |
| updated_at          | TIMESTAMP          | Actualización                                      |

**Índices:** `idx_code(code)`, `idx_priority(priority)`

---

### 3. `vehicles` – Vehículos / unidades operativas

Registro de cada vehículo, su estado y estación asignada.

| Campo                  | Tipo                         | Descripción                                                          |
|------------------------|------------------------------|----------------------------------------------------------------------|
| id                     | INT AUTO_INCREMENT           | Clave primaria                                                       |
| vehicle_code           | VARCHAR(50)                  | Código único del vehículo (ej. 'BR-01')                              |
| vehicle_type           | VARCHAR(100)                 | Tipo: Camión Bombero, Ambulancia, Escalera, Tanquero, etc.           |
| station_id             | INT NOT NULL                 | Estación a la que pertenece (FK a `stations.id`)                     |
| status                 | ENUM('green','yellow','red') | Estado operativo: green=disponible, yellow=transito, red=asignado    |
| driver_name            | VARCHAR(255)                 | Nombre del conductor asignado actualmente (opcional)                 |
| capacity               | INT                          | Capacidad de tripulación                                             |
| last_location_lat      | DECIMAL(10,8)                | Última latitud reportada (para seguimiento)                          |
| last_location_lng      | DECIMAL(11,8)                | Última longitud reportada                                            |
| last_location_updated  | TIMESTAMP NULL               | Momento de la última actualización de ubicación                      |
| created_at             | TIMESTAMP                    | Creación                                                             |
| updated_at             | TIMESTAMP                    | Actualización                                                        |

**Clave foránea:**  
`FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE RESTRICT`

**Índices:** `idx_station(station_id)`, `idx_status(status)`, `idx_code(vehicle_code)`

---

### 4. `dispatch_rules` – Reglas de despacho

Define qué tipo de vehículos y en qué cantidad se deben enviar para cada tipo de emergencia.

| Campo                    | Tipo               | Descripción                                                  |
|--------------------------|--------------------|--------------------------------------------------------------|
| id                       | INT AUTO_INCREMENT | Clave primaria                                               |
| emergency_type_id        | INT NOT NULL       | Tipo de emergencia (FK a `emergency_types.id`)               |
| priority_order           | INT NOT NULL       | Orden de prioridad dentro del despacho (1,2,3…)              |
| vehicle_type             | VARCHAR(100)       | Tipo de vehículo requerido (ej. 'Camión Bombero')            |
| morse_code               | VARCHAR(100)       | Código Morse específico para esta regla                      |
| telegram_message         | TEXT               | Mensaje predefinido para enviar a Telegram                   |
| required_count           | INT DEFAULT 1      | Cantidad de vehículos de este tipo que se envían             |
| additional_requirements  | JSON               | Requisitos adicionales (equipamiento, capacitación, etc.)    |
| created_at               | TIMESTAMP          | Creación                                                     |
| updated_at               | TIMESTAMP          | Actualización                                                |

**Clave foránea:**  
`FOREIGN KEY (emergency_type_id) REFERENCES emergency_types(id) ON DELETE CASCADE`

**Índices:** `idx_type(emergency_type_id)`, `idx_priority(priority_order)`

---

### 5. `incidents` – Incidentes / emergencias registradas

Registro principal de cada llamada o incidente.

| Campo                 | Tipo                                               | Descripción                                                       |
|-----------------------|----------------------------------------------------|-------------------------------------------------------------------|
| id                    | INT AUTO_INCREMENT                                 | Clave primaria                                                    |
| incident_code         | VARCHAR(50)                                        | Código único del incidente (formato legible, ej. 'INC-20250414-001') |
| emergency_type_id     | INT NOT NULL                                       | Tipo de emergencia (FK)                                           |
| street_1              | VARCHAR(255) NOT NULL                             | Primera calle o referencia                                         |
| street_2              | VARCHAR(255) NOT NULL                             | Segunda calle o referencia                                         |
| latitude              | DECIMAL(10,8) NOT NULL                            | Coordenada geográfica                                              |
| longitude             | DECIMAL(11,8) NOT NULL                            | Coordenada geográfica                                              |
| location_notes        | TEXT                                               | Notas adicionales de ubicación                                     |
| caller_name           | VARCHAR(255)                                       | Nombre del reportante                                              |
| caller_phone          | VARCHAR(20)                                        | Teléfono del reportante                                            |
| incident_description  | TEXT                                               | Descripción de la emergencia                                       |
| status                | ENUM('registered','pending','in_progress','resolved','closed') | Estado actual                     |
| priority              | INT DEFAULT 1                                      | Prioridad (calculada a partir del tipo + factores externos)        |
| created_at            | TIMESTAMP                                          | Momento del registro                                               |
| first_unit_arrival    | TIMESTAMP NULL                                     | Hora de llegada de la primera unidad                               |
| closed_at             | TIMESTAMP NULL                                     | Hora de cierre del incidente                                       |
| updated_at            | TIMESTAMP                                          | Última actualización                                               |

**Clave foránea:**  
`FOREIGN KEY (emergency_type_id) REFERENCES emergency_types(id)`

**Índices:** `idx_status(status)`, `idx_type(emergency_type_id)`, `idx_created(created_at)`, `idx_location(latitude, longitude)`, `idx_code(incident_code)`

---

### 6. `incident_vehicles` – Relación incidente-vehículo (asignaciones)

Tabla intermedia que asigna vehículos a incidentes, registrando tiempos clave.

| Campo          | Tipo               | Descripción                                       |
|----------------|--------------------|---------------------------------------------------|
| id             | INT AUTO_INCREMENT | Clave primaria                                    |
| incident_id    | INT NOT NULL       | Incidente (FK a `incidents.id`)                   |
| vehicle_id     | INT NOT NULL       | Vehículo (FK a `vehicles.id`)                     |
| assigned_at    | TIMESTAMP          | Momento de la asignación                          |
| arrived_at     | TIMESTAMP NULL     | Hora de llegada al lugar                          |
| departure_time | TIMESTAMP NULL     | Hora de salida del lugar (retirada)               |
| notes          | TEXT               | Notas específicas de esta asignación              |
| created_at     | TIMESTAMP          | Registro de creación                              |

**Claves foráneas:**  
- `FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE`  
- `FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)`  

**Restricción única:** `UNIQUE KEY unique_assignment (incident_id, vehicle_id)`  
**Índices:** `idx_incident(incident_id)`, `idx_vehicle(vehicle_id)`

---

### 7. `operational_forms` – Formularios operacionales

Almacena el formulario detallado que se completa durante o después de la emergencia.

| Campo                         | Tipo               | Descripción                                          |
|-------------------------------|--------------------|------------------------------------------------------|
| id                            | INT AUTO_INCREMENT | Clave primaria                                       |
| incident_id                   | INT NOT NULL UNIQUE| Incidente asociado (1:1)                             |
| personnel_on_scene            | INT                | Número de efectivos en el lugar                      |
| equipment_used                | JSON               | Equipos utilizados (lista de códigos/nombres)        |
| patient_info                  | JSON               | Información de pacientes (edad, condición, traslado) |
| actions_taken                 | TEXT               | Acciones realizadas                                  |
| outcome                       | VARCHAR(100)       | Resultado: "Controlado", "Derivado", "Falso"         |
| additional_units_requested    | BOOLEAN DEFAULT FALSE | Si se pidieron más unidades                        |
| ambulance_requested           | BOOLEAN DEFAULT FALSE | Si se solicitó ambulancia                           |
| institutional_support        | TEXT               | Apoyo de otras instituciones                        |
| form_completed               | BOOLEAN DEFAULT FALSE | Si el formulario está completo                     |
| completed_by                 | VARCHAR(255)       | Nombre de quien completó el formulario              |
| created_at                   | TIMESTAMP          | Creación                                             |
| updated_at                   | TIMESTAMP          | Última modificación                                 |

**Clave foránea:**  
`FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE`

**Índice:** `idx_incident(incident_id)`

---

### 8. `incident_events` – Registro de eventos / auditoría operacional

Bitácora cronológica de eventos relevantes para cada incidente.

| Campo         | Tipo                                                                       | Descripción                               |
|---------------|----------------------------------------------------------------------------|-------------------------------------------|
| id            | INT AUTO_INCREMENT                                                         | Clave primaria                            |
| incident_id   | INT NOT NULL                                                               | Incidente asociado                        |
| vehicle_id    | INT NULL                                                                   | Vehículo involucrado (opcional)           |
| event_type    | ENUM('created','vehicle_assigned','vehicle_arrived','vehicle_departed','status_changed','additional_units_requested','ambulance_requested','form_submitted','incident_closed') | Tipo de evento |
| description   | TEXT                                                                       | Detalles del evento                       |
| user_name     | VARCHAR(255)                                                               | Usuario que realizó la acción             |
| created_at    | TIMESTAMP                                                                  | Momento del evento                        |

**Claves foráneas:**  
- `FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE`  
- `FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL`

**Índices:** `idx_incident(incident_id)`, `idx_created(created_at)`, `idx_type(event_type)`

---

### 9. `incident_history` – Histórico de incidentes cerrados

Tabla de respaldo / archive para incidentes cerrados (optimización de consultas).

| Campo               | Tipo               | Descripción                                      |
|---------------------|--------------------|--------------------------------------------------|
| id                  | INT AUTO_INCREMENT | Clave primaria                                   |
| incident_id         | INT NOT NULL       | ID original del incidente                        |
| incident_code       | VARCHAR(50)        | Código del incidente                             |
| emergency_type      | VARCHAR(255)       | Nombre del tipo de emergencia (desnormalizado)   |
| location_streets    | VARCHAR(511)       | Calles concatenadas                              |
| status              | VARCHAR(50)        | Estado final                                     |
| total_response_time | TIME               | Tiempo total de respuesta (llegada primera unidad - registro) |
| vehicles_assigned   | INT                | Número de vehículos asignados                    |
| archived_data       | JSON               | Copia completa del incidente (opcional)          |
| archived_at         | TIMESTAMP          | Fecha de archivado                               |

**Índices:** `idx_code(incident_code)`, `idx_archived(archived_at)`

---

### 10. `audit_log` – Registro de cambios críticos en tablas maestras

Para trazabilidad de modificaciones en estaciones, tipos de emergencia, vehículos, reglas, etc.

| Campo        | Tipo               | Descripción                              |
|--------------|--------------------|------------------------------------------|
| id           | INT AUTO_INCREMENT | Clave primaria                           |
| entity_type  | VARCHAR(100)       | Nombre de la tabla modificada            |
| entity_id    | INT                | ID del registro afectado                 |
| action       | VARCHAR(50)        | 'INSERT', 'UPDATE', 'DELETE'             |
| old_values   | JSON               | Valores anteriores (antes del cambio)    |
| new_values   | JSON               | Valores nuevos (después del cambio)      |
| changed_by   | VARCHAR(255)       | Usuario que realizó el cambio            |
| created_at   | TIMESTAMP          | Momento del cambio                       |

**Índices:** `idx_entity(entity_type, entity_id)`, `idx_created(created_at)`

---

## Vistas predefinidas

### `active_incidents_view`
Muestra incidentes activos (registered, pending, in_progress) con información agregada: cantidad de vehículos asignados y sus códigos.

### `vehicle_availability_view`
Resumen de disponibilidad de vehículos por estación: totales, disponibles (green), en tránsito (yellow) y asignados (red).

### `incident_statistics_view`
Estadísticas por tipo de emergencia: total incidentes, cerrados, activos y tiempo promedio de respuesta en minutos.

---

## Índices adicionales de rendimiento

| Nombre del índice                  | Tabla             | Columnas                        |
|------------------------------------|-------------------|---------------------------------|
| `idx_incidents_status_created`     | incidents         | `(status, created_at DESC)`     |
| `idx_vehicles_station_status`      | vehicles          | `(station_id, status)`          |
| `idx_incident_events_timestamp`    | incident_events   | `(created_at DESC)`             |

---

## Relaciones y restricciones importantes

- Un **vehículo** siempre pertenece a una estación (`station_id NOT NULL`). No se puede eliminar una estación si tiene vehículos asignados (`ON DELETE RESTRICT`).
- Al eliminar un **tipo de emergencia**, se eliminan en cascada sus reglas de despacho (`ON DELETE CASCADE`), pero los incidentes históricos conservan el `emergency_type_id` (sin cascada).
- Un **incidente** al eliminarse borra en cascada sus asignaciones de vehículos, eventos y formulario operacional.
- El **evento** puede quedar con `vehicle_id NULL` si el vehículo es eliminado (`ON DELETE SET NULL`), preservando la traza.

---

## Script de creación completo

El archivo `schema.sql` contiene la definición completa, incluyendo datos iniciales de ejemplo. Se recomienda ejecutarlo en el siguiente orden:

1. Crear la base de datos: `CREATE DATABASE emergency_management;`
2. Usar la base: `USE emergency_management;`
3. Ejecutar todo el script (las tablas se crean en orden respetando dependencias).

```bash
mysql -u root -p < database/schema.sql