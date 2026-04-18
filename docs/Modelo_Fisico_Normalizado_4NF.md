# Modelo Físico Normalizado a 4ta Forma Normal (4NF)
## Sistema de Gestión de Emergencias y Despacho de Bomberos

---

## ANÁLISIS DE NORMALIZACIÓN

### Forma Normal 1 (1NF): Atomicidad
**Estado**: ✓ CUMPLE
- Todos los atributos son atómicos (no hay grupos repetitivos)
- Eliminación de atributos multivaluados directos

**Cambios realizados**:
- JSON fields para `equipment_used` y `patient_info` en OPERATIONAL_FORMS
- JSON para `additional_requirements` en DISPATCH_RULES
- Tabla separada `INCIDENT_VEHICLES` para relación N:M

---

### Forma Normal 2 (2NF): Dependencia Funcional Completa
**Estado**: ✓ CUMPLE
- Todas las tablas tienen clave primaria
- Todo atributo no clave depende completamente de la PK

**Cambios realizados**:
- Separación de `VEHICLES` del concepto de asignaciones
- `INCIDENT_VEHICLES` como tabla de unión explícita
- `OPERATIONAL_FORMS` con su propia identidad

---

### Forma Normal 3 (3NF): Eliminar Dependencias Transitivas
**Estado**: ✓ CUMPLE
- No hay dependencias transitivas entre atributos no clave
- Todo atributo no clave es únicamente dependiente de la PK

**Cambios realizados**:
- `VEHICLE_TYPES` tabla nueva para normalizar tipos de vehículos
- `INCIDENT_STATUS_TYPES` tabla nueva para valores permitidos
- Separación de responsabilidades entre tablas

---

### Forma Normal de Boyce-Codd (BCNF): Determinantes
**Estado**: ✓ CUMPLE
- Todo determinante es una clave candidata
- Eliminación de anomalías de actualización

**Cambios realizados**:
- Revisión de todas las dependencias funcionales
- Garantía de que solo las claves determinan otros atributos

---

### Forma Normal 4 (4NF): Independencia Multivaluada
**Estado**: ✓ CUMPLE
- Descomposición de dependencias multivaluadas independientes
- Tablas separadas para hechos independientes

**Cambios realizados**:
- `DISPATCH_RULE_NOTIFICATIONS` para separar notificaciones de reglas
- `DISPATCH_RULE_VEHICLE_TYPES` para separar tipos de vehículos en despacho
- `INCIDENT_ADDITIONAL_REQUIREMENTS` para requisitos independientes
- Eliminación de campos JSON complejos en posiciones donde hay dependencias multivaluadas

---

## ESQUEMA RELACIONAL NORMALIZADO A 4NF

