# MER (Modelo Entidad-Relación)
## Sistema de Gestión de Emergencias y Despacho de Bomberos
### Modelo Conceptual - Sin Normalización

---

## DIAGRAMA ENTIDAD-RELACIÓN EN MERMAID

```mermaid
erDiagram
    STATIONS ||--o{ VEHICLES : contains
    STATIONS ||--o{ DISPATCH_RULES : manages
    
    EMERGENCY_TYPES ||--o{ DISPATCH_RULES : defines
    EMERGENCY_TYPES ||--o{ INCIDENTS : triggers
    
    INCIDENTS ||--o{ INCIDENT_VEHICLES : contains
    INCIDENTS ||--o{ OPERATIONAL_FORMS : requires
    INCIDENTS ||--o{ INCIDENT_EVENTS : generates
    INCIDENTS ||--o{ INCIDENT_HISTORY : archives
    
    VEHICLES ||--o{ INCIDENT_VEHICLES : assigned_to
    VEHICLES ||--o{ INCIDENT_EVENTS : participates
    
    STATIONS {
        int id PK
        string code UK
        string name UK
        text address
        decimal latitude
        decimal longitude
        string phone
        string email
        timestamp created_at
        timestamp updated_at
    }
    
    EMERGENCY_TYPES {
        int id PK
        string code UK
        string name
        text description
        int required_units
        int required_personnel
        string morse_code
        int priority
        boolean active
        timestamp created_at
        timestamp updated_at
    }
    
    VEHICLES {
        int id PK
        string vehicle_code UK
        string vehicle_type
        int station_id FK
        enum status
        string driver_name
        int capacity
        decimal last_location_lat
        decimal last_location_lng
        timestamp last_location_updated
        timestamp created_at
        timestamp updated_at
    }
    
    DISPATCH_RULES {
        int id PK
        int emergency_type_id FK
        int priority_order
        string vehicle_type
        string morse_code
        text telegram_message
        int required_count
        json additional_requirements
        timestamp created_at
        timestamp updated_at
    }
    
    INCIDENTS {
        int id PK
        string incident_code UK
        int emergency_type_id FK
        string street_1
        string street_2
        decimal latitude
        decimal longitude
        text location_notes
        string caller_name
        string caller_phone
        text incident_description
        enum status
        int priority
        timestamp created_at
        timestamp first_unit_arrival
        timestamp closed_at
        timestamp updated_at
    }
    
    INCIDENT_VEHICLES {
        int id PK
        int incident_id FK
        int vehicle_id FK
        timestamp assigned_at
        timestamp arrived_at
        timestamp departure_time
        text notes
        timestamp created_at
    }
    
    OPERATIONAL_FORMS {
        int id PK
        int incident_id FK UK
        int personnel_on_scene
        json equipment_used
        json patient_info
        text actions_taken
        string outcome
        boolean additional_units_requested
        boolean ambulance_requested
        text institutional_support
        boolean form_completed
        string completed_by
        timestamp created_at
        timestamp updated_at
    }
    
    INCIDENT_EVENTS {
        int id PK
        int incident_id FK
        int vehicle_id FK
        enum event_type
        text description
        string user_name
        timestamp created_at
    }
    
    INCIDENT_HISTORY {
        int id PK
        int incident_id
        string incident_code
        string emergency_type
        string location_streets
        string status
        time total_response_time
        int vehicles_assigned
        json archived_data
        timestamp archived_at
    }
    
    AUDIT_LOG {
        int id PK
        string entity_type
        int entity_id
        string action
        json old_values
        json new_values
        string changed_by
        timestamp created_at
    }
```

---

## DESCRIPCIÓN DE ENTIDADES

### 1. STATIONS (Estaciones de Bomberos)
**Descripción**: Almacena información de todas las estaciones de bomberos del sistema.

**Atributos**:
- `id`: Identificador único (PK)
- `code`: Código de estación, único (UK)
- `name`: Nombre de estación, único (UK)
- `address`: Dirección completa
- `latitude`: Coordenada de latitud
- `longitude`: Coordenada de longitud
- `phone`: Teléfono de contacto
- `email`: Email de contacto
- `created_at`: Timestamp de creación
- `updated_at`: Timestamp de actualización

