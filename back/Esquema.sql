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

-- ------------------------------------------------------------
-- TABLA ADICIONAL: personnel (bomberos)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS personnel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    external_id INT,
    first_name VARCHAR(100) NOT NULL,
    last_name_1 VARCHAR(100),
    last_name_2 VARCHAR(100),
    rank VARCHAR(100),
    station_id INT,
    can_rescue BOOLEAN DEFAULT FALSE,
    can_hazmat BOOLEAN DEFAULT FALSE,
    level VARCHAR(50),
    radio_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE SET NULL,
    INDEX idx_station (station_id),
    INDEX idx_rank (rank)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: incident_vehicles (Relación N:M - Vehículos asignados)
-- ============================================================
CREATE TABLE IF NOT EXISTS incident_vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id INT NOT NULL,
    vehicle_id INT NOT NULL,

    personnel_in_charge_id INT NULL,
    personnel_count INT DEFAULT 0,

    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    arrived_at TIMESTAMP NULL,
    departure_time TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (personnel_in_charge_id) REFERENCES personnel(id) ON DELETE SET NULL,

    UNIQUE KEY unique_assignment (incident_id, vehicle_id),
    INDEX idx_incident (incident_id),
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_personnel_in_charge (personnel_in_charge_id)
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
  ('C1', '1ra Compañía Villa Alemana', 'Av. Principal 101, Villa Alemana', -33.0472, -71.3627, '911-0001', 'cia1@cbvaa.cl'),
  ('C2', '2da Compañía Villa Alemana', 'Calle Norte 200, Villa Alemana',   -33.0420, -71.3500, '911-0002', 'cia2@cbvaa.cl'),
  ('C3', '3ra Compañía Villa Alemana', 'Sector Sur 300, Villa Alemana',    -33.0550, -71.3800, '911-0003', 'cia3@cbvaa.cl'),
  ('C4', '4ta Compañía Villa Alemana', 'Camino Interior 400, Villa Alemana', -33.0500, -71.3580, '911-0004', 'cia4@cbvaa.cl');

-- ============================================================
-- DATOS INICIALES - TIPOS DE EMERGENCIA
-- ============================================================
INSERT INTO emergency_types (code, name, description, required_units, required_personnel, morse_code, priority) VALUES
   -- ('INC', 'Incendio', 'Incendio estructural o confinado', 3, 12, '.../.-', 1),
   -- ('ACC', 'Accidente', 'Accidente de tránsito o caída', 2, 8, '.-/-.--', 2),
   -- ('RES', 'Rescate', 'Operación de rescate en altura o profundidad', 2, 10, '.-.-./-.-', 1),
   -- ('ASI', 'Asistencia Médica', 'Asistencia médica de emergencia', 1, 4, '.-/...-', 3),
   -- ('FLS', 'Falsa Alarma', 'Falsa alarma o verificación', 1, 2, '..-../-..', 4),
   -- ('MAT', 'Materiales Peligrosos', 'Derrames o exposición a químicos', 2, 8, '--/.-', 1);
            -- CLAVE 1: INCENDIO ESTRUCTURAL
        ('1-1', 'INCENDIO ESTRUCTURAL BÁSICO',
        'Incendio estructural básico', 3, 12, '.../.-', 1),

        ('1-2', 'INCENDIO ESTRUCTURAL EN ALTURA',
        'Incendio estructural en edificio de altura', 5, 20, '.../.-/-', 1),

        ('1-3', 'INCENDIO ESTRUCTURAL EN LUGAR PÚBLICO O MASIVO',
        'Incendio estructural en lugar público o con alta concentración de personas',6, 24, '.../.-//', 1),

        -- CLAVE 2: INCENDIO FORESTAL
        ('2-1', 'INCENDIO FORESTAL URBANO',
        'Incendio forestal urbano', 3, 12, '..-/.', 2),

        ('2-2', 'INCENDIO FORESTAL DE INTERFASE',
        'Incendio forestal de interfaz urbano-rural', 4, 16, '..-/-', 1),

        ('2-3', 'INCENDIO FORESTAL RURAL',
        'Incendio forestal rural', 5, 20, '..-//', 1),

        ('2-4', 'INCENDIO EN VERTEDERO',
        'Incendio en vertedero, micro basural o basurero',2, 8, '..-/.--', 3),

        -- CLAVE 3: INCENDIO VEHICULAR
        ('3-1', 'INCENDIO VEHICULAR MENOR',
        'Incendio vehicular menor', 1, 4, '...-.', 3),

        ('3-2', 'INCENDIO VEHICULAR MAYOR',
        'Incendio vehicular mayor', 2, 8, '...-/-', 2),

        ('3-3', 'INCENDIO VEHICULAR CON CARGA PELIGROSA',
        'Incendio vehicular con materiales peligrosos',4, 16, '...-//', 1),

        -- CLAVE 4: MATERIALES PELIGROSOS
        ('4-1', 'HAZ-MAT DOMICILIARIA',
        'Emergencia Haz-Mat domiciliaria', 2, 8, '.-..', 2),

        ('4-2', 'HAZ-MAT EN VÍA PÚBLICA',
        'Emergencia Haz-Mat en vía pública', 3, 12, '.-../-', 2),

        ('4-3', 'HAZ-MAT INDUSTRIAL',
        'Emergencia Haz-Mat industrial', 5, 20, '.-..//', 1),

        -- CLAVE 5: RESCATE VEHICULAR
        ('5-1', 'RESCATE VEHICULAR LIVIANO',
        'Rescate vehicular liviano', 2, 8, '.--.', 2),

        ('5-2', 'RESCATE VEHICULAR PESADO',
        'Rescate vehicular pesado', 4, 16, '.--./-', 1),

        ('5-3', 'RESCATE VEHICULAR CON MATERIALES PELIGROSOS',
        'Rescate vehicular con materiales peligrosos',5, 20, '.--.//', 1),

        ('5-4', 'RESCATE AÉREO, FERROVIARIO O DE BLINDADOS',
        'Rescate aéreo, ferroviario o de blindados',6, 24, '.--./.--', 1),

        -- CLAVE 6: RESCATE
        ('6-1', 'APOYO A SAMU Y/O CARABINEROS',
        'Apoyo a SAMU o Carabineros', 1, 4, '--.-', 3),

        ('6-2', 'PERSONA EXTRAVIADA',
        'Búsqueda de persona extraviada', 3, 12, '--.-/-', 2),

        ('6-3', 'PERSONA ENCERRADA','Persona encerrada', 1, 4, '--.-/.', 3),

        ('6-4', 'RESCATE ANIMAL','Rescate animal', 1, 4, '--.-//', 4),

        ('6-5', 'RESCATE EN ALTURA','Rescate en altura', 3, 12, '--.-/.-', 2),

        ('6-6', 'RESCATE EN ESTRUCTURAS COLAPSADAS','Rescate en estructuras colapsadas',5, 20, '--.-/--', 1),

        ('6-7', 'RESCATE EN ESPACIOS CONFINADOS','Rescate en espacios confinados',4, 16, '--.-/..', 1),

        -- OTROS INCIDENTES
        ('7-1', 'ACUARTELAMIENTO GENERAL','Acuartelamiento general', 10, 40, '---', 1),

        ('9-1', 'EMERGENCIA INDUSTRIAL','Emergencia industrial', 5, 20, '---/.', 1),

        ('10-1', 'TRASLADO DE BOMBERO ACCIDENTADO','Traslado de bombero accidentado',1, 4, '.----', 2),

        ('10-2', 'ABASTECIMIENTO DE AGUA','Abastecimiento de agua', 1, 4, '.----/-', 4),

        ('10-3', 'ABRIR PUERTAS','Apertura de puertas', 1, 4, '.----/.', 4),

        ('10-4', 'COLOCAR DRIZAS','Instalación de drizas', 1, 4, '.----//', 4),

        ('10-5', 'EMERGENCIA CLIMATOLÓGICA',
        'Emergencia climatológica', 3, 12, '.----/.-', 2),

        ('10-6', 'VISITA INSPECTIVA',
        'Visita inspectiva', 1, 2, '.----/--', 5),

        ('10-8', 'SALIDA A TALLER',
        'Salida a taller', 1, 2, '.----/..', 5),

        ('10-9', 'INVESTIGACIÓN DE INCENDIOS',
        'Investigación de incendios', 2, 6, '.----/.--', 3),

        ('11-1', 'PREVENCIÓN DE EMERGENCIAS ESTRUCTURALES',
        'Prevención de emergencias estructurales',
        1, 4, '.--.-', 4),

        ('13-1', 'REBROTE DE INCENDIO',
        'Rebrote de incendio', 2, 8, '.--.-/-', 2),

        ('15-1', 'EMERGENCIA NO CLASIFICADA',
        'Emergencia no clasificada',
        2, 8, '.--.-//', 3);

