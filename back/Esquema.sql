-- ============================================================
-- EMERGENCY MANAGEMENT SYSTEM - MySQL/MariaDB Schema
-- Creado para XAMPP con MySQL Workbench
-- ============================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS emergency_management;
USE emergency_management;

-- ============================================================
-- TABLA: stations (Estaciones de bomberos)
-- ============================================================
CREATE TABLE IF NOT EXISTS stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: emergency_types (Tipos de emergencia)
-- ============================================================
CREATE TABLE IF NOT EXISTS emergency_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    required_units INT DEFAULT 1,
    required_personnel INT DEFAULT 4,
    morse_code VARCHAR(100),
    priority INT DEFAULT 1,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: vehicles (Vehículos/Unidades) - CORREGIDA
-- ============================================================
CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_code VARCHAR(50) NOT NULL UNIQUE,
    vehicle_type VARCHAR(100) NOT NULL,
    station_id INT NOT NULL,
    status ENUM('green', 'yellow', 'red') DEFAULT 'green' COMMENT 'green=disponible, yellow=en transito, red=asignado',
    driver_name VARCHAR(255),
    capacity INT,
    last_location_lat DECIMAL(10, 8),
    last_location_lng DECIMAL(11, 8),
    last_location_updated TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE RESTRICT,   -- <- Cambiado de SET NULL a RESTRICT
    INDEX idx_station (station_id),
    INDEX idx_status (status),
    INDEX idx_code (vehicle_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: dispatch_rules (Reglas de despacho)
-- ============================================================
CREATE TABLE IF NOT EXISTS dispatch_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emergency_type_id INT NOT NULL,
    priority_order INT NOT NULL,
    vehicle_type VARCHAR(100),
    morse_code VARCHAR(100),
    telegram_message TEXT,
    required_count INT DEFAULT 1,
    additional_requirements JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (emergency_type_id) REFERENCES emergency_types(id) ON DELETE CASCADE,
    INDEX idx_type (emergency_type_id),
    INDEX idx_priority (priority_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: incidents (Incidentes/Emergencias registradas)
-- ============================================================
CREATE TABLE IF NOT EXISTS incidents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_code VARCHAR(50) NOT NULL UNIQUE,
    emergency_type_id INT NOT NULL,
    street_1 VARCHAR(255) NOT NULL,
    street_2 VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location_notes TEXT,
    caller_name VARCHAR(255),
    caller_phone VARCHAR(20),
    incident_description TEXT,
    status ENUM('registered', 'pending', 'in_progress', 'resolved', 'closed') DEFAULT 'registered',
    priority INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    first_unit_arrival TIMESTAMP NULL,
    closed_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (emergency_type_id) REFERENCES emergency_types(id),
    INDEX idx_status (status),
    INDEX idx_type (emergency_type_id),
    INDEX idx_created (created_at),
    INDEX idx_location (latitude, longitude),
    INDEX idx_code (incident_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: incident_vehicles (Relación N:M - Vehículos asignados)
-- ============================================================
CREATE TABLE IF NOT EXISTS incident_vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    arrived_at TIMESTAMP NULL,
    departure_time TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    UNIQUE KEY unique_assignment (incident_id, vehicle_id),
    INDEX idx_incident (incident_id),
    INDEX idx_vehicle (vehicle_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: operational_forms (Formularios operacionales)
-- ============================================================
CREATE TABLE IF NOT EXISTS operational_forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id INT NOT NULL UNIQUE,
    personnel_on_scene INT,
    equipment_used JSON,
    patient_info JSON,
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

-- ============================================================
-- TABLA: incident_events (Registro de eventos/auditoría)
-- ============================================================
CREATE TABLE IF NOT EXISTS incident_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id INT NOT NULL,
    vehicle_id INT,
    event_type ENUM(
        'created',
        'vehicle_assigned',
        'vehicle_arrived',
        'vehicle_departed',
        'status_changed',
        'additional_units_requested',
        'ambulance_requested',
        'form_submitted',
        'incident_closed'
    ) NOT NULL,
    description TEXT,
    user_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
    INDEX idx_incident (incident_id),
    INDEX idx_created (created_at),
    INDEX idx_type (event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: incident_history (Histórico de incidentes cerrados)
-- ============================================================
CREATE TABLE IF NOT EXISTS incident_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id INT NOT NULL,
    incident_code VARCHAR(50) NOT NULL,
    emergency_type VARCHAR(255),
    location_streets VARCHAR(511),
    status VARCHAR(50),
    total_response_time TIME,
    vehicles_assigned INT,
    archived_data JSON,
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (incident_code),
    INDEX idx_archived (archived_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: audit_log (Registro de cambios críticos)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(100),
    entity_id INT,
    action VARCHAR(50),
    old_values JSON,
    new_values JSON,
    changed_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DATOS INICIALES - ESTACIONES (opcional, puedes omitir)
-- ============================================================
INSERT INTO stations (code, name, address, latitude, longitude, phone, email) VALUES
    ('S1', 'Central Station', 'Calle Principal 100, Viña del Mar', -33.0234, -71.5543, '911-1000', 'central@bomberos.cl'),
    ('S2', 'North Station', 'Av. Norte 250, Valparaíso', -33.0100, -71.5400, '911-1001', 'north@bomberos.cl'),
    ('S3', 'South Station', 'Av. Sur 300, Viña del Mar', -33.0400, -71.5700, '911-1002', 'south@bomberos.cl'),
    ('S4', 'East Station', 'Av. Este 150, Valparaíso', -33.0200, -71.5200, '911-1003', 'east@bomberos.cl');

-- ============================================================
-- DATOS INICIALES - TIPOS DE EMERGENCIA
-- ============================================================
INSERT INTO emergency_types (code, name, description, required_units, required_personnel, morse_code, priority) VALUES
    ('INC', 'Incendio', 'Incendio estructural o confinado', 3, 12, '.../.-', 1),
    ('ACC', 'Accidente', 'Accidente de tránsito o caída', 2, 8, '.-/-.--', 2),
    ('RES', 'Rescate', 'Operación de rescate en altura o profundidad', 2, 10, '.-.-./-.-', 1),
    ('ASI', 'Asistencia Médica', 'Asistencia médica de emergencia', 1, 4, '.-/...-', 3),
    ('FLS', 'Falsa Alarma', 'Falsa alarma o verificación', 1, 2, '..-../-..', 4),
    ('MAT', 'Materiales Peligrosos', 'Derrames o exposición a químicos', 2, 8, '--/.-', 1);

-- ============================================================
-- DATOS INICIALES - VEHÍCULOS
-- ============================================================
INSERT INTO vehicles (vehicle_code, vehicle_type, station_id, status, driver_name, capacity) VALUES
    ('BR-01', 'Camión Bombero', 1, 'green', 'Carlos López', 8),
    ('BR-02', 'Camión Bombero', 2, 'green', 'Juan Pérez', 8),
    ('BR-03', 'Camión Bombero', 3, 'green', 'María García', 8),
    ('BR-04', 'Camión Bombero', 4, 'green', 'Roberto Díaz', 8),
    ('AM-01', 'Ambulancia', 1, 'green', 'Dr. Silva', 2),
    ('AM-02', 'Ambulancia', 2, 'green', 'Enfermera Rosa', 2),
    ('ER-01', 'Escalera', 1, 'green', 'Luis Martínez', 4),
    ('TN-01', 'Tanquero', 3, 'green', 'Pedro Sánchez', 2);

-- ============================================================
-- DATOS INICIALES - REGLAS DE DESPACHO
-- ============================================================
INSERT INTO dispatch_rules (emergency_type_id, priority_order, vehicle_type, morse_code, telegram_message, required_count) VALUES
    (1, 1, 'Camión Bombero', '.../', 'INCENDIO REPORTADO - Unidades respondiendo', 3),
    (1, 2, 'Ambulancia', '.../', 'Ambulancia en apoyo a incendio', 1),
    (2, 1, 'Camión Bombero', '.-.--', 'ACCIDENTE REPORTADO - Unidades respondiendo', 2),
    (2, 2, 'Ambulancia', '.-.--', 'Ambulancia en camino al accidente', 1),
    (3, 1, 'Escalera', '.-.-.', 'OPERACIÓN DE RESCATE - Unidades especializadas', 1),
    (4, 1, 'Ambulancia', '.-...-', 'EMERGENCIA MÉDICA - Ambulancia respondiendo', 1),
    (5, 1, 'Camión Bombero', '..-..', 'Verificando falsa alarma', 1),
    (6, 1, 'Camión Bombero', '--/.-.', 'MATERIALES PELIGROSOS - Equipo especializado', 2);

-- ============================================================
-- VISTAS ÚTILES PARA REPORTES
-- ============================================================

CREATE OR REPLACE VIEW active_incidents_view AS
SELECT 
    i.id,
    i.incident_code,
    i.created_at,
    et.name AS emergency_type,
    i.street_1,
    i.street_2,
    i.latitude,
    i.longitude,
    i.status,
    i.priority,
    COUNT(DISTINCT iv.vehicle_id) AS vehicles_assigned,
    GROUP_CONCAT(v.vehicle_code) AS vehicle_codes
FROM incidents i
LEFT JOIN emergency_types et ON i.emergency_type_id = et.id
LEFT JOIN incident_vehicles iv ON i.id = iv.incident_id
LEFT JOIN vehicles v ON iv.vehicle_id = v.id
WHERE i.status IN ('registered', 'pending', 'in_progress')
GROUP BY i.id
ORDER BY i.priority ASC, i.created_at DESC;

CREATE OR REPLACE VIEW vehicle_availability_view AS
SELECT 
    s.code AS station_code,
    s.name AS station_name,
    COUNT(*) AS total_vehicles,
    SUM(CASE WHEN v.status = 'green' THEN 1 ELSE 0 END) AS available,
    SUM(CASE WHEN v.status = 'yellow' THEN 1 ELSE 0 END) AS transitioning,
    SUM(CASE WHEN v.status = 'red' THEN 1 ELSE 0 END) AS assigned
FROM stations s
LEFT JOIN vehicles v ON s.id = v.station_id
GROUP BY s.id, s.code, s.name
ORDER BY s.code;

CREATE OR REPLACE VIEW incident_statistics_view AS
SELECT 
    et.code,
    et.name,
    COUNT(i.id) AS total_incidents,
    COUNT(CASE WHEN i.status = 'closed' THEN 1 END) AS closed,
    COUNT(CASE WHEN i.status IN ('registered', 'pending', 'in_progress') THEN 1 END) AS active,
    AVG(TIMESTAMPDIFF(MINUTE, i.created_at, i.closed_at)) AS avg_response_minutes
FROM emergency_types et
LEFT JOIN incidents i ON et.id = i.emergency_type_id
GROUP BY et.id, et.code, et.name
ORDER BY total_incidents DESC;

-- ============================================================
-- ÍNDICES ADICIONALES PARA PERFORMANCE
-- ============================================================
CREATE INDEX idx_incidents_status_created ON incidents(status, created_at DESC);
CREATE INDEX idx_vehicles_station_status ON vehicles(station_id, status);
CREATE INDEX idx_incident_events_timestamp ON incident_events(created_at DESC);

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