**Relaciones**:
- 1:N con VEHICLES (Una estación tiene muchos vehículos)
- 1:N con DISPATCH_RULES (Una estación puede tener reglas de despacho)

**Restricciones**:
- Code y name deben ser únicos
- Coordenadas válidas (WGS84)

---

### 2. EMERGENCY_TYPES (Tipos de Emergencia)
**Descripción**: Catálogo predefinido de tipos de emergencias y sus parámetros operativos.

**Atributos**:
- `id`: Identificador único (PK)
- `code`: Código de tipo, único (UK)
- `name`: Nombre del tipo de emergencia
- `description`: Descripción detallada
- `required_units`: Unidades mínimas requeridas
- `required_personnel`: Personal mínimo requerido
- `morse_code`: Código Morse para comunicaciones
- `priority`: Nivel de prioridad (1-4)
- `active`: Estado activo/inactivo
- `created_at`: Timestamp de creación
- `updated_at`: Timestamp de actualización

**Relaciones**:
- 1:N con INCIDENTS (Un tipo de emergencia puede generar muchos incidentes)
- 1:N con DISPATCH_RULES (Un tipo tiene múltiples reglas de despacho)

**Ejemplos**:
- INC: Incendio
- ACC: Accidente
- RES: Rescate
- ASI: Asistencia Médica
- FLS: Falsa Alarma
- MAT: Materiales Peligrosos

---

### 3. VEHICLES (Vehículos/Unidades)
**Descripción**: Registra todos los vehículos operativos disponibles en las estaciones.

**Atributos**:
- `id`: Identificador único (PK)
- `vehicle_code`: Código de vehículo, único (UK)
- `vehicle_type`: Tipo de vehículo (Camión, Ambulancia, Escalera, Tanquero)
- `station_id`: Referencia a estación (FK)
- `status`: Estado actual (GREEN, YELLOW, RED)
- `driver_name`: Nombre del conductor
- `capacity`: Capacidad de personal
- `last_location_lat`: Última latitud conocida
- `last_location_lng`: Última longitud conocida
- `last_location_updated`: Timestamp de última ubicación
- `created_at`: Timestamp de creación
- `updated_at`: Timestamp de actualización

**Relaciones**:
- N:1 con STATIONS (Muchos vehículos en una estación)
- N:M con INCIDENTS (A través de INCIDENT_VEHICLES)
- 1:N con INCIDENT_EVENTS (Un vehículo genera eventos)

**Estados**:
- **GREEN**: Disponible en cuartel
- **YELLOW**: No disponible temporalmente o en transición
- **RED**: Asignado a una emergencia

---

### 4. INCIDENTS (Incidentes/Emergencias Registradas)
**Descripción**: Registra todas las llamadas de emergencia recibidas.

**Atributos**:
- `id`: Identificador único (PK)
- `incident_code`: Código de incidente, único (UK)
- `emergency_type_id`: Referencia al tipo de emergencia (FK)
- `street_1`: Primera calle de intersección
- `street_2`: Segunda calle de intersección
- `latitude`: Coordenada de latitud del incidente
- `longitude`: Coordenada de longitud del incidente
- `location_notes`: Notas adicionales sobre la ubicación
- `caller_name`: Nombre de quien llama
- `caller_phone`: Teléfono del llamante
- `incident_description`: Descripción narrativa del incidente
- `status`: Estado actual del incidente
- `priority`: Nivel de prioridad asignado
- `created_at`: Timestamp de registro
- `first_unit_arrival`: Timestamp de llegada de primera unidad
- `closed_at`: Timestamp de cierre
- `updated_at`: Timestamp de actualización

**Relaciones**:
- N:1 con EMERGENCY_TYPES (Muchos incidentes de un tipo)
- 1:N con INCIDENT_VEHICLES (Un incidente tiene múltiples vehículos asignados)
- 1:1 con OPERATIONAL_FORMS (Un incidente tiene un formulario)
- 1:N con INCIDENT_EVENTS (Un incidente genera múltiples eventos)
- 1:N con INCIDENT_HISTORY (Un incidente es archivado cuando cierra)

**Estados**:
- **REGISTERED**: Incidente registrado
- **PENDING**: Pendiente de despacho
- **IN_PROGRESS**: En curso
- **RESOLVED**: Resuelto
- **CLOSED**: Cerrado

---