```

┌─────────────────────────────────────────────────────────────────┐
│                          DIMENSIONALES                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│      STATIONS            │
├──────────────────────────┤
│ id (PK)                  │
│ code (UK)                │
│ name (UK)                │
│ address                  │
│ latitude                 │
│ longitude                │
│ phone                    │
│ email                    │
│ created_at               │
│ updated_at               │
└──────────────────────────┘
         1 |
           | (1:N)
           |
        N  |
           v
┌──────────────────────────┐
│     VEHICLES             │
├──────────────────────────┤
│ id (PK)                  │
│ vehicle_code (UK)        │
│ vehicle_type_id (FK)     │
│ station_id (FK)          │
│ status_id (FK)           │
│ driver_name              │
│ capacity                 │
│ last_location_lat        │
│ last_location_lng        │
│ last_location_updated    │
│ created_at               │
│ updated_at               │
└──────────────────────────┘

┌──────────────────────────┐
│    VEHICLE_TYPES         │
├──────────────────────────┤
│ id (PK)                  │
│ code (UK)                │
│ name (UK)                │
│ description              │
│ created_at               │
└──────────────────────────┘

┌──────────────────────────┐
│   VEHICLE_STATUS_TYPES   │
├──────────────────────────┤
│ id (PK)                  │
│ code (UK)                │
│ name (UK)                │
│ description              │
│ created_at               │
└──────────────────────────┘

┌──────────────────────────┐
│   EMERGENCY_TYPES        │
├──────────────────────────┤
│ id (PK)                  │
│ code (UK)                │
│ name (UK)                │
│ description              │
│ required_units           │
│ required_personnel       │
│ morse_code               │
│ priority                 │
│ active                   │
│ created_at               │
│ updated_at               │
└──────────────────────────┘

┌──────────────────────────┐
│ INCIDENT_STATUS_TYPES    │
├──────────────────────────┤
│ id (PK)                  │
│ code (UK)                │
│ name (UK)                │
│ description              │
│ created_at               │
└──────────────────────────┘

┌──────────────────────────┐
│   EVENT_TYPES            │
├──────────────────────────┤
│ id (PK)                  │
│ code (UK)                │
│ name (UK)                │
│ description              │
│ created_at               │
└──────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        HECHOS PRINCIPALES                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│     INCIDENTS            │
├──────────────────────────┤
│ id (PK)                  │
│ incident_code (UK)       │
│ emergency_type_id (FK)   │
│ street_1                 │
│ street_2                 │
│ latitude                 │
│ longitude                │
│ location_notes           │
│ caller_name              │
│ caller_phone             │
│ incident_description     │
│ status_id (FK)           │
│ priority                 │
│ created_at               │
│ first_unit_arrival       │
│ closed_at                │
│ updated_at               │
└──────────────────────────┘
         |
         | (1:N)
         |
┌────────▼────────────────┐
│ INCIDENT_VEHICLES        │
├──────────────────────────┤
│ id (PK)                  │
│ incident_id (FK)         │
│ vehicle_id (FK)          │
│ assigned_at              │
│ arrived_at               │
│ departure_time           │
│ notes                    │
│ created_at               │
│ UNIQUE(incident_id,      │
│        vehicle_id)       │
└──────────────────────────┘
         |
         | (1:N)
         |
┌────────▼──────────────────┐
│ INCIDENT_VEHICLES_EVENTS   │
├────────────────────────────┤
│ id (PK)                    │
│ incident_vehicle_id (FK)   │
│ event_type_id (FK)         │
│ timestamp                  │
│ description                │
│ user_name                  │
│ created_at                 │
└────────────────────────────┘

┌──────────────────────────┐
│  OPERATIONAL_FORMS       │
├──────────────────────────┤
│ id (PK)                  │
│ incident_id (FK) (UK)    │
│ personnel_on_scene       │
│ actions_taken            │
│ outcome                  │
│ additional_units_req     │
│ ambulance_requested      │
│ institutional_support    │
│ form_completed           │
│ completed_by             │
│ created_at               │
│ updated_at               │
└──────────────────────────┘
         |
         | (1:N)
         |
┌────────▼──────────────────┐
│  FORM_EQUIPMENT_USED       │
├────────────────────────────┤
│ id (PK)                    │
│ form_id (FK)               │
│ equipment_name             │
│ equipment_quantity         │
│ created_at                 │
└────────────────────────────┘

┌──────────────────────────┐
│   FORM_PATIENT_INFO      │
├──────────────────────────┤
│ id (PK)                  │
│ form_id (FK)             │
│ patient_name             │
│ patient_age              │
│ patient_condition        │
│ treatment_provided       │
│ created_at               │
└──────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      REGLAS Y AUTOMATIZACIÓN                    │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│   DISPATCH_RULES         │
├──────────────────────────┤
│ id (PK)                  │
│ emergency_type_id (FK)   │
│ priority_order           │
│ required_count           │
│ created_at               │
│ updated_at               │
└──────────────────────────┘
         |
         | (1:N)
         |
┌────────▼──────────────────────┐
│ DISPATCH_RULE_VEHICLE_TYPES    │
├────────────────────────────────┤
│ id (PK)                        │
│ dispatch_rule_id (FK)          │
│ vehicle_type_id (FK)           │
│ sequence_order                 │
│ created_at                     │
└────────────────────────────────┘

┌────────────────────────────┐
│ DISPATCH_RULE_NOTIFICATIONS │
├────────────────────────────┤
│ id (PK)                    │
│ dispatch_rule_id (FK)      │
│ morse_code                 │
│ telegram_message           │
│ notification_type          │
│ created_at                 │
└────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    AUDITORÍA E HISTORIAL                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│   INCIDENT_EVENTS        │
├──────────────────────────┤
│ id (PK)                  │
│ incident_id (FK)         │
│ event_type_id (FK)       │
│ description              │
│ user_name                │
│ created_at               │
└──────────────────────────┘

┌──────────────────────────┐
│  INCIDENT_HISTORY        │
├──────────────────────────┤
│ id (PK)                  │
│ incident_id              │
│ incident_code            │
│ emergency_type_id        │
│ location_streets         │
│ status_id                │
│ total_response_time      │
│ vehicles_assigned        │
│ archived_at              │
└──────────────────────────┘

┌──────────────────────────┐
│    AUDIT_LOG             │
├──────────────────────────┤
│ id (PK)                  │
│ entity_type              │
│ entity_id                │
│ action                   │
│ old_values (JSON)        │
│ new_values (JSON)        │
│ changed_by               │
│ created_at               │
└──────────────────────────┘

```