-- ============================================================
-- DATOS INICIALES - VEHÍCULOS
-- ============================================================
INSERT INTO vehicles (vehicle_code, vehicle_type, station_id, status, driver_name, capacity) VALUES
    ('C11', 'Camión Bombero', 1, 'green', 'a', 8),
    ('C12', 'Camión Bombero', 1, 'green', 'a', 8),
    ('C13', 'Camión Bombero', 1, 'green', 'a', 8),
    ('C14', 'Camión Bombero', 1, 'green', 'a', 8),
    ('C21', 'Camión Bombero', 2, 'green', 'a', 8),
    ('C22', 'Camión Bombero', 2, 'green', 'a', 8),
    ('C31', 'Camión Bombero', 3, 'green', 'a', 8),
    ('C32', 'Camión Bombero', 3, 'green', 'a', 8),
    ('C33', 'Camión Bombero', 3, 'green', 'a', 8),
    ('C41', 'Camión Bombero', 4, 'green', 'a', 8),
    ('C42', 'Camión Bombero', 4, 'green', 'a', 8),
    ('C43', 'Camión Bombero', 4, 'green', 'a', 8);

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
-- DATOS OFICIALES - BOMBEROS PERSONEL
-- ============================================================
INSERT INTO personnel (external_id, first_name, last_name_1, last_name_2, rank, station_id, can_rescue, can_hazmat, level, radio_code) VALUES
  (2, 'Cristóbal', 'Morales', 'Flores', 'Bombero', 1, 1, 1, 'Profesional', '1-9'),
  (3, 'Natalia', 'Vergara', 'Castro', 'Bombero', 2, 0, 0, 'Profesional', '2-9'),
  (4, 'Martina', 'Valenzuela', 'Gómez', 'Bombero', 3, 1, 1, 'Operativo', '3-9'),
  (5, 'Natalia', 'Morales', 'Ramírez', 'Bombero', 4, 0, 1, 'Profesional', '4-9'),
  (6, 'Amanda', 'Núñez', 'Herrera', 'Bombero', 1, 0, 0, 'Operativo', '1-9'),
  (7, 'Gabriel', 'Fernández', 'Espinoza', 'Bombero', 3, 0, 1, 'Operativo', '3-9'),
  (8, 'Camila', 'Torres', 'Martínez', 'Bombero', 1, 0, 1, 'Profesional', '1-9'),
  (9, 'Lorenzo', 'Rodríguez', 'Torres', 'Bombero', 1, 1, 1, 'Operativo', '1-9'),
  (10, 'Benjamín', 'Martínez', 'González', 'Bombero', 1, 0, 1, 'Inicial', '1-9'),
  (11, 'Antonia', 'Flores', 'Ramírez', 'Bombero', 3, 0, 0, 'Inicial', '3-9'),
  (12, 'Carolina', 'Núñez', 'Fuentes', 'Bombero', 3, 1, 1, 'Profesional', '3-9'),
  (13, 'Iván', 'Torres', 'Espinoza', 'Bombero', 4, 0, 1, 'Profesional', '4-9'),
  (14, 'Iván', 'Ramírez', 'Díaz', 'Bombero', 1, 0, 0, 'Operativo', '1-9'),
  (15, 'Simón', 'Fernández', 'Espinoza', 'Bombero', 3, 0, 1, 'Operativo', '3-9'),
  (16, 'Sebastián', 'López', 'Silva', 'Bombero', 1, 1, 1, 'Operativo', '1-9'),
  (17, 'Iván', 'Jara', 'Sánchez', 'Bombero', 2, 0, 1, 'Inicial', '2-9'),
  (18, 'Rocío', 'Rojas', 'Valenzuela', 'Bombero', 2, 0, 1, 'Inicial', '2-9'),
  (19, 'Amanda', 'Vásquez', 'Torres', '1Teniente', 4, 1, 1, 'Profesional', '4-1'),
  (20, 'Ignacio', 'Espinoza', 'Álvarez', 'Bombero', 3, 1, 1, 'Operativo', '3-9'),
  (21, 'Catalina', 'Valenzuela', 'Silva', 'Bombero', 3, 1, 0, 'Operativo', '3-9'),
  (22, 'Marcelo', 'Vásquez', 'Soto', 'Bombero', 2, 0, 0, 'Profesional', '2-9'),
  (23, 'Rosario', 'Díaz', 'Morales', 'Bombero', 1, 0, 1, 'Inicial', '1-9'),
  (24, 'Agustín', 'Reyes', 'Figueroa', 'Bombero', 1, 1, 1, 'Profesional', '1-9'),
  (25, 'Iván', 'Vásquez', 'Rodríguez', 'Bombero', 3, 0, 0, 'Profesional', '3-9'),
  (26, 'Santiago', 'Muñoz', 'Hernández', 'Bombero', 3, 1, 0, 'Operativo', '3-9'),
  (27, 'Maximiliano', 'Torres', 'Rojas', 'Bombero', 4, 0, 0, 'Operativo', '4-9'),
  (28, 'Patricio', 'Álvarez', 'Carrasco', 'Bombero', 2, 0, 1, 'Inicial', '2-9'),
  (29, 'Francisca', 'Muñoz', 'Hernández', 'Bombero', 3, 1, 1, 'Inicial', '3-9'),
  (30, 'Francisco', 'Rojas', 'Vásquez', 'Bombero', 3, 1, 0, 'Operativo', '3-9'),
  (31, 'Maximiliano', 'Torres', 'Álvarez', 'Bombero', 3, 1, 1, 'Operativo', '3-9'),
  (32, 'Juan', 'Silva', 'Díaz', 'Bombero', 1, 0, 0, 'Profesional', '1-9'),
  (33, 'Fernanda', 'Vásquez', 'Herrera', 'Bombero', 1, 0, 0, 'Profesional', '1-9'),
  (34, 'Patricio', 'Silva', 'Cortés', 'Bombero', 2, 1, 1, 'Operativo', '2-9'),
  (35, 'Camilo', 'Bravo', 'Pérez', 'Bombero', 2, 1, 0, 'Profesional', '2-9'),
  (36, 'Maximiliano', 'Tapia', 'Díaz', 'Bombero', 3, 0, 0, 'Operativo', '3-9'),
  (37, 'Laura', 'Morales', 'Valenzuela', 'Bombero', 1, 1, 0, 'Profesional', '1-9'),
  (38, 'Gabriel', 'González', 'Sepúlveda', 'Bombero', 4, 0, 0, 'Operativo', '4-9'),
  (39, 'Daniela', 'Reyes', 'Rojas', 'Bombero', 1, 1, 0, 'Inicial', '1-9'),
  (40, 'Cristóbal', 'Riquelme', 'Figueroa', 'Bombero', 3, 1, 0, 'Inicial', '3-9'),
  (41, 'Rosario', 'Riquelme', 'Álvarez', 'Bombero', 3, 1, 1, 'Operativo', '3-9'),
  (42, 'Leonardo', 'Herrera', 'Gutiérrez', 'Capitán', 4, 1, 1, 'Operativo', 'M-4'),
  (43, 'Catalina', 'Rojas', 'Valenzuela', 'Bombero', 2, 0, 1, 'Operativo', '2-9'),
  (44, 'Marcelo', 'Espinoza', 'Hernández', 'Bombero', 3, 0, 0, 'Inicial', '3-9'),
  (45, 'Lorenzo', 'Hernández', 'Carrasco', 'Bombero', 3, 0, 0, 'Operativo', '3-9'),
  (46, 'Patricio', 'Valenzuela', 'Ramírez', 'Bombero', 3, 1, 0, 'Inicial', '3-9'),
  (47, 'Benjamín', 'Martínez', 'Fuentes', 'Bombero', 1, 0, 1, 'Operativo', '1-9'),
  (48, 'Juan', 'Espinoza', 'Araya', 'Bombero', 3, 1, 0, 'Operativo', '3-9'),
  (49, 'Fernanda', 'Ramírez', 'Vásquez', 'Bombero', 1, 1, 1, 'Profesional', '1-9'),
  (50, 'Javiera', 'González', 'Espinoza', 'Bombero', 2, 0, 1, 'Operativo', '2-9'),
  (51, 'Santiago', 'Soto', 'Martínez', 'Bombero', 4, 0, 1, 'Inicial', '4-9'),
  (52, 'Sebastián', 'Riquelme', 'Contreras', 'Bombero', 4, 1, 0, 'Profesional', '4-9'),
  (53, 'Tomás', 'Fernández', 'Jara', 'Bombero', 3, 0, 1, 'Operativo', '3-9'),
  (54, 'Rodrigo', 'Jara', 'Valenzuela', 'Bombero', 3, 1, 1, 'Operativo', '3-9'),
  (55, 'Víctor', 'Pérez', 'Torres', 'Bombero', 2, 1, 1, 'Operativo', '2-9'),
  (56, 'Ricardo', 'Gómez', 'Bravo', '1Teniente', 1, 0, 1, 'Profesional', '1-1'),
  (57, 'Antonia', 'Silva', 'Vargas', 'Bombero', 1, 1, 0, 'Operativo', '1-9'),
  (58, 'Rocío', 'Valenzuela', 'Bravo', 'Bombero', 4, 0, 1, 'Inicial', '4-9'),
  (59, 'Fernanda', 'Jara', 'Reyes', 'Bombero', 1, 0, 1, 'Operativo', '1-9'),
  (60, 'Juan', 'Espinoza', 'Hernández', 'Bombero', 3, 0, 0, 'Operativo', '3-9'),
  (61, 'Josefina', 'Vásquez', 'López', 'Bombero', 4, 0, 1, 'Operativo', '4-9'),
  (62, 'Matías', 'Álvarez', 'Castillo', 'Bombero', 1, 1, 1, 'Inicial', '1-9'),
  (63, 'Francisca', 'Jara', 'Vásquez', 'Bombero', 3, 0, 1, 'Operativo', '3-9'),
  (64, 'Belén', 'Torres', 'Díaz', 'Bombero', 4, 1, 1, 'Operativo', '4-9'),
  (65, 'Maximiliano', 'Vásquez', 'Figueroa', 'Bombero', 2, 0, 1, 'Inicial', '2-9'),
  (66, 'Josefina', 'Sepúlveda', 'Tapia', 'Bombero', 2, 1, 0, 'Operativo', '2-9'),
  (67, 'Josefina', 'Castro', 'Herrera', 'Bombero', 4, 1, 0, 'Inicial', '4-9'),
  (68, 'Victoria', 'Martínez', 'Cortés', 'Bombero', 4, 1, 1, 'Operativo', '4-9'),
  (69, 'Sebastián', 'Araya', 'Araya', 'Bombero', 3, 0, 1, 'Profesional', '3-9'),
  (70, 'Pedro', 'Reyes', 'Rojas', 'Bombero', 1, 1, 0, 'Operativo', '1-9'),
  (71, 'Agustín', 'Vargas', 'Riquelme', 'Bombero', 3, 0, 1, 'Operativo', '3-9'),
  (72, 'Francisco', 'Vargas', 'Morales', 'Bombero', 3, 0, 0, 'Inicial', '3-9'),
  (73, 'Ricardo', 'Díaz', 'Pérez', 'Bombero', 3, 0, 1, 'Inicial', '3-9'),
  (74, 'Matías', 'Tapia', 'Rivera', 'Bombero', 3, 0, 1, 'Profesional', '3-9'),
  (75, 'Ricardo', 'Pérez', 'Herrera', 'Bombero', 2, 1, 1, 'Profesional', '2-9'),
  (76, 'Victoria', 'Rodríguez', 'Núñez', 'Bombero', 3, 1, 0, 'Profesional', '3-9'),
  (77, 'Natalia', 'López', 'Espinoza', 'Bombero', 2, 0, 1, 'Inicial', '2-9'),
  (78, 'Francisco', 'González', 'Contreras', 'Bombero', 2, 0, 1, 'Inicial', '2-9'),
  (79, 'Valentina', 'Cortés', 'González', 'Bombero', 3, 1, 1, 'Operativo', '3-9'),
  (80, 'Ricardo', 'Pérez', 'López', 'Bombero', 1, 0, 1, 'Operativo', '1-9'),
  (81, 'Cristóbal', 'Sánchez', 'Vásquez', 'Bombero', 1, 0, 0, 'Operativo', '1-9'),
  (82, 'Francisca', 'Castillo', 'Cortés', 'Bombero', 1, 0, 0, 'Operativo', '1-9'),
  (83, 'Antonia', 'Rojas', 'Rojas', 'Bombero', 1, 0, 0, 'Inicial', '1-9'),
  (84, 'Cristóbal', 'Reyes', 'Carrasco', 'Bombero', 4, 1, 1, 'Operativo', '4-9'),
  (85, 'Maximiliano', 'Rivera', 'Castro', 'Bombero', 1, 0, 1, 'Operativo', '1-9'),
  (86, 'Gabriel', 'Riquelme', 'Vergara', 'Bombero', 3, 0, 1, 'Inicial', '3-9'),
  (87, 'Daniela', 'Torres', 'Martínez', 'Bombero', 2, 1, 0, 'Operativo', '2-9'),
  (88, 'Francisco', 'Fuentes', 'Rodríguez', 'Bombero', 4, 0, 1, 'Inicial', '4-9'),
  (89, 'Camilo', 'Sepúlveda', 'Hernández', 'Bombero', 1, 0, 0, 'Operativo', '1-9'),
  (90, 'Valentina', 'Jara', 'Vargas', 'Bombero', 2, 0, 0, 'Inicial', '2-9'),
  (91, 'Valentina', 'Rivera', 'Jara', 'Bombero', 2, 1, 1, 'Profesional', '2-9'),
  (92, 'Juan', 'Silva', 'Araya', 'Bombero', 3, 0, 0, 'Inicial', '3-9'),
  (93, 'Juan', 'Fernández', 'Ramírez', 'Bombero', 2, 0, 1, 'Operativo', '2-9'),
  (94, 'Sebastián', 'Sepúlveda', 'Castro', 'Bombero', 3, 0, 1, 'Operativo', '3-9'),
  (95, 'Pedro', 'Riquelme', 'Soto', 'Bombero', 2, 1, 0, 'Operativo', '2-9'),
  (96, 'Catalina', 'Sánchez', 'Álvarez', 'Bombero', 4, 0, 0, 'Profesional', '4-9'),
  (97, 'Emilia', 'González', 'Herrera', 'Bombero', 3, 0, 1, 'Inicial', '3-9'),
  (98, 'Simón', 'Torres', 'Jara', 'Bombero', 4, 0, 1, 'Operativo', '4-9'),
  (99, 'Jorge', 'Núñez', 'Díaz', 'Bombero', 4, 1, 0, 'Profesional', '4-9'),
  (100, 'Camila', 'Sepúlveda', 'Rojas', 'Bombero', 3, 0, 0, 'Profesional', '3-9'),
  (101, 'Rosario', 'Contreras', 'Sánchez', 'Bombero', 4, 0, 0, 'Profesional', '4-9'),
  (102, 'Rocío', 'Vásquez', 'Martínez', 'Bombero', 1, 1, 0, 'Profesional', '1-9'),
  (103, 'Camila', 'Pérez', 'Gómez', 'Bombero', 4, 0, 0, 'Operativo', '4-9'),
  (104, 'David', 'Sepúlveda', 'Silva', 'Bombero', 3, 1, 1, 'Operativo', '3-9'),
  (105, 'Antonia', 'Ramírez', 'Flores', 'Bombero', 2, 1, 1, 'Operativo', '2-9'),
  (106, 'Javiera', 'Cortés', 'Riquelme', 'Bombero', 4, 0, 0, 'Operativo', '4-9'),
  (107, 'Laura', 'Araya', 'Bravo', 'Bombero', 3, 0, 1, 'Profesional', '3-9'),
  (108, 'Ignacio', 'Torres', 'Tapia', 'Bombero', 3, 0, 1, 'Profesional', '3-9'),
  (109, 'Rodrigo', 'Bravo', 'Vásquez', 'Bombero', 2, 0, 0, 'Profesional', '2-9'),
  (110, 'Camila', 'Vásquez', 'Fuentes', 'Bombero', 4, 0, 0, 'Operativo', '4-9'),
  (111, 'Pedro', 'López', 'Álvarez', 'Bombero', 1, 1, 0, 'Operativo', '1-9'),
  (112, 'Javiera', 'Rivera', 'Vargas', 'Bombero', 4, 1, 0, 'Operativo', '4-9'),
  (113, 'Camila', 'Castillo', 'Soto', 'Bombero', 2, 1, 0, 'Operativo', '2-9'),
  (114, 'Gabriel', 'Fernández', 'Castillo', 'Bombero', 4, 1, 0, 'Operativo', '4-9'),
  (115, 'Martina', 'Jara', 'Vásquez', 'Bombero', 2, 1, 0, 'Operativo', '2-9'),
  (116, 'Marcelo', 'Figueroa', 'Sánchez', 'Bombero', 4, 0, 0, 'Operativo', '4-9'),
  (117, 'Ricardo', 'Bravo', 'Morales', 'Bombero', 2, 1, 0, 'Inicial', '2-9'),
  (118, 'Martín', 'Castillo', 'Rojas', 'Bombero', 2, 0, 0, 'Operativo', '2-9'),
  (119, 'Benjamín', 'Vargas', 'Fuentes', 'Bombero', 4, 1, 1, 'Inicial', '4-9'),
  (120, 'Martín', 'Contreras', 'Díaz', 'Bombero', 2, 1, 0, 'Profesional', '2-9'),
  (121, 'Santiago', 'Contreras', 'Flores', 'Bombero', 3, 1, 0, 'Inicial', '3-9'),
  (122, 'Camilo', 'Vergara', 'Morales', 'Bombero', 4, 1, 0, 'Profesional', '4-9'),
  (123, 'Emilia', 'Morales', 'Pérez', 'Bombero', 4, 0, 0, 'Inicial', '4-9'),
  (124, 'Lorenzo', 'Flores', 'Pérez', 'Bombero', 3, 0, 0, 'Profesional', '3-9'),
  (125, 'Camila', 'Flores', 'Gutiérrez', 'Bombero', 4, 0, 0, 'Operativo', '4-9'),
  (126, 'Amanda', 'Valenzuela', 'Valenzuela', 'Bombero', 1, 0, 0, 'Inicial', '1-9'),
  (127, 'Javiera', 'Gómez', 'Tapia', 'Bombero', 2, 1, 1, 'Profesional', '2-9'),
  (128, 'Martín', 'Núñez', 'Torres', 'Bombero', 4, 0, 0, 'Operativo', '4-9'),
  (129, 'Agustín', 'Araya', 'Gómez', '2Teniente', 1, 1, 1, 'Operativo', '1-2'),
  (130, 'Gabriel', 'Valenzuela', 'Reyes', 'Bombero', 1, 1, 0, 'Operativo', '1-9'),
  (131, 'Antonia', 'Carrasco', 'Vargas', 'Bombero', 2, 0, 1, 'Operativo', '2-9'),
  (132, 'Jorge', 'Castro', 'Muñoz', 'Bombero', 2, 0, 0, 'Profesional', '2-9'),
  (133, 'Josefina', 'Vásquez', 'Muñoz', 'Bombero', 2, 0, 0, 'Profesional', '2-9'),
  (134, 'Iván', 'Soto', 'López', 'Bombero', 4, 1, 1, 'Inicial', '4-9'),
  (135, 'Antonia', 'Valenzuela', 'Sepúlveda', 'Bombero', 3, 1, 1, 'Profesional', '3-9'),
  (136, 'Benjamín', 'Rodríguez', 'Herrera', 'Bombero', 2, 0, 0, 'Operativo', '2-9'),
  (137, 'Joaquín', 'Gutiérrez', 'Bravo', '2Teniente', 4, 1, 1, 'Profesional', '4-2'),
  (138, 'Agustín', 'Fernández', 'Núñez', 'Bombero', 2, 0, 1, 'Operativo', '2-9'),
  (139, 'Rocío', 'Hernández', 'Gómez', 'Bombero', 4, 0, 1, 'Inicial', '4-9'),
  (140, 'Maximiliano', 'Rivera', 'Pérez', 'Bombero', 2, 0, 1, 'Profesional', '2-9'),
  (141, 'Antonia', 'Gómez', 'Rojas', 'Bombero', 2, 0, 1, 'Operativo', '2-9'),
  (142, 'Víctor', 'Castro', 'Contreras', '3Teniente', 4, 1, 1, 'Profesional', '4-3'),
  (143, 'Patricio', 'Jara', 'Rodríguez', 'Bombero', 4, 1, 0, 'Profesional', '4-9'),
  (144, 'Natalia', 'Núñez', 'Vargas', 'Bombero', 3, 0, 0, 'Profesional', '3-9'),
  (145, 'Gabriel', 'Vergara', 'Morales', 'Bombero', 2, 1, 1, 'Operativo', '2-9'),
  (146, 'Maximiliano', 'Flores', 'Jara', 'Bombero', 2, 0, 1, 'Inicial', '2-9'),
  (147, 'Rocío', 'Fernández', 'Rodríguez', 'Bombero', 2, 1, 0, 'Operativo', '2-9'),
  (148, 'Martín', 'Rodríguez', 'Torres', 'Bombero', 2, 0, 1, 'Profesional', '2-9'),
  (149, 'Santiago', 'Araya', 'Valenzuela', 'Bombero', 2, 1, 1, 'Inicial', '2-9'),
  (150, 'Rodrigo', 'Herrera', 'Vásquez', 'Bombero', 3, 1, 1, 'Operativo', '3-9'),
  (151, 'Laura', 'Contreras', 'Gómez', 'Bombero', 4, 1, 0, 'Inicial', '4-9'),
  (152, 'Pedro', 'Riquelme', 'Araya', 'Bombero', 4, 1, 1, 'Profesional', '4-9'),
  (153, 'Camila', 'Reyes', 'Contreras', 'Bombero', 1, 1, 0, 'Operativo', '1-9'),
  (154, 'Javiera', 'Contreras', 'Bravo', 'Bombero', 3, 1, 1, 'Operativo', '3-9'),
  (155, 'Ignacio', 'Morales', 'Riquelme', 'Bombero', 1, 1, 0, 'Operativo', '1-9'),
  (156, 'Rocío', 'Vergara', 'López', 'Bombero', 4, 0, 1, 'Operativo', '4-9'),
  (157, 'Juan', 'Riquelme', 'Reyes', 'Bombero', 3, 1, 1, 'Operativo', '3-9'),
  (158, 'Jorge', 'Díaz', 'Sánchez', 'Bombero', 2, 1, 0, 'Profesional', '2-9'),
  (159, 'Laura', 'Martínez', 'Contreras', 'Bombero', 4, 1, 1, 'Operativo', '4-9'),
  (160, 'Juan', 'Vargas', 'Torres', 'Bombero', 4, 1, 1, 'Profesional', '4-9'),
  (161, 'Camila', 'Hernández', 'Vásquez', 'Bombero', 4, 1, 1, 'Operativo', '4-9'),
  (162, 'Simón', 'Figueroa', 'Torres', '1Teniente', 2, 1, 1, 'Operativo', '2-1'),
  (163, 'Marcelo', 'Bravo', 'Castillo', 'Bombero', 3, 1, 0, 'Operativo', '3-9'),
  (164, 'Antonia', 'Muñoz', 'Herrera', 'Bombero', 4, 0, 0, 'Operativo', '4-9'),
  (165, 'Rodrigo', 'Carrasco', 'Hernández', 'Bombero', 2, 0, 0, 'Operativo', '2-9'),
  (166, 'Amanda', 'Vargas', 'Contreras', 'Bombero', 2, 1, 1, 'Profesional', '2-9'),
  (167, 'Maximiliano', 'Espinoza', 'Morales', 'Bombero', 3, 1, 1, 'Operativo', '3-9'),
  (168, 'Patricio', 'Soto', 'Rodríguez', 'Bombero', 3, 1, 0, 'Operativo', '3-9'),
  (169, 'Belén', 'Torres', 'Araya', 'Bombero', 4, 0, 1, 'Operativo', '4-9'),
  (170, 'Javiera', 'Tapia', 'Jara', 'Bombero', 2, 0, 0, 'Profesional', '2-9'),
  (171, 'Daniela', 'Vergara', 'Rivera', 'Bombero', 4, 1, 1, 'Inicial', '4-9'),
  (172, 'Victoria', 'Fernández', 'Herrera', 'Bombero', 1, 1, 0, 'Operativo', '1-9'),
  (173, 'Carolina', 'Hernández', 'Pérez', 'Bombero', 4, 0, 1, 'Profesional', '4-9'),
  (174, 'Iván', 'Rojas', 'Silva', 'Bombero', 2, 0, 1, 'Operativo', '2-9'),
  (175, 'Simón', 'Rojas', 'Espinoza', 'Bombero', 1, 1, 1, 'Operativo', '1-9'),
  (176, 'Natalia', 'Soto', 'González', 'Bombero', 3, 1, 1, 'Profesional', '3-9'),
  (177, 'Javiera', 'Hernández', 'Rodríguez', 'Bombero', 2, 1, 1, 'Profesional', '2-9'),
  (178, 'Valentina', 'Hernández', 'Fuentes', 'Bombero', 3, 1, 0, 'Inicial', '3-9'),
  (179, 'Martina', 'Castillo', 'Contreras', 'Bombero', 1, 0, 0, 'Profesional', '1-9'),
  (180, 'Antonia', 'Sepúlveda', 'Castro', 'Bombero', 3, 1, 1, 'Operativo', '3-9'),
  (181, 'Tomás', 'Carrasco', 'Araya', 'Bombero', 3, 0, 0, 'Operativo', '3-9'),
  (182, 'Rocío', 'Álvarez', 'Díaz', 'Bombero', 3, 0, 0, 'Inicial', '3-9'),
  (183, 'Rodrigo', 'Fuentes', 'Núñez', 'Bombero', 2, 1, 0, 'Inicial', '2-9'),
  (184, 'Maximiliano', 'Ramírez', 'Castillo', 'Bombero', 1, 1, 1, 'Profesional', '1-9'),
  (185, 'Camilo', 'Castillo', 'Rodríguez', 'Bombero', 1, 1, 0, 'Operativo', '1-9'),
  (186, 'Valentina', 'Torres', 'Fuentes', 'Bombero', 1, 1, 0, 'Inicial', '1-9'),
  (187, 'Antonia', 'Pérez', 'Díaz', 'Bombero', 3, 0, 1, 'Operativo', '3-9'),
  (188, 'Leonardo', 'Álvarez', 'Gutiérrez', 'Bombero', 1, 0, 1, 'Profesional', '1-9'),
  (189, 'Matías', 'Rodríguez', 'Torres', '3Teniente', 1, 1, 1, 'Profesional', '1-3'),
  (190, 'David', 'Ramírez', 'Fuentes', 'Bombero', 2, 0, 1, 'Profesional', '2-9'),
  (191, 'Simón', 'Vergara', 'Núñez', 'Bombero', 1, 1, 1, 'Inicial', '1-9'),
  (192, 'Gabriel', 'Tapia', 'Reyes', 'Bombero', 3, 0, 0, 'Operativo', '3-9'),
  (193, 'Francisco', 'Morales', 'Bravo', 'Bombero', 3, 1, 1, 'Operativo', '3-9'),
  (194, 'Ignacio', 'Figueroa', 'Vargas', 'Bombero', 3, 0, 0, 'Inicial', '3-9'),
  (195, 'Daniela', 'Cortés', 'Bravo', 'Bombero', 3, 1, 0, 'Operativo', '3-9'),
  (196, 'Martín', 'Pérez', 'Castro', 'Bombero', 3, 0, 0, 'Profesional', '3-9'),
  (197, 'Camilo', 'Rodríguez', 'Díaz', 'Bombero', 1, 0, 1, 'Inicial', '1-9'),
  (198, 'Pedro', 'Castro', 'Jara', 'Bombero', 3, 1, 0, 'Profesional', '3-9'),
  (199, 'Simón', 'Muñoz', 'Valenzuela', 'Bombero', 4, 1, 0, 'Profesional', '4-9'),
  (200, 'Martina', 'Núñez', 'Rivera', 'Bombero', 4, 0, 1, 'Profesional', '4-9'),
  (201, 'Lorenzo', 'Bravo', 'Bravo', 'Capitán', 2, 1, 1, 'Operativo', 'M-2'),
  (202, 'Maximiliano', 'Reyes', 'Fuentes', 'Bombero', 4, 0, 1, 'Operativo', '4-9'),
  (203, 'Benjamín', 'Morales', 'Fernández', 'Bombero', 2, 1, 0, 'Profesional', '2-9'),
  (204, 'Jorge', 'Riquelme', 'Araya', 'Bombero', 2, 0, 0, 'Inicial', '2-9'),
  (205, 'Rodrigo', 'Fernández', 'Reyes', '2Teniente', 2, 1, 1, 'Operativo', '2-2'),
  (206, 'Gabriel', 'Soto', 'Carrasco', 'Bombero', 4, 0, 1, 'Profesional', '4-9'),
  (207, 'Martina', 'Figueroa', 'Morales', 'Bombero', 2, 1, 1, 'Operativo', '2-9'),
  (208, 'Pedro', 'Contreras', 'Sepúlveda', 'Bombero', 1, 0, 0, 'Operativo', '1-9'),
  (209, 'Emilia', 'Fernández', 'Ramírez', 'Bombero', 2, 1, 1, 'Operativo', '2-9'),
  (210, 'Gabriel', 'Silva', 'Jara', 'Bombero', 2, 1, 0, 'Operativo', '2-9'),
  (211, 'Daniela', 'Rodríguez', 'Álvarez', '3Teniente', 3, 1, 1, 'Profesional', '3-3'),
  (212, 'Antonia', 'Álvarez', 'Jara', 'Bombero', 1, 1, 1, 'Profesional', '1-9'),
  (213, 'Francisco', 'Castro', 'Araya', 'Bombero', 1, 0, 1, 'Profesional', '1-9'),
  (214, 'Francisca', 'Jara', 'Gómez', 'Bombero', 2, 0, 1, 'Inicial', '2-9'),
  (215, 'Lorenzo', 'Tapia', 'Sepúlveda', 'Bombero', 4, 0, 1, 'Operativo', '4-9'),
  (216, 'Daniela', 'Tapia', 'Muñoz', 'Bombero', 4, 0, 0, 'Operativo', '4-9'),
  (217, 'Laura', 'Flores', 'Castillo', 'Bombero', 1, 0, 0, 'Operativo', '1-9'),
  (218, 'Amanda', 'Espinoza', 'Cortés', 'Bombero', 4, 1, 1, 'Profesional', '4-9'),
  (219, 'Natalia', 'Gómez', 'Pérez', 'Bombero', 1, 1, 0, 'Operativo', '1-9'),
  (220, 'Leonardo', 'Sepúlveda', 'López', 'Bombero', 3, 0, 1, 'Profesional', '3-9'),
  (221, 'Rodrigo', 'Vergara', 'Núñez', 'Bombero', 1, 1, 0, 'Operativo', '1-9'),
  (222, 'Pedro', 'Núñez', 'Reyes', 'Bombero', 2, 0, 1, 'Profesional', '2-9'),
  (223, 'Sebastián', 'Espinoza', 'Riquelme', 'Bombero', 2, 1, 0, 'Operativo', '2-9'),
  (224, 'Antonia', 'Rivera', 'Silva', 'Bombero', 2, 0, 0, 'Operativo', '2-9'),
  (225, 'Benjamín', 'Sánchez', 'Araya', 'Capitán', 1, 1, 1, 'Profesional', 'M-1'),
  (226, 'Josefina', 'Núñez', 'Torres', 'Bombero', 2, 1, 0, 'Operativo', '2-9'),
  (227, 'Ignacio', 'Gómez', 'Castro', 'Bombero', 2, 1, 0, 'Operativo', '2-9'),
  (228, 'Santiago', 'Torres', 'Flores', 'Bombero', 2, 1, 1, 'Inicial', '2-9'),
  (229, 'Belén', 'Morales', 'Vergara', 'Bombero', 4, 0, 0, 'Profesional', '4-9'),
  (230, 'Santiago', 'Sánchez', 'Díaz', 'Bombero', 1, 1, 0, 'Operativo', '1-9'),
  (231, 'Lorenzo', 'Ramírez', 'González', 'Bombero', 1, 1, 0, 'Inicial', '1-9'),
  (232, 'Sebastián', 'Torres', 'Castillo', 'Bombero', 1, 1, 1, 'Operativo', '1-9'),
  (233, 'Rodrigo', 'Castillo', 'Morales', 'Bombero', 1, 0, 0, 'Operativo', '1-9'),
  (234, 'Simón', 'Araya', 'Flores', 'Bombero', 1, 0, 1, 'Inicial', '1-9'),
  (235, 'Tomás', 'Álvarez', 'Muñoz', 'Bombero', 3, 1, 1, 'Operativo', '3-9'),
  (236, 'David', 'Gutiérrez', 'Araya', 'Bombero', 1, 1, 1, 'Operativo', '1-9'),
  (237, 'Francisco', 'Díaz', 'Castro', 'Bombero', 4, 1, 1, 'Profesional', '4-9'),
  (238, 'Matías', 'Pérez', 'Morales', '2Teniente', 3, 1, 1, 'Profesional', '3-2'),
  (239, 'Antonia', 'Castro', 'Torres', 'Bombero', 3, 0, 1, 'Operativo', '3-9'),
  (240, 'Sebastián', 'Rodríguez', 'Martínez', 'Bombero', 3, 1, 0, 'Profesional', '3-9'),
  (241, 'Antonia', 'Muñoz', 'Vásquez', 'Bombero', 4, 1, 0, 'Operativo', '4-9'),
  (242, 'Jorge', 'Rojas', 'Díaz', 'Bombero', 1, 0, 0, 'Operativo', '1-9'),
  (243, 'Rocío', 'Silva', 'Sepúlveda', 'Bombero', 1, 0, 1, 'Operativo', '1-9'),
  (244, 'Amanda', 'Hernández', 'Rodríguez', 'Bombero', 1, 1, 0, 'Operativo', '1-9'),
  (245, 'Catalina', 'Sánchez', 'Vásquez', 'Bombero', 1, 0, 0, 'Profesional', '1-9'),
  (246, 'Belén', 'Martínez', 'Castillo', 'Bombero', 1, 0, 0, 'Profesional', '1-9'),
  (247, 'Josefina', 'Álvarez', 'Vergara', 'Bombero', 4, 0, 1, 'Operativo', '4-9'),
  (248, 'Rodrigo', 'Vergara', 'Silva', 'Bombero', 4, 1, 1, 'Operativo', '4-9'),
  (249, 'Lorenzo', 'Gómez', 'González', 'Bombero', 2, 1, 0, 'Profesional', '2-9'),
  (250, 'Amanda', 'Pérez', 'Martínez', 'Bombero', 1, 0, 1, 'Profesional', '1-9'),
  (251, 'Valentina', 'Reyes', 'Cortés', 'Bombero', 1, 0, 1, 'Operativo', '1-9'),
  (252, 'Antonia', 'Castro', 'Vargas', 'Bombero', 1, 0, 0, 'Profesional', '1-9'),
  (253, 'Pedro', 'Núñez', 'Morales', 'Bombero', 1, 0, 0, 'Operativo', '1-9'),
  (254, 'Gabriel', 'Torres', 'Fuentes', 'Bombero', 3, 1, 1, 'Inicial', '3-9'),
  (255, 'Benjamín', 'Morales', 'Araya', 'Bombero', 4, 0, 0, 'Profesional', '4-9'),
  (256, 'Camila', 'Figueroa', 'Torres', 'Bombero', 3, 1, 0, 'Operativo', '3-9'),
  (257, 'Víctor', 'Rodríguez', 'Bravo', 'Bombero', 4, 1, 0, 'Operativo', '4-9'),
  (258, 'Simón', 'Castillo', 'Núñez', 'Bombero', 3, 0, 0, 'Operativo', '3-9'),
  (259, 'David', 'Gómez', 'Muñoz', 'Bombero', 4, 0, 0, 'Profesional', '4-9'),
  (260, 'Matías', 'Rodríguez', 'Sánchez', 'Bombero', 3, 0, 0, 'Operativo', '3-9'),
  (261, 'Agustín', 'Martínez', 'Carrasco', 'Bombero', 1, 0, 0, 'Profesional', '1-9'),
  (262, 'Víctor', 'Castillo', 'Rivera', 'Bombero', 1, 0, 0, 'Operativo', '1-9'),
  (263, 'Antonia', 'Espinoza', 'Jara', 'Bombero', 1, 1, 1, 'Operativo', '1-9'),
  (264, 'Josefina', 'Rojas', 'Silva', 'Bombero', 3, 0, 1, 'Operativo', '3-9'),
  (265, 'David', 'González', 'Castro', 'Bombero', 3, 0, 0, 'Profesional', '3-9'),
  (266, 'Ricardo', 'Espinoza', 'Contreras', '1Teniente', 3, 1, 1, 'Operativo', '3-1'),
  (267, 'Antonia', 'Sánchez', 'Hernández', 'Bombero', 1, 1, 0, 'Inicial', '1-9'),
  (268, 'Jorge', 'Rojas', 'Morales', 'Capitán', 3, 1, 1, 'Profesional', 'M-3'),
  (269, 'Belén', 'Sepúlveda', 'Álvarez', 'Bombero', 2, 1, 0, 'Profesional', '2-9'),
  (270, 'Agustín', 'Martínez', 'Vergara', 'Bombero', 2, 1, 0, 'Inicial', '2-9'),
  (271, 'Rocío', 'Pérez', 'Díaz', 'Bombero', 3, 0, 0, 'Operativo', '3-9'),
  (272, 'David', 'Riquelme', 'Riquelme', '3Teniente', 2, 1, 1, 'Operativo', '2-3'),
  (273, 'Ricardo', 'Jara', 'Hernández', 'Bombero', 4, 0, 1, 'Inicial', '4-9'),
  (274, 'Marcelo', 'Fernández', 'Fernández', 'Bombero', 2, 0, 0, 'Inicial', '2-9'),
  (275, 'Laura', 'Martínez', 'Espinoza', 'Bombero', 2, 0, 0, 'Operativo', '2-9'),
  (276, 'Victoria', 'Sánchez', 'Sepúlveda', 'Bombero', 1, 0, 0, 'Operativo', '1-9'),
  (277, 'Patricio', 'Contreras', 'Sánchez', 'Bombero', 4, 1, 0, 'Operativo', '4-9'),
  (278, 'Victoria', 'Díaz', 'Díaz', 'Bombero', 3, 1, 0, 'Profesional', '3-9'),
  (279, 'Josefina', 'Riquelme', 'Torres', 'Bombero', 2, 1, 0, 'Operativo', '2-9'),
  (280, 'Camila', 'Núñez', 'Díaz', 'Bombero', 1, 1, 1, 'Operativo', '1-9'),
  (281, 'Jorge', 'Torres', 'Gómez', 'Bombero', 4, 0, 0, 'Profesional', '4-9'),
  (282, 'Matías', 'López', 'Núñez', 'Bombero', 1, 0, 1, 'Operativo', '1-9'),
  (283, 'Simón', 'Torres', 'Castillo', 'Bombero', 4, 1, 0, 'Operativo', '4-9'),
  (284, 'Ignacio', 'González', 'Muñoz', 'Bombero', 4, 0, 1, 'Inicial', '4-9'),
  (285, 'Víctor', 'Valenzuela', 'González', 'Bombero', 1, 0, 1, 'Operativo', '1-9'),
  (286, 'Camila', 'Vargas', 'Gutiérrez', 'Bombero', 1, 0, 1, 'Profesional', '1-9'),
  (287, 'Rodrigo', 'Núñez', 'Figueroa', 'Bombero', 1, 1, 1, 'Profesional', '1-9'),
  (288, 'Cristóbal', 'López', 'Carrasco', 'Bombero', 4, 0, 1, 'Profesional', '4-9'),
  (289, 'Benjamín', 'Espinoza', 'Fuentes', 'Bombero', 3, 1, 0, 'Inicial', '3-9'),
  (290, 'Belén', 'Soto', 'Contreras', 'Bombero', 2, 1, 0, 'Inicial', '2-9'),
  (291, 'Martín', 'Figueroa', 'Figueroa', 'Bombero', 2, 0, 0, 'Profesional', '2-9'),
  (292, 'Josefina', 'Valenzuela', 'Martínez', 'Bombero', 2, 0, 0, 'Operativo', '2-9'),
  (293, 'Josefina', 'Fernández', 'Morales', 'Bombero', 2, 0, 1, 'Profesional', '2-9'),
  (294, 'Iván', 'Hernández', 'Pérez', 'Bombero', 1, 0, 0, 'Operativo', '1-9'),
  (295, 'Iván', 'Muñoz', 'Herrera', 'Bombero', 3, 0, 0, 'Operativo', '3-9'),
  (296, 'Francisca', 'Fernández', 'Díaz', 'Bombero', 4, 0, 1, 'Profesional', '4-9'),
  (297, 'Pedro', 'Araya', 'Tapia', 'Bombero', 1, 0, 0, 'Inicial', '1-9'),
  (298, 'Camila', 'Reyes', 'González', 'Bombero', 1, 0, 1, 'Operativo', '1-9'),
  (299, 'Francisco', 'Silva', 'Cortés', 'Bombero', 1, 0, 0, 'Inicial', '1-9'),
  (300, 'Francisca', 'Rodríguez', 'Espinoza', 'Bombero', 4, 1, 0, 'Inicial', '4-9'),
  (301, 'Lorenzo', 'Fernández', 'Riquelme', 'Bombero', 3, 1, 1, 'Operativo', '3-9');
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