### 5. DISPATCH_RULES (Reglas de Despacho)
**Descripción**: Define reglas automáticas para desplegar vehículos según tipo de emergencia.

**Atributos**:
- `id`: Identificador único (PK)
- `emergency_type_id`: Referencia al tipo de emergencia (FK)
- `priority_order`: Orden de prioridad de despacho
- `vehicle_type`: Tipo de vehículo a desplegar
- `morse_code`: Código Morse de notificación
- `telegram_message`: Mensaje para notificar por Telegram
- `required_count`: Cantidad requerida de este tipo
- `additional_requirements`: Requisitos adicionales en JSON
- `created_at`: Timestamp de creación
- `updated_at`: Timestamp de actualización

**Relaciones**:
- N:1 con EMERGENCY_TYPES (Múltiples reglas por tipo de emergencia)

**Restricciones**:
- Una regla por combinación de tipo y prioridad
- Cantidad requerida > 0

---

### 6. INCIDENT_VEHICLES (Tabla de Unión - Vehículos Asignados)
**Descripción**: Representa la relación N:M entre incidentes y vehículos asignados.

**Atributos**:
- `id`: Identificador único (PK)
- `incident_id`: Referencia al incidente (FK)
- `vehicle_id`: Referencia al vehículo (FK)
- `assigned_at`: Timestamp de asignación
- `arrived_at`: Timestamp de llegada (nullable)
- `departure_time`: Timestamp de partida (nullable)
- `notes`: Notas sobre la asignación
- `created_at`: Timestamp de registro

**Relaciones**:
- N:1 con INCIDENTS (Muchos vehículos por incidente)
- N:1 con VEHICLES (Un vehículo en múltiples incidentes)

**Restricciones**:
- Combinación (incident_id, vehicle_id) es única
- No se puede asignar vehículo con estado ≠ GREEN

---

### 7. OPERATIONAL_FORMS (Formularios Operacionales)
**Descripción**: Captura información operacional detallada de cada incidente.

**Atributos**:
- `id`: Identificador único (PK)
- `incident_id`: Referencia al incidente, única (FK/UK)
- `personnel_on_scene`: Cantidad de personal en escena
- `equipment_used`: Equipos utilizados en JSON
- `patient_info`: Información de pacientes en JSON
- `actions_taken`: Descripción narrativa de acciones realizadas
- `outcome`: Resultado del incidente
- `additional_units_requested`: Si se pidieron unidades adicionales
- `ambulance_requested`: Si se pidió ambulancia
- `institutional_support`: Apoyo institucional requerido
- `form_completed`: Estado de completitud del formulario
- `completed_by`: Nombre de persona que completó
- `created_at`: Timestamp de creación
- `updated_at`: Timestamp de actualización

**Relaciones**:
- 1:1 con INCIDENTS (Un formulario por incidente)

**Restricciones**:
- Un formulario único por incidente
- Formulario solo se puede crear si incidente existe

---

### 8. INCIDENT_EVENTS (Eventos/Auditoría de Incidentes)
**Descripción**: Registro detallado de todos los eventos que ocurren durante un incidente.

**Atributos**:
- `id`: Identificador único (PK)
- `incident_id`: Referencia al incidente (FK)
- `vehicle_id`: Referencia al vehículo involucrado, nullable (FK)
- `event_type`: Tipo de evento
- `description`: Descripción del evento
- `user_name`: Usuario que genera el evento
- `created_at`: Timestamp del evento

**Relaciones**:
- N:1 con INCIDENTS (Un incidente genera muchos eventos)
- N:1 con VEHICLES (Un vehículo genera múltiples eventos, nullable)

**Tipos de Eventos**:
- CREATED: Incidente creado
- VEHICLE_ASSIGNED: Vehículo asignado
- VEHICLE_ARRIVED: Vehículo llegó
- VEHICLE_DEPARTED: Vehículo partió
- STATUS_CHANGED: Estado cambió
- ADDITIONAL_UNITS_REQUESTED: Se pidieron unidades adicionales
- AMBULANCE_REQUESTED: Se pidió ambulancia
- FORM_SUBMITTED: Formulario enviado
- INCIDENT_CLOSED: Incidente cerrado

---

### 9. INCIDENT_HISTORY (Historial de Incidentes Cerrados)
**Descripción**: Archivo optimizado de incidentes cerrados para histórico y reportes.