---

## DEFINICIÓN DETALLADA DE TABLAS NORMALIZADAS

### 1. STATIONS (Tabla Maestra)
```sql
CREATE TABLE stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE KEY,
    name VARCHAR(255) NOT NULL UNIQUE KEY,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Relaciones**: 1 → N con VEHICLES
**Justificación 4NF**: Tabla atómica, sin dependencias multivaluadas

---

### 2. VEHICLE_TYPES (Nueva - Normalización 3NF)
```sql
CREATE TABLE vehicle_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE KEY,
    name VARCHAR(100) NOT NULL UNIQUE KEY,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Justificación 4NF**: 
- Elimina dependencia transitiva: vehicle_type_id → vehicle_type_name
- Tipos de vehículos independientes del vehículo
- Permite reutilización de tipos en DISPATCH_RULE_VEHICLE_TYPES

---

### 3. VEHICLE_STATUS_TYPES (Nueva - Normalización 3NF)
```sql
CREATE TABLE vehicle_status_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO vehicle_status_types (code, name, description) VALUES
    ('GREEN', 'Disponible', 'Vehículo disponible en cuartel'),
    ('YELLOW', 'En Transición', 'Vehículo no disponible temporalmente'),
    ('RED', 'Asignado', 'Vehículo asignado a una emergencia');
```

**Justificación 4NF**: 
- Elimina valores hardcodeados
- Facilita auditoría de cambios de estado
- Independencia multivaluada

---

### 4. VEHICLES (Tabla Modificada)
```sql
CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_code VARCHAR(50) NOT NULL UNIQUE KEY,
    vehicle_type_id INT NOT NULL,
    station_id INT NOT NULL,
    status_id INT NOT NULL DEFAULT 1,
    driver_name VARCHAR(255),
    capacity INT,
    last_location_lat DECIMAL(10, 8),
    last_location_lng DECIMAL(11, 8),
    last_location_updated TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(id),
    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE RESTRICT,
    FOREIGN KEY (status_id) REFERENCES vehicle_status_types(id),
    INDEX idx_station (station_id),
    INDEX idx_status (status_id),
    INDEX idx_code (vehicle_code),
    INDEX idx_type (vehicle_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Cambios Normalizados**:
- vehicle_type → vehicle_type_id (eliminación de dependencia transitiva)
- status (ENUM) → status_id (eliminación de dependencia transitiva)

---

### 5. EMERGENCY_TYPES (Tabla Maestra)
```sql
CREATE TABLE emergency_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE KEY,
    name VARCHAR(255) NOT NULL UNIQUE KEY,
    description TEXT,
    required_units INT DEFAULT 1,
    required_personnel INT DEFAULT 4,
    morse_code VARCHAR(100),
    priority INT DEFAULT 1,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_priority (priority),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Justificación 4NF**: 