**Atributos**:
- `id`: Identificador único (PK)
- `incident_id`: ID original del incidente
- `incident_code`: Código del incidente
- `emergency_type`: Tipo de emergencia
- `location_streets`: Ubicación (calles)
- `status`: Estado final del incidente
- `total_response_time`: Tiempo total de respuesta
- `vehicles_assigned`: Cantidad de vehículos asignados
- `archived_data`: Datos adicionales en JSON
- `archived_at`: Timestamp de archivado

**Relaciones**:
- Referencia a INCIDENTS (histórica, sin FK)

---

### 10. AUDIT_LOG (Registro de Auditoría General)
**Descripción**: Registra todos los cambios en entidades críticas del sistema.

**Atributos**:
- `id`: Identificador único (PK)
- `entity_type`: Tipo de entidad modificada
- `entity_id`: ID de la entidad
- `action`: Acción realizada (INSERT, UPDATE, DELETE)
- `old_values`: Valores anteriores en JSON
- `new_values`: Valores nuevos en JSON
- `changed_by`: Usuario responsable
- `created_at`: Timestamp del cambio

**Relaciones**:
- Sin relaciones directas (tabla de auditoría general)

**Restricciones**:
- Registros son inmutables

---

## RESUMEN DE RELACIONES

### Relaciones 1:N (Uno a Muchos)
| Entidad Origen | Entidad Destino | Descripción |
|---|---|---|
| STATIONS | VEHICLES | Una estación contiene muchos vehículos |
| EMERGENCY_TYPES | INCIDENTS | Un tipo genera muchos incidentes |
| EMERGENCY_TYPES | DISPATCH_RULES | Un tipo tiene múltiples reglas |
| INCIDENTS | INCIDENT_VEHICLES | Un incidente asigna múltiples vehículos |
| INCIDENTS | OPERATIONAL_FORMS | Un incidente genera un formulario |
| INCIDENTS | INCIDENT_EVENTS | Un incidente genera múltiples eventos |
| INCIDENTS | INCIDENT_HISTORY | Un incidente es archivado |
| VEHICLES | INCIDENT_EVENTS | Un vehículo genera eventos |

### Relaciones N:M (Muchos a Muchos)
| Entidad 1 | Tabla Unión | Entidad 2 | Descripción |
|---|---|---|---|
| INCIDENTS | INCIDENT_VEHICLES | VEHICLES | Un incidente asigna múltiples vehículos; un vehículo participa en múltiples incidentes |

### Relaciones 1:1 (Uno a Uno)
| Entidad 1 | Entidad 2 | Descripción |
|---|---|---|
| INCIDENTS | OPERATIONAL_FORMS | Un incidente tiene un único formulario operacional |

---

## CARDINALIDADES DETALLADAS

```
STATIONS (1) ──────────<> (N) VEHICLES
    Cardinalidad: 1:N
    Restricción: ON DELETE RESTRICT
    Justificación: Un vehículo debe pertenecer a una estación

EMERGENCY_TYPES (1) ──────────<> (N) INCIDENTS
    Cardinalidad: 1:N
    Restricción: ON DELETE RESTRICT
    Justificación: Un incidente debe tener un tipo definido

EMERGENCY_TYPES (1) ──────────<> (N) DISPATCH_RULES
    Cardinalidad: 1:N
    Restricción: ON DELETE CASCADE
    Justificación: Las reglas dependen del tipo

INCIDENTS (1) ──────────<> (N) INCIDENT_VEHICLES
    Cardinalidad: 1:N
    Restricción: ON DELETE CASCADE
    Justificación: Las asignaciones dependen del incidente

VEHICLES (1) ──────────<> (N) INCIDENT_VEHICLES
    Cardinalidad: 1:N
    Restricción: ON DELETE RESTRICT
    Justificación: Las asignaciones referencian vehículos

INCIDENTS (1) ──────────<> (1) OPERATIONAL_FORMS
    Cardinalidad: 1:1
    Restricción: ON DELETE CASCADE
    Justificación: El formulario depende del incidente

INCIDENTS (1) ──────────<> (N) INCIDENT_EVENTS
    Cardinalidad: 1:N
    Restricción: ON DELETE CASCADE
    Justificación: Los eventos dependen del incidente

VEHICLES (1) ──────────<> (N) INCIDENT_EVENTS
    Cardinalidad: 1:N
    Restricción: ON DELETE SET NULL
    Justificación: Los eventos pueden existir sin vehículo
```

---

## DOMINIOS Y VALORES PERMITIDOS

### Estado de Vehículos (VEHICLES.status)
- GREEN: Disponible en cuartel
- YELLOW: No disponible o en transición
- RED: Asignado a emergencia

### Estado de Incidentes (INCIDENTS.status)
- REGISTERED: Registrado
- PENDING: Pendiente de despacho
- IN_PROGRESS: En progreso
- RESOLVED: Resuelto
- CLOSED: Cerrado

### Prioridad (EMERGENCY_TYPES.priority, INCIDENTS.priority)
- 1: Máxima prioridad (Incendios, Rescates, Mat. Peligrosos)
- 2: Alta prioridad (Accidentes)
- 3: Media prioridad (Asistencia Médica)
- 4: Baja prioridad (Falsas Alarmas)

### Tipos de Eventos (INCIDENT_EVENTS.event_type)
- CREATED
- VEHICLE_ASSIGNED
- VEHICLE_ARRIVED
- VEHICLE_DEPARTED
- STATUS_CHANGED
- ADDITIONAL_UNITS_REQUESTED
- AMBULANCE_REQUESTED
- FORM_SUBMITTED
- INCIDENT_CLOSED

### Acciones de Auditoría (AUDIT_LOG.action)
- INSERT: Registro nuevo
- UPDATE: Actualización
- DELETE: Eliminación

---

## VALIDACIONES Y RESTRICCIONES

### Integridad Referencial
- VEHICLES.station_id → STATIONS.id (RESTRICT)
- INCIDENTS.emergency_type_id → EMERGENCY_TYPES.id (RESTRICT)
- DISPATCH_RULES.emergency_type_id → EMERGENCY_TYPES.id (CASCADE)
- INCIDENT_VEHICLES.incident_id → INCIDENTS.id (CASCADE)
- INCIDENT_VEHICLES.vehicle_id → VEHICLES.id (RESTRICT)
- OPERATIONAL_FORMS.incident_id → INCIDENTS.id (CASCADE)
- INCIDENT_EVENTS.incident_id → INCIDENTS.id (CASCADE)
- INCIDENT_EVENTS.vehicle_id → VEHICLES.id (SET NULL)

### Restricciones de Unicidad
- STATIONS.code (UK)
- STATIONS.name (UK)
- VEHICLES.vehicle_code (UK)
- INCIDENTS.incident_code (UK)
- EMERGENCY_TYPES.code (UK)
- OPERATIONAL_FORMS.incident_id (UK)

### Restricciones Check (Validación)
- VEHICLES.capacity > 0
- EMERGENCY_TYPES.required_units > 0
- EMERGENCY_TYPES.required_personnel > 0
- EMERGENCY_TYPES.priority IN (1, 2, 3, 4)
- INCIDENTS.priority IN (1, 2, 3, 4)
- DISPATCH_RULES.required_count > 0

### Restricciones Temporales
- INCIDENTS.closed_at >= INCIDENTS.created_at
- INCIDENTS.first_unit_arrival >= INCIDENTS.created_at
- INCIDENT_VEHICLES.arrived_at >= INCIDENT_VEHICLES.assigned_at
- INCIDENT_VEHICLES.departure_time >= INCIDENT_VEHICLES.arrived_at

---

## NOTAS ADICIONALES

1. **JSON Fields**: Se permiten campos JSON para datos complejos (equipment_used, patient_info, additional_requirements) como almacenamiento flexible en esta fase.

2. **Timestamps**: Todos los registros incluyen created_at y updated_at para trazabilidad automática.

3. **Escalabilidad**: El diseño permite agregar nuevas estaciones, vehículos y tipos de emergencia sin cambios estructurales.

4. **Historial**: INCIDENT_HISTORY proporciona archivo optimizado para reportes históricos sin afectar performance de incidentes activos.

5. **Auditoría**: AUDIT_LOG proporciona trazabilidad completa de cambios en entidades críticas.

6. **Triggers Recomendados**: 
   - Auto-génesis de INCIDENT_EVENTS al cambiar estado
   - Auto-génesis de AUDIT_LOG en cambios críticos
   - Validación de asignación de vehículos (estado = GREEN)