- Tabla atómica de referencia
- Morse_code es atributo inherente del tipo, no dependencia multivaluada

---

### 6. INCIDENT_STATUS_TYPES (Nueva - Normalización 3NF)
```sql
CREATE TABLE incident_status_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO incident_status_types (code, name, description) VALUES
    ('REGISTERED', 'Registrado', 'Incidente registrado en el sistema'),
    ('PENDING', 'Pendiente', 'Pendiente de despacho'),
    ('IN_PROGRESS', 'En Progreso', 'En curso'),
    ('RESOLVED', 'Resuelto', 'Resuelto'),
    ('CLOSED', 'Cerrado', 'Cerrado');
```

---

### 7. INCIDENTS (Tabla Principal Modificada)
```sql
CREATE TABLE incidents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_code VARCHAR(50) NOT NULL UNIQUE KEY,
    emergency_type_id INT NOT NULL,
    street_1 VARCHAR(255) NOT NULL,
    street_2 VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location_notes TEXT,
    caller_name VARCHAR(255),
    caller_phone VARCHAR(20),
    incident_description TEXT,
    status_id INT NOT NULL DEFAULT 1,
    priority INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    first_unit_arrival TIMESTAMP NULL,
    closed_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (emergency_type_id) REFERENCES emergency_types(id),
    FOREIGN KEY (status_id) REFERENCES incident_status_types(id),
    INDEX idx_status (status_id),
    INDEX idx_type (emergency_type_id),
    INDEX idx_created (created_at),
    INDEX idx_location (latitude, longitude),
    INDEX idx_code (incident_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Cambios Normalizados**:
- status (ENUM) → status_id (eliminación de dependencia transitiva)

---

### 8. INCIDENT_VEHICLES (Tabla de Unión N:M)
```sql
CREATE TABLE incident_vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    arrived_at TIMESTAMP NULL,
    departure_time TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_assignment (incident_id, vehicle_id),
    INDEX idx_incident (incident_id),
    INDEX idx_vehicle (vehicle_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Justificación 4NF**: 
- Tabla de unión explícita para relación N:M
- Cada registro representa una asignación atómica
- Sin dependencias multivaluadas

---

### 9. INCIDENT_VEHICLES_EVENTS (Nueva - Normalización 4NF)
```sql
CREATE TABLE incident_vehicles_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_vehicle_id INT NOT NULL,
    event_type_id INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    user_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_vehicle_id) REFERENCES incident_vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (event_type_id) REFERENCES event_types(id),
    INDEX idx_incident_vehicle (incident_vehicle_id),
    INDEX idx_event_type (event_type_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Justificación 4NF**: 
- Eventos de vehículos asignados separados
- Registro granular de auditoría
- Independencia multivaluada de eventos

---

### 10. EVENT_TYPES (Nueva - Normalización 4NF)
```sql
CREATE TABLE event_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO event_types (code, name, description) VALUES
    ('CREATED', 'Creado', 'Incidente creado'),
    ('VEHICLE_ASSIGNED', 'Vehículo Asignado', 'Vehículo asignado'),
    ('VEHICLE_ARRIVED', 'Vehículo Llegó', 'Vehículo llegó al lugar'),
    ('VEHICLE_DEPARTED', 'Vehículo Partió', 'Vehículo se fue del lugar'),
    ('STATUS_CHANGED', 'Estado Cambió', 'Estado del incidente cambió'),
    ('ADDITIONAL_UNITS_REQUESTED', 'Unidades Adicionales', 'Se solicitaron unidades adicionales'),
    ('AMBULANCE_REQUESTED', 'Ambulancia Solicitada', 'Se solicitó ambulancia'),
    ('FORM_SUBMITTED', 'Formulario Enviado', 'Formulario operacional enviado'),
    ('INCIDENT_CLOSED', 'Incidente Cerrado', 'Incidente fue cerrado');
```

---

### 11. OPERATIONAL_FORMS (Tabla Modificada)
```sql
CREATE TABLE operational_forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id INT NOT NULL UNIQUE KEY,
    personnel_on_scene INT,
    actions_taken TEXT,
    outcome VARCHAR(100),
    additional_units_requested BOOLEAN DEFAULT FALSE,
    ambulance_requested BOOLEAN DEFAULT FALSE,
    institutional_support TEXT,
    form_completed BOOLEAN DEFAULT FALSE,
    completed_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    INDEX idx_incident (incident_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Cambios Normalizados**:
- equipment_used (JSON) → separado en FORM_EQUIPMENT_USED (normalización 4NF)
- patient_info (JSON) → separado en FORM_PATIENT_INFO (normalización 4NF)

---

### 12. FORM_EQUIPMENT_USED (Nueva - Normalización 4NF)
```sql
CREATE TABLE form_equipment_used (
    id INT AUTO_INCREMENT PRIMARY KEY,
    form_id INT NOT NULL,
    equipment_name VARCHAR(255) NOT NULL,
    equipment_quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES operational_forms(id) ON DELETE CASCADE,
    INDEX idx_form (form_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Justificación 4NF**: 
- Eliminación de dependencias multivaluadas en equipment_used
- Cada equipo es un hecho independiente
- Facilita consultas y agregaciones

---

### 13. FORM_PATIENT_INFO (Nueva - Normalización 4NF)
```sql
CREATE TABLE form_patient_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    form_id INT NOT NULL,
    patient_name VARCHAR(255),
    patient_age INT,
    patient_condition VARCHAR(255),
    treatment_provided TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES operational_forms(id) ON DELETE CASCADE,
    INDEX idx_form (form_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Justificación 4NF**: 
- Eliminación de dependencias multivaluadas en patient_info
- Información de paciente como hechos independientes
- Permite múltiples pacientes por incidente

---

### 14. DISPATCH_RULES (Tabla Modificada)
```sql
CREATE TABLE dispatch_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emergency_type_id INT NOT NULL,
    priority_order INT NOT NULL,
    required_count INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (emergency_type_id) REFERENCES emergency_types(id) ON DELETE CASCADE,
    INDEX idx_type (emergency_type_id),
    INDEX idx_priority (priority_order),
    UNIQUE KEY unique_rule (emergency_type_id, priority_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Cambios Normalizados**:
- vehicle_type (string) → separado en DISPATCH_RULE_VEHICLE_TYPES
- morse_code → separado en DISPATCH_RULE_NOTIFICATIONS
- telegram_message → separado en DISPATCH_RULE_NOTIFICATIONS
- additional_requirements (JSON) → pueden ir en DISPATCH_RULE_ADDITIONAL_REQUIREMENTS si es necesario

---

### 15. DISPATCH_RULE_VEHICLE_TYPES (Nueva - Normalización 4NF)
```sql
CREATE TABLE dispatch_rule_vehicle_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dispatch_rule_id INT NOT NULL,
    vehicle_type_id INT NOT NULL,
    sequence_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dispatch_rule_id) REFERENCES dispatch_rules(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(id),
    INDEX idx_rule (dispatch_rule_id),
    INDEX idx_vehicle_type (vehicle_type_id),
    UNIQUE KEY unique_vehicle_in_rule (dispatch_rule_id, vehicle_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Justificación 4NF**: 
- Tipos de vehículos en despacho como hechos independientes
- Eliminación de dependencia multivaluada
- Permite ordenamiento de preferencia

---

### 16. DISPATCH_RULE_NOTIFICATIONS (Nueva - Normalización 4NF)
```sql
CREATE TABLE dispatch_rule_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dispatch_rule_id INT NOT NULL,
    morse_code VARCHAR(100),
    telegram_message TEXT,
    notification_type ENUM('MORSE', 'TELEGRAM', 'BOTH') DEFAULT 'BOTH',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dispatch_rule_id) REFERENCES dispatch_rules(id) ON DELETE CASCADE,
    INDEX idx_rule (dispatch_rule_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Justificación 4NF**: 
- Notificaciones como hechos independientes de la regla
- Facilita múltiples canales de notificación
- Separación de responsabilidades

---

### 17. INCIDENT_EVENTS (Tabla Modificada)
```sql
CREATE TABLE incident_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id INT NOT NULL,
    event_type_id INT NOT NULL,
    description TEXT,
    user_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    FOREIGN KEY (event_type_id) REFERENCES event_types(id),
    INDEX idx_incident (incident_id),
    INDEX idx_created (created_at),
    INDEX idx_type (event_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Cambios Normalizados**:
- event_type (ENUM) → event_type_id (eliminación de dependencia transitiva)

---

### 18. INCIDENT_HISTORY (Tabla Modificada)
```sql
CREATE TABLE incident_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id INT NOT NULL,
    incident_code VARCHAR(50) NOT NULL,
    emergency_type_id INT,
    location_streets VARCHAR(511),
    status_id INT,
    total_response_time TIME,
    vehicles_assigned INT,
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emergency_type_id) REFERENCES emergency_types(id),
    FOREIGN KEY (status_id) REFERENCES incident_status_types(id),
    INDEX idx_code (incident_code),
    INDEX idx_archived (archived_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Cambios Normalizados**:
- archived_data (JSON) → descompuesto en campos específicos
- Eliminación de datos redundantes

---

### 19. AUDIT_LOG (Tabla sin cambios)
```sql
CREATE TABLE audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_values JSON,
    new_values JSON,
    changed_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Justificación 4NF**: 
- JSON fields apropiados para datos complejos de auditoría
- No hay dependencias multivaluadas estructurales
- Tabla atómica de auditoría

---

## RESUMEN DE CAMBIOS POR FORMA NORMAL

### 1NF → 2NF
- ✓ Todas las tablas tienen clave primaria

### 2NF → 3NF
- ✓ Creación de VEHICLE_TYPES
- ✓ Creación de VEHICLE_STATUS_TYPES
- ✓ Creación de INCIDENT_STATUS_TYPES
- ✓ Creación de EVENT_TYPES
- ✓ Normalización de status a referencias

### 3NF → BCNF
- ✓ Revisión de determinantes
- ✓ Garantía de que solo claves primarias determinan atributos

### BCNF → 4NF
- ✓ Creación de DISPATCH_RULE_VEHICLE_TYPES
- ✓ Creación de DISPATCH_RULE_NOTIFICATIONS
- ✓ Creación de FORM_EQUIPMENT_USED
- ✓ Creación de FORM_PATIENT_INFO
- ✓ Creación de INCIDENT_VEHICLES_EVENTS
- ✓ Separación de dependencias multivaluadas independientes

---

## TOTAL DE TABLAS NORMALIZADAS A 4NF

**Original**: 10 tablas
**Normalizado**: 19 tablas

1. stations
2. vehicle_types *(nueva)*
3. vehicle_status_types *(nueva)*
4. vehicles (modificada)
5. emergency_types
6. incident_status_types *(nueva)*
7. incidents (modificada)
8. incident_vehicles
9. incident_vehicles_events *(nueva)*
10. event_types *(nueva)*
11. operational_forms (modificada)
12. form_equipment_used *(nueva)*
13. form_patient_info *(nueva)*
14. dispatch_rules (modificada)
15. dispatch_rule_vehicle_types *(nueva)*
16. dispatch_rule_notifications *(nueva)*
17. incident_events (modificada)
18. incident_history (modificada)
19. audit_log

