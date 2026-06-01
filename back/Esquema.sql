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
    status ENUM('green', 'yellow', 'red', 'blue', 'gray') DEFAULT 'green' COMMENT 'green=disponible en cuartel, yellow=despachado, red=en emergencia, blue=retorno pendiente, gray=no disponible',
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
-- TABLA: incident_victims (Víctimas asociadas a un incidente)
-- ============================================================
CREATE TABLE IF NOT EXISTS incident_victims (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    sex ENUM('female', 'male', 'other', 'not_informed') NOT NULL,
    age INT,
    reason_at_scene TEXT NOT NULL,
    injury_type ENUM('minor', 'serious', 'fatal', 'not_informed') NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    INDEX idx_incident (incident_id),
    INDEX idx_injury_type (injury_type)
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
        'victims_reported',
        'personel_asigned',
        'other',
        'incident_closed',
        'A_evaluacion_incidente',
        'A_nueva_clave',
        'A_instrucciones',
        'A_comandante',
        'A_externos',
        'A_informacion',
        'A_victimas'
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
        -- CLAVE X: INCENDIO DECLARADO
        ('X-1', 'INCENDIO DECLARADO',
        'Incendio declarado', 3, 12, '.../.-', 1),
        
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

        ('2-4', 'INCENDIO EN VERTEDERO, MICRO BASURALES, BASUREROS',
        'Incendio en vertedero, micro basurales o basureros',2, 8, '..-/.--', 3),

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
-- DATOS INICIALES - REGLAS DE DESPACHO BORRAR DESPUES
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

-- ===========================================================
-- DATOS OFICIALES - BOMBEROS PERSONEL
-- ============================================================
-- dispoible: 1: disponible 0:no disponible 2:fuera de turno

INSERT INTO personnel (external_id, first_name, last_name_1, last_name_2, rank, station_id, can_rescue, can_hazmat, level, radio_code, disponible) VALUES
  (2, 'Cristóbal', 'Morales', 'Flores', 'Bombero', 1, 1, 1, 'Profesional', '1-9',1),
  (3, 'Natalia', 'Vergara', 'Castro', 'Bombero', 2, 0, 0, 'Profesional', '2-9',1),
  (4, 'Martina', 'Valenzuela', 'Gómez', 'Bombero', 3, 1, 1, 'Operativo', '3-9',1),
  (5, 'Natalia', 'Morales', 'Ramírez', 'Bombero', 4, 0, 1, 'Profesional', '4-9',1),
  (6, 'Amanda', 'Núñez', 'Herrera', 'Bombero', 1, 0, 0, 'Operativo', '1-9',1),
  (7, 'Gabriel', 'Fernández', 'Espinoza', 'Bombero', 3, 0, 1, 'Operativo', '3-9',1),
  (8, 'Camila', 'Torres', 'Martínez', 'Bombero', 1, 0, 1, 'Profesional', '1-9',1),
  (9, 'Lorenzo', 'Rodríguez', 'Torres', 'Bombero', 1, 1, 1, 'Operativo', '1-9',1),
  (10, 'Benjamín', 'Martínez', 'González', 'Bombero', 1, 0, 1, 'Inicial', '1-9',1),
  (11, 'Antonia', 'Flores', 'Ramírez', 'Bombero', 3, 0, 0, 'Inicial', '3-9',1),
  (12, 'Carolina', 'Núñez', 'Fuentes', 'Bombero', 3, 1, 1, 'Profesional', '3-9',1),
  (13, 'Iván', 'Torres', 'Espinoza', 'Bombero', 4, 0, 1, 'Profesional', '4-9',1),
  (14, 'Iván', 'Ramírez', 'Díaz', 'Bombero', 1, 0, 0, 'Operativo', '1-9',1),
  (15, 'Simón', 'Fernández', 'Espinoza', 'Bombero', 3, 0, 1, 'Operativo', '3-9',1),
  (16, 'Sebastián', 'López', 'Silva', 'Bombero', 1, 1, 1, 'Operativo', '1-9',1),
  (17, 'Iván', 'Jara', 'Sánchez', 'Bombero', 2, 0, 1, 'Inicial', '2-9',1),
  (18, 'Rocío', 'Rojas', 'Valenzuela', 'Bombero', 2, 0, 1, 'Inicial', '2-9',1),
  (19, 'Amanda', 'Vásquez', 'Torres', '1Teniente', 4, 1, 1, 'Profesional', '4-1',1),
  (20, 'Ignacio', 'Espinoza', 'Álvarez', 'Bombero', 3, 1, 1, 'Operativo', '3-9',1),
  (21, 'Catalina', 'Valenzuela', 'Silva', 'Bombero', 3, 1, 0, 'Operativo', '3-9',1),
  (22, 'Marcelo', 'Vásquez', 'Soto', 'Bombero', 2, 0, 0, 'Profesional', '2-9',1),
  (23, 'Rosario', 'Díaz', 'Morales', 'Bombero', 1, 0, 1, 'Inicial', '1-9',1),
  (24, 'Agustín', 'Reyes', 'Figueroa', 'Bombero', 1, 1, 1, 'Profesional', '1-9',1),
  (25, 'Iván', 'Vásquez', 'Rodríguez', 'Bombero', 3, 0, 0, 'Profesional', '3-9',1),
  (26, 'Santiago', 'Muñoz', 'Hernández', 'Bombero', 3, 1, 0, 'Operativo', '3-9',1),
  (27, 'Maximiliano', 'Torres', 'Rojas', 'Bombero', 4, 0, 0, 'Operativo', '4-9',1),
  (28, 'Patricio', 'Álvarez', 'Carrasco', 'Bombero', 2, 0, 1, 'Inicial', '2-9',1),
  (29, 'Francisca', 'Muñoz', 'Hernández', 'Bombero', 3, 1, 1, 'Inicial', '3-9',1),
  (30, 'Francisco', 'Rojas', 'Vásquez', 'Bombero', 3, 1, 0, 'Operativo', '3-9',1),
  (31, 'Maximiliano', 'Torres', 'Álvarez', 'Bombero', 3, 1, 1, 'Operativo', '3-9',1),
  (32, 'Juan', 'Silva', 'Díaz', 'Bombero', 1, 0, 0, 'Profesional', '1-9',1),
  (33, 'Fernanda', 'Vásquez', 'Herrera', 'Bombero', 1, 0, 0, 'Profesional', '1-9',1),
  (34, 'Patricio', 'Silva', 'Cortés', 'Bombero', 2, 1, 1, 'Operativo', '2-9',1),
  (35, 'Camilo', 'Bravo', 'Pérez', 'Bombero', 2, 1, 0, 'Profesional', '2-9',1),
  (36, 'Maximiliano', 'Tapia', 'Díaz', 'Bombero', 3, 0, 0, 'Operativo', '3-9',1),
  (37, 'Laura', 'Morales', 'Valenzuela', 'Bombero', 1, 1, 0, 'Profesional', '1-9',1),
  (38, 'Gabriel', 'González', 'Sepúlveda', 'Bombero', 4, 0, 0, 'Operativo', '4-9',1),
  (39, 'Daniela', 'Reyes', 'Rojas', 'Bombero', 1, 1, 0, 'Inicial', '1-9',1),
  (40, 'Cristóbal', 'Riquelme', 'Figueroa', 'Bombero', 3, 1, 0, 'Inicial', '3-9',1),
  (41, 'Rosario', 'Riquelme', 'Álvarez', 'Bombero', 3, 1, 1, 'Operativo', '3-9',1),
  (42, 'Leonardo', 'Herrera', 'Gutiérrez', 'Capitán', 4, 1, 1, 'Operativo', 'M-4',1),
  (43, 'Catalina', 'Rojas', 'Valenzuela', 'Bombero', 2, 0, 1, 'Operativo', '2-9',1),
  (44, 'Marcelo', 'Espinoza', 'Hernández', 'Bombero', 3, 0, 0, 'Inicial', '3-9',1),
  (45, 'Lorenzo', 'Hernández', 'Carrasco', 'Bombero', 3, 0, 0, 'Operativo', '3-9',1),
  (46, 'Patricio', 'Valenzuela', 'Ramírez', 'Bombero', 3, 1, 0, 'Inicial', '3-9',1),
  (47, 'Benjamín', 'Martínez', 'Fuentes', 'Bombero', 1, 0, 1, 'Operativo', '1-9',1),
  (48, 'Juan', 'Espinoza', 'Araya', 'Bombero', 3, 1, 0, 'Operativo', '3-9',1),
  (49, 'Fernanda', 'Ramírez', 'Vásquez', 'Bombero', 1, 1, 1, 'Profesional', '1-9',1),
  (50, 'Javiera', 'González', 'Espinoza', 'Bombero', 2, 0, 1, 'Operativo', '2-9',1),
  (51, 'Santiago', 'Soto', 'Martínez', 'Bombero', 4, 0, 1, 'Inicial', '4-9',1),
  (52, 'Sebastián', 'Riquelme', 'Contreras', 'Bombero', 4, 1, 0, 'Profesional', '4-9',1),
  (53, 'Tomás', 'Fernández', 'Jara', 'Bombero', 3, 0, 1, 'Operativo', '3-9',1),
  (54, 'Rodrigo', 'Jara', 'Valenzuela', 'Bombero', 3, 1, 1, 'Operativo', '3-9',1),
  (55, 'Víctor', 'Pérez', 'Torres', 'Bombero', 2, 1, 1, 'Operativo', '2-9',1),
  (56, 'Ricardo', 'Gómez', 'Bravo', '1Teniente', 1, 0, 1, 'Profesional', '1-1',1),
  (57, 'Antonia', 'Silva', 'Vargas', 'Bombero', 1, 1, 0, 'Operativo', '1-9',1),
  (58, 'Rocío', 'Valenzuela', 'Bravo', 'Bombero', 4, 0, 1, 'Inicial', '4-9',1),
  (59, 'Fernanda', 'Jara', 'Reyes', 'Bombero', 1, 0, 1, 'Operativo', '1-9',1),
  (60, 'Juan', 'Espinoza', 'Hernández', 'Bombero', 3, 0, 0, 'Operativo', '3-9',1),
  (61, 'Josefina', 'Vásquez', 'López', 'Bombero', 4, 0, 1, 'Operativo', '4-9',1),
  (62, 'Matías', 'Álvarez', 'Castillo', 'Bombero', 1, 1, 1, 'Inicial', '1-9',1),
  (63, 'Francisca', 'Jara', 'Vásquez', 'Bombero', 3, 0, 1, 'Operativo', '3-9',1),
  (64, 'Belén', 'Torres', 'Díaz', 'Bombero', 4, 1, 1, 'Operativo', '4-9',1),
  (65, 'Maximiliano', 'Vásquez', 'Figueroa', 'Bombero', 2, 0, 1, 'Inicial', '2-9',1),
  (66, 'Josefina', 'Sepúlveda', 'Tapia', 'Bombero', 2, 1, 0, 'Operativo', '2-9',1),
  (67, 'Josefina', 'Castro', 'Herrera', 'Bombero', 4, 1, 0, 'Inicial', '4-9',1),
  (68, 'Victoria', 'Martínez', 'Cortés', 'Bombero', 4, 1, 1, 'Operativo', '4-9',1),
  (69, 'Sebastián', 'Araya', 'Araya', 'Bombero', 3, 0, 1, 'Profesional', '3-9',1),
  (70, 'Pedro', 'Reyes', 'Rojas', 'Bombero', 1, 1, 0, 'Operativo', '1-9',1),
  (71, 'Agustín', 'Vargas', 'Riquelme', 'Bombero', 3, 0, 1, 'Operativo', '3-9',1),
  (72, 'Francisco', 'Vargas', 'Morales', 'Bombero', 3, 0, 0, 'Inicial', '3-9',1),
  (73, 'Ricardo', 'Díaz', 'Pérez', 'Bombero', 3, 0, 1, 'Inicial', '3-9',1),
  (74, 'Matías', 'Tapia', 'Rivera', 'Bombero', 3, 0, 1, 'Profesional', '3-9',1),
  (75, 'Ricardo', 'Pérez', 'Herrera', 'Bombero', 2, 1, 1, 'Profesional', '2-9',1),
  (76, 'Victoria', 'Rodríguez', 'Núñez', 'Bombero', 3, 1, 0, 'Profesional', '3-9',1),
  (77, 'Natalia', 'López', 'Espinoza', 'Bombero', 2, 0, 1, 'Inicial', '2-9',1),
  (78, 'Francisco', 'González', 'Contreras', 'Bombero', 2, 0, 1, 'Inicial', '2-9',1),
  (79, 'Valentina', 'Cortés', 'González', 'Bombero', 3, 1, 1, 'Operativo', '3-9',1),
  (80, 'Ricardo', 'Pérez', 'López', 'Bombero', 1, 0, 1, 'Operativo', '1-9',1),
  (81, 'Cristóbal', 'Sánchez', 'Vásquez', 'Bombero', 1, 0, 0, 'Operativo', '1-9',1),
  (82, 'Francisca', 'Castillo', 'Cortés', 'Bombero', 1, 0, 0, 'Operativo', '1-9',1),
  (83, 'Antonia', 'Rojas', 'Rojas', 'Bombero', 1, 0, 0, 'Inicial', '1-9',1),
  (84, 'Cristóbal', 'Reyes', 'Carrasco', 'Bombero', 4, 1, 1, 'Operativo', '4-9',1),
  (85, 'Maximiliano', 'Rivera', 'Castro', 'Bombero', 1, 0, 1, 'Operativo', '1-9',1),
  (86, 'Gabriel', 'Riquelme', 'Vergara', 'Bombero', 3, 0, 1, 'Inicial', '3-9',1),
  (87, 'Daniela', 'Torres', 'Martínez', 'Bombero', 2, 1, 0, 'Operativo', '2-9',1),
  (88, 'Francisco', 'Fuentes', 'Rodríguez', 'Bombero', 4, 0, 1, 'Inicial', '4-9',1),
  (89, 'Camilo', 'Sepúlveda', 'Hernández', 'Bombero', 1, 0, 0, 'Operativo', '1-9',1),
  (90, 'Valentina', 'Jara', 'Vargas', 'Bombero', 2, 0, 0, 'Inicial', '2-9',1),
  (91, 'Valentina', 'Rivera', 'Jara', 'Bombero', 2, 1, 1, 'Profesional', '2-9',1),
  (92, 'Juan', 'Silva', 'Araya', 'Bombero', 3, 0, 0, 'Inicial', '3-9',1),
  (93, 'Juan', 'Fernández', 'Ramírez', 'Bombero', 2, 0, 1, 'Operativo', '2-9',1),
  (94, 'Sebastián', 'Sepúlveda', 'Castro', 'Bombero', 3, 0, 1, 'Operativo', '3-9',1),
  (95, 'Pedro', 'Riquelme', 'Soto', 'Bombero', 2, 1, 0, 'Operativo', '2-9',1),
  (96, 'Catalina', 'Sánchez', 'Álvarez', 'Bombero', 4, 0, 0, 'Profesional', '4-9',1),
  (97, 'Emilia', 'González', 'Herrera', 'Bombero', 3, 0, 1, 'Inicial', '3-9',1),
  (98, 'Simón', 'Torres', 'Jara', 'Bombero', 4, 0, 1, 'Operativo', '4-9',1),
  (99, 'Jorge', 'Núñez', 'Díaz', 'Bombero', 4, 1, 0, 'Profesional', '4-9',1),
  (100, 'Camila', 'Sepúlveda', 'Rojas', 'Bombero', 3, 0, 0, 'Profesional', '3-9',1),
  (101, 'Rosario', 'Contreras', 'Sánchez', 'Bombero', 4, 0, 0, 'Profesional', '4-9',1),
  (102, 'Rocío', 'Vásquez', 'Martínez', 'Bombero', 1, 1, 0, 'Profesional', '1-9',1),
  (103, 'Camila', 'Pérez', 'Gómez', 'Bombero', 4, 0, 0, 'Operativo', '4-9',1),
  (104, 'David', 'Sepúlveda', 'Silva', 'Bombero', 3, 1, 1, 'Operativo', '3-9',1),
  (105, 'Antonia', 'Ramírez', 'Flores', 'Bombero', 2, 1, 1, 'Operativo', '2-9',1),
  (106, 'Javiera', 'Cortés', 'Riquelme', 'Bombero', 4, 0, 0, 'Operativo', '4-9',1),
  (107, 'Laura', 'Araya', 'Bravo', 'Bombero', 3, 0, 1, 'Profesional', '3-9',1),
  (108, 'Ignacio', 'Torres', 'Tapia', 'Bombero', 3, 0, 1, 'Profesional', '3-9',1),
  (109, 'Rodrigo', 'Bravo', 'Vásquez', 'Bombero', 2, 0, 0, 'Profesional', '2-9',1),
  (110, 'Camila', 'Vásquez', 'Fuentes', 'Bombero', 4, 0, 0, 'Operativo', '4-9',1),
  (111, 'Pedro', 'López', 'Álvarez', 'Bombero', 1, 1, 0, 'Operativo', '1-9',1),
  (112, 'Javiera', 'Rivera', 'Vargas', 'Bombero', 4, 1, 0, 'Operativo', '4-9',1),
  (113, 'Camila', 'Castillo', 'Soto', 'Bombero', 2, 1, 0, 'Operativo', '2-9',1),
  (114, 'Gabriel', 'Fernández', 'Castillo', 'Bombero', 4, 1, 0, 'Operativo', '4-9',1),
  (115, 'Martina', 'Jara', 'Vásquez', 'Bombero', 2, 1, 0, 'Operativo', '2-9',1),
  (116, 'Marcelo', 'Figueroa', 'Sánchez', 'Bombero', 4, 0, 0, 'Operativo', '4-9',1),
  (117, 'Ricardo', 'Bravo', 'Morales', 'Bombero', 2, 1, 0, 'Inicial', '2-9',1),
  (118, 'Martín', 'Castillo', 'Rojas', 'Bombero', 2, 0, 0, 'Operativo', '2-9',1),
  (119, 'Benjamín', 'Vargas', 'Fuentes', 'Bombero', 4, 1, 1, 'Inicial', '4-9',1),
  (120, 'Martín', 'Contreras', 'Díaz', 'Bombero', 2, 1, 0, 'Profesional', '2-9',1),
  (121, 'Santiago', 'Contreras', 'Flores', 'Bombero', 3, 1, 0, 'Inicial', '3-9',1),
  (122, 'Camilo', 'Vergara', 'Morales', 'Bombero', 4, 1, 0, 'Profesional', '4-9',1),
  (123, 'Emilia', 'Morales', 'Pérez', 'Bombero', 4, 0, 0, 'Inicial', '4-9',1),
  (124, 'Lorenzo', 'Flores', 'Pérez', 'Bombero', 3, 0, 0, 'Profesional', '3-9',1),
  (125, 'Camila', 'Flores', 'Gutiérrez', 'Bombero', 4, 0, 0, 'Operativo', '4-9',1),
  (126, 'Amanda', 'Valenzuela', 'Valenzuela', 'Bombero', 1, 0, 0, 'Inicial', '1-9',1),
  (127, 'Javiera', 'Gómez', 'Tapia', 'Bombero', 2, 1, 1, 'Profesional', '2-9',1),
  (128, 'Martín', 'Núñez', 'Torres', 'Bombero', 4, 0, 0, 'Operativo', '4-9',1),
  (129, 'Agustín', 'Araya', 'Gómez', '2Teniente', 1, 1, 1, 'Operativo', '1-2',1),
  (130, 'Gabriel', 'Valenzuela', 'Reyes', 'Bombero', 1, 1, 0, 'Operativo', '1-9',1),
  (131, 'Antonia', 'Carrasco', 'Vargas', 'Bombero', 2, 0, 1, 'Operativo', '2-9',1),
  (132, 'Jorge', 'Castro', 'Muñoz', 'Bombero', 2, 0, 0, 'Profesional', '2-9',1),
  (133, 'Josefina', 'Vásquez', 'Muñoz', 'Bombero', 2, 0, 0, 'Profesional', '2-9',1),
  (134, 'Iván', 'Soto', 'López', 'Bombero', 4, 1, 1, 'Inicial', '4-9',1),
  (135, 'Antonia', 'Valenzuela', 'Sepúlveda', 'Bombero', 3, 1, 1, 'Profesional', '3-9',1),
  (136, 'Benjamín', 'Rodríguez', 'Herrera', 'Bombero', 2, 0, 0, 'Operativo', '2-9',1),
  (137, 'Joaquín', 'Gutiérrez', 'Bravo', '2Teniente', 4, 1, 1, 'Profesional', '4-2',1),
  (138, 'Agustín', 'Fernández', 'Núñez', 'Bombero', 2, 0, 1, 'Operativo', '2-9',1),
  (139, 'Rocío', 'Hernández', 'Gómez', 'Bombero', 4, 0, 1, 'Inicial', '4-9',1),
  (140, 'Maximiliano', 'Rivera', 'Pérez', 'Bombero', 2, 0, 1, 'Profesional', '2-9',1),
  (141, 'Antonia', 'Gómez', 'Rojas', 'Bombero', 2, 0, 1, 'Operativo', '2-9',1),
  (142, 'Víctor', 'Castro', 'Contreras', '3Teniente', 4, 1, 1, 'Profesional', '4-3',1),
  (143, 'Patricio', 'Jara', 'Rodríguez', 'Bombero', 4, 1, 0, 'Profesional', '4-9',1),
  (144, 'Natalia', 'Núñez', 'Vargas', 'Bombero', 3, 0, 0, 'Profesional', '3-9',1),
  (145, 'Gabriel', 'Vergara', 'Morales', 'Bombero', 2, 1, 1, 'Operativo', '2-9',1),
  (146, 'Maximiliano', 'Flores', 'Jara', 'Bombero', 2, 0, 1, 'Inicial', '2-9',1),
  (147, 'Rocío', 'Fernández', 'Rodríguez', 'Bombero', 2, 1, 0, 'Operativo', '2-9',1),
  (148, 'Martín', 'Rodríguez', 'Torres', 'Bombero', 2, 0, 1, 'Profesional', '2-9',1),
  (149, 'Santiago', 'Araya', 'Valenzuela', 'Bombero', 2, 1, 1, 'Inicial', '2-9',1),
  (150, 'Rodrigo', 'Herrera', 'Vásquez', 'Bombero', 3, 1, 1, 'Operativo', '3-9',1),
  (151, 'Laura', 'Contreras', 'Gómez', 'Bombero', 4, 1, 0, 'Inicial', '4-9',1),
  (152, 'Pedro', 'Riquelme', 'Araya', 'Bombero', 4, 1, 1, 'Profesional', '4-9',1),
  (153, 'Camila', 'Reyes', 'Contreras', 'Bombero', 1, 1, 0, 'Operativo', '1-9',1),
  (154, 'Javiera', 'Contreras', 'Bravo', 'Bombero', 3, 1, 1, 'Operativo', '3-9',1),
  (155, 'Ignacio', 'Morales', 'Riquelme', 'Bombero', 1, 1, 0, 'Operativo', '1-9',1),
  (156, 'Rocío', 'Vergara', 'López', 'Bombero', 4, 0, 1, 'Operativo', '4-9',1),
  (157, 'Juan', 'Riquelme', 'Reyes', 'Bombero', 3, 1, 1, 'Operativo', '3-9',1),
  (158, 'Jorge', 'Díaz', 'Sánchez', 'Bombero', 2, 1, 0, 'Profesional', '2-9',1),
  (159, 'Laura', 'Martínez', 'Contreras', 'Bombero', 4, 1, 1, 'Operativo', '4-9',1),
  (160, 'Juan', 'Vargas', 'Torres', 'Bombero', 4, 1, 1, 'Profesional', '4-9',1),
  (161, 'Camila', 'Hernández', 'Vásquez', 'Bombero', 4, 1, 1, 'Operativo', '4-9',1),
  (162, 'Simón', 'Figueroa', 'Torres', '1Teniente', 2, 1, 1, 'Operativo', '2-1',1),
  (163, 'Marcelo', 'Bravo', 'Castillo', 'Bombero', 3, 1, 0, 'Operativo', '3-9',1),
  (164, 'Antonia', 'Muñoz', 'Herrera', 'Bombero', 4, 0, 0, 'Operativo', '4-9',1),
  (165, 'Rodrigo', 'Carrasco', 'Hernández', 'Bombero', 2, 0, 0, 'Operativo', '2-9',1),
  (166, 'Amanda', 'Vargas', 'Contreras', 'Bombero', 2, 1, 1, 'Profesional', '2-9',1),
  (167, 'Maximiliano', 'Espinoza', 'Morales', 'Bombero', 3, 1, 1, 'Operativo', '3-9',1),
  (168, 'Patricio', 'Soto', 'Rodríguez', 'Bombero', 3, 1, 0, 'Operativo', '3-9',1),
  (169, 'Belén', 'Torres', 'Araya', 'Bombero', 4, 0, 1, 'Operativo', '4-9',1),
  (170, 'Javiera', 'Tapia', 'Jara', 'Bombero', 2, 0, 0, 'Profesional', '2-9',1),
  (171, 'Daniela', 'Vergara', 'Rivera', 'Bombero', 4, 1, 1, 'Inicial', '4-9',1),
  (172, 'Victoria', 'Fernández', 'Herrera', 'Bombero', 1, 1, 0, 'Operativo', '1-9',1),
  (173, 'Carolina', 'Hernández', 'Pérez', 'Bombero', 4, 0, 1, 'Profesional', '4-9',1),
  (174, 'Iván', 'Rojas', 'Silva', 'Bombero', 2, 0, 1, 'Operativo', '2-9',1),
  (175, 'Simón', 'Rojas', 'Espinoza', 'Bombero', 1, 1, 1, 'Operativo', '1-9',1),
  (176, 'Natalia', 'Soto', 'González', 'Bombero', 3, 1, 1, 'Profesional', '3-9',1),
  (177, 'Javiera', 'Hernández', 'Rodríguez', 'Bombero', 2, 1, 1, 'Profesional', '2-9',1),
  (178, 'Valentina', 'Hernández', 'Fuentes', 'Bombero', 3, 1, 0, 'Inicial', '3-9',1),
  (179, 'Martina', 'Castillo', 'Contreras', 'Bombero', 1, 0, 0, 'Profesional', '1-9',1),
  (180, 'Antonia', 'Sepúlveda', 'Castro', 'Bombero', 3, 1, 1, 'Operativo', '3-9',1),
  (181, 'Tomás', 'Carrasco', 'Araya', 'Bombero', 3, 0, 0, 'Operativo', '3-9',1),
  (182, 'Rocío', 'Álvarez', 'Díaz', 'Bombero', 3, 0, 0, 'Inicial', '3-9',1),
  (183, 'Rodrigo', 'Fuentes', 'Núñez', 'Bombero', 2, 1, 0, 'Inicial', '2-9',1),
  (184, 'Maximiliano', 'Ramírez', 'Castillo', 'Bombero', 1, 1, 1, 'Profesional', '1-9',1),
  (185, 'Camilo', 'Castillo', 'Rodríguez', 'Bombero', 1, 1, 0, 'Operativo', '1-9',1),
  (186, 'Valentina', 'Torres', 'Fuentes', 'Bombero', 1, 1, 0, 'Inicial', '1-9',1),
  (187, 'Antonia', 'Pérez', 'Díaz', 'Bombero', 3, 0, 1, 'Operativo', '3-9',1),
  (188, 'Leonardo', 'Álvarez', 'Gutiérrez', 'Bombero', 1, 0, 1, 'Profesional', '1-9',1),
  (189, 'Matías', 'Rodríguez', 'Torres', '3Teniente', 1, 1, 1, 'Profesional', '1-3',1),
  (190, 'David', 'Ramírez', 'Fuentes', 'Bombero', 2, 0, 1, 'Profesional', '2-9',1),
  (191, 'Simón', 'Vergara', 'Núñez', 'Bombero', 1, 1, 1, 'Inicial', '1-9',1),
  (192, 'Gabriel', 'Tapia', 'Reyes', 'Bombero', 3, 0, 0, 'Operativo', '3-9',1),
  (193, 'Francisco', 'Morales', 'Bravo', 'Bombero', 3, 1, 1, 'Operativo', '3-9',1),
  (194, 'Ignacio', 'Figueroa', 'Vargas', 'Bombero', 3, 0, 0, 'Inicial', '3-9',1),
  (195, 'Daniela', 'Cortés', 'Bravo', 'Bombero', 3, 1, 0, 'Operativo', '3-9',1),
  (196, 'Martín', 'Pérez', 'Castro', 'Bombero', 3, 0, 0, 'Profesional', '3-9',1),
  (197, 'Camilo', 'Rodríguez', 'Díaz', 'Bombero', 1, 0, 1, 'Inicial', '1-9',1),
  (198, 'Pedro', 'Castro', 'Jara', 'Bombero', 3, 1, 0, 'Profesional', '3-9',1),
  (199, 'Simón', 'Muñoz', 'Valenzuela', 'Bombero', 4, 1, 0, 'Profesional', '4-9',1),
  (200, 'Martina', 'Núñez', 'Rivera', 'Bombero', 4, 0, 1, 'Profesional', '4-9',1),
  (201, 'Lorenzo', 'Bravo', 'Bravo', 'Capitán', 2, 1, 1, 'Operativo', 'M-2',1),
  (202, 'Maximiliano', 'Reyes', 'Fuentes', 'Bombero', 4, 0, 1, 'Operativo', '4-9',1),
  (203, 'Benjamín', 'Morales', 'Fernández', 'Bombero', 2, 1, 0, 'Profesional', '2-9',1),
  (204, 'Jorge', 'Riquelme', 'Araya', 'Bombero', 2, 0, 0, 'Inicial', '2-9',1),
  (205, 'Rodrigo', 'Fernández', 'Reyes', '2Teniente', 2, 1, 1, 'Operativo', '2-2',1),
  (206, 'Gabriel', 'Soto', 'Carrasco', 'Bombero', 4, 0, 1, 'Profesional', '4-9',1),
  (207, 'Martina', 'Figueroa', 'Morales', 'Bombero', 2, 1, 1, 'Operativo', '2-9',1),
  (208, 'Pedro', 'Contreras', 'Sepúlveda', 'Bombero', 1, 0, 0, 'Operativo', '1-9',1),
  (209, 'Emilia', 'Fernández', 'Ramírez', 'Bombero', 2, 1, 1, 'Operativo', '2-9',1),
  (210, 'Gabriel', 'Silva', 'Jara', 'Bombero', 2, 1, 0, 'Operativo', '2-9',1),
  (211, 'Daniela', 'Rodríguez', 'Álvarez', '3Teniente', 3, 1, 1, 'Profesional', '3-3',1),
  (212, 'Antonia', 'Álvarez', 'Jara', 'Bombero', 1, 1, 1, 'Profesional', '1-9',1),
  (213, 'Francisco', 'Castro', 'Araya', 'Bombero', 1, 0, 1, 'Profesional', '1-9',1),
  (214, 'Francisca', 'Jara', 'Gómez', 'Bombero', 2, 0, 1, 'Inicial', '2-9',1),
  (215, 'Lorenzo', 'Tapia', 'Sepúlveda', 'Bombero', 4, 0, 1, 'Operativo', '4-9',1),
  (216, 'Daniela', 'Tapia', 'Muñoz', 'Bombero', 4, 0, 0, 'Operativo', '4-9',1),
  (217, 'Laura', 'Flores', 'Castillo', 'Bombero', 1, 0, 0, 'Operativo', '1-9',1),
  (218, 'Amanda', 'Espinoza', 'Cortés', 'Bombero', 4, 1, 1, 'Profesional', '4-9',1),
  (219, 'Natalia', 'Gómez', 'Pérez', 'Bombero', 1, 1, 0, 'Operativo', '1-9',1),
  (220, 'Leonardo', 'Sepúlveda', 'López', 'Bombero', 3, 0, 1, 'Profesional', '3-9',1),
  (221, 'Rodrigo', 'Vergara', 'Núñez', 'Bombero', 1, 1, 0, 'Operativo', '1-9',1),
  (222, 'Pedro', 'Núñez', 'Reyes', 'Bombero', 2, 0, 1, 'Profesional', '2-9',1),
  (223, 'Sebastián', 'Espinoza', 'Riquelme', 'Bombero', 2, 1, 0, 'Operativo', '2-9',1),
  (224, 'Antonia', 'Rivera', 'Silva', 'Bombero', 2, 0, 0, 'Operativo', '2-9',1),
  (225, 'Benjamín', 'Sánchez', 'Araya', 'Capitán', 1, 1, 1, 'Profesional', 'M-1',1),
  (226, 'Josefina', 'Núñez', 'Torres', 'Bombero', 2, 1, 0, 'Operativo', '2-9',1),
  (227, 'Ignacio', 'Gómez', 'Castro', 'Bombero', 2, 1, 0, 'Operativo', '2-9',1),
  (228, 'Santiago', 'Torres', 'Flores', 'Bombero', 2, 1, 1, 'Inicial', '2-9',1),
  (229, 'Belén', 'Morales', 'Vergara', 'Bombero', 4, 0, 0, 'Profesional', '4-9',1),
  (230, 'Santiago', 'Sánchez', 'Díaz', 'Bombero', 1, 1, 0, 'Operativo', '1-9',1),
  (231, 'Lorenzo', 'Ramírez', 'González', 'Bombero', 1, 1, 0, 'Inicial', '1-9',1),
  (232, 'Sebastián', 'Torres', 'Castillo', 'Bombero', 1, 1, 1, 'Operativo', '1-9',1),
  (233, 'Rodrigo', 'Castillo', 'Morales', 'Bombero', 1, 0, 0, 'Operativo', '1-9',1),
  (234, 'Simón', 'Araya', 'Flores', 'Bombero', 1, 0, 1, 'Inicial', '1-9',1),
  (235, 'Tomás', 'Álvarez', 'Muñoz', 'Bombero', 3, 1, 1, 'Operativo', '3-9',1),
  (236, 'David', 'Gutiérrez', 'Araya', 'Bombero', 1, 1, 1, 'Operativo', '1-9',1),
  (237, 'Francisco', 'Díaz', 'Castro', 'Bombero', 4, 1, 1, 'Profesional', '4-9',1),
  (238, 'Matías', 'Pérez', 'Morales', '2Teniente', 3, 1, 1, 'Profesional', '3-2',1),
  (239, 'Antonia', 'Castro', 'Torres', 'Bombero', 3, 0, 1, 'Operativo', '3-9',1),
  (240, 'Sebastián', 'Rodríguez', 'Martínez', 'Bombero', 3, 1, 0, 'Profesional', '3-9',1),
  (241, 'Antonia', 'Muñoz', 'Vásquez', 'Bombero', 4, 1, 0, 'Operativo', '4-9',1),
  (242, 'Jorge', 'Rojas', 'Díaz', 'Bombero', 1, 0, 0, 'Operativo', '1-9',1),
  (243, 'Rocío', 'Silva', 'Sepúlveda', 'Bombero', 1, 0, 1, 'Operativo', '1-9',1),
  (244, 'Amanda', 'Hernández', 'Rodríguez', 'Bombero', 1, 1, 0, 'Operativo', '1-9',1),
  (245, 'Catalina', 'Sánchez', 'Vásquez', 'Bombero', 1, 0, 0, 'Profesional', '1-9',1),
  (246, 'Belén', 'Martínez', 'Castillo', 'Bombero', 1, 0, 0, 'Profesional', '1-9',1),
  (247, 'Josefina', 'Álvarez', 'Vergara', 'Bombero', 4, 0, 1, 'Operativo', '4-9',1),
  (248, 'Rodrigo', 'Vergara', 'Silva', 'Bombero', 4, 1, 1, 'Operativo', '4-9',1),
  (249, 'Lorenzo', 'Gómez', 'González', 'Bombero', 2, 1, 0, 'Profesional', '2-9',1),
  (250, 'Amanda', 'Pérez', 'Martínez', 'Bombero', 1, 0, 1, 'Profesional', '1-9',1),
  (251, 'Valentina', 'Reyes', 'Cortés', 'Bombero', 1, 0, 1, 'Operativo', '1-9',1),
  (252, 'Antonia', 'Castro', 'Vargas', 'Bombero', 1, 0, 0, 'Profesional', '1-9',1),
  (253, 'Pedro', 'Núñez', 'Morales', 'Bombero', 1, 0, 0, 'Operativo', '1-9',1),
  (254, 'Gabriel', 'Torres', 'Fuentes', 'Bombero', 3, 1, 1, 'Inicial', '3-9',1),
  (255, 'Benjamín', 'Morales', 'Araya', 'Bombero', 4, 0, 0, 'Profesional', '4-9',1),
  (256, 'Camila', 'Figueroa', 'Torres', 'Bombero', 3, 1, 0, 'Operativo', '3-9',1),
  (257, 'Víctor', 'Rodríguez', 'Bravo', 'Bombero', 4, 1, 0, 'Operativo', '4-9',1),
  (258, 'Simón', 'Castillo', 'Núñez', 'Bombero', 3, 0, 0, 'Operativo', '3-9',1),
  (259, 'David', 'Gómez', 'Muñoz', 'Bombero', 4, 0, 0, 'Profesional', '4-9',1),
  (260, 'Matías', 'Rodríguez', 'Sánchez', 'Bombero', 3, 0, 0, 'Operativo', '3-9',1),
  (261, 'Agustín', 'Martínez', 'Carrasco', 'Bombero', 1, 0, 0, 'Profesional', '1-9',1),
  (262, 'Víctor', 'Castillo', 'Rivera', 'Bombero', 1, 0, 0, 'Operativo', '1-9',1),
  (263, 'Antonia', 'Espinoza', 'Jara', 'Bombero', 1, 1, 1, 'Operativo', '1-9',1),
  (264, 'Josefina', 'Rojas', 'Silva', 'Bombero', 3, 0, 1, 'Operativo', '3-9',1),
  (265, 'David', 'González', 'Castro', 'Bombero', 3, 0, 0, 'Profesional', '3-9',1),
  (266, 'Ricardo', 'Espinoza', 'Contreras', '1Teniente', 3, 1, 1, 'Operativo', '3-1',1),
  (267, 'Antonia', 'Sánchez', 'Hernández', 'Bombero', 1, 1, 0, 'Inicial', '1-9',1),
  (268, 'Jorge', 'Rojas', 'Morales', 'Capitán', 3, 1, 1, 'Profesional', 'M-3',1),
  (269, 'Belén', 'Sepúlveda', 'Álvarez', 'Bombero', 2, 1, 0, 'Profesional', '2-9',1),
  (270, 'Agustín', 'Martínez', 'Vergara', 'Bombero', 2, 1, 0, 'Inicial', '2-9',1),
  (271, 'Rocío', 'Pérez', 'Díaz', 'Bombero', 3, 0, 0, 'Operativo', '3-9',1),
  (272, 'David', 'Riquelme', 'Riquelme', '3Teniente', 2, 1, 1, 'Operativo', '2-3',1),
  (273, 'Ricardo', 'Jara', 'Hernández', 'Bombero', 4, 0, 1, 'Inicial', '4-9',1),
  (274, 'Marcelo', 'Fernández', 'Fernández', 'Bombero', 2, 0, 0, 'Inicial', '2-9',1),
  (275, 'Laura', 'Martínez', 'Espinoza', 'Bombero', 2, 0, 0, 'Operativo', '2-9',1),
  (276, 'Victoria', 'Sánchez', 'Sepúlveda', 'Bombero', 1, 0, 0, 'Operativo', '1-9',1),
  (277, 'Patricio', 'Contreras', 'Sánchez', 'Bombero', 4, 1, 0, 'Operativo', '4-9',1),
  (278, 'Victoria', 'Díaz', 'Díaz', 'Bombero', 3, 1, 0, 'Profesional', '3-9',1),
  (279, 'Josefina', 'Riquelme', 'Torres', 'Bombero', 2, 1, 0, 'Operativo', '2-9',1),
  (280, 'Camila', 'Núñez', 'Díaz', 'Bombero', 1, 1, 1, 'Operativo', '1-9',1),
  (281, 'Jorge', 'Torres', 'Gómez', 'Bombero', 4, 0, 0, 'Profesional', '4-9',1),
  (282, 'Matías', 'López', 'Núñez', 'Bombero', 1, 0, 1, 'Operativo', '1-9',1),
  (283, 'Simón', 'Torres', 'Castillo', 'Bombero', 4, 1, 0, 'Operativo', '4-9',1),
  (284, 'Ignacio', 'González', 'Muñoz', 'Bombero', 4, 0, 1, 'Inicial', '4-9',1),
  (285, 'Víctor', 'Valenzuela', 'González', 'Bombero', 1, 0, 1, 'Operativo', '1-9',1),
  (286, 'Camila', 'Vargas', 'Gutiérrez', 'Bombero', 1, 0, 1, 'Profesional', '1-9',1),
  (287, 'Rodrigo', 'Núñez', 'Figueroa', 'Bombero', 1, 1, 1, 'Profesional', '1-9',1),
  (288, 'Cristóbal', 'López', 'Carrasco', 'Bombero', 4, 0, 1, 'Profesional', '4-9',1),
  (289, 'Benjamín', 'Espinoza', 'Fuentes', 'Bombero', 3, 1, 0, 'Inicial', '3-9',1),
  (290, 'Belén', 'Soto', 'Contreras', 'Bombero', 2, 1, 0, 'Inicial', '2-9',1),
  (291, 'Martín', 'Figueroa', 'Figueroa', 'Bombero', 2, 0, 0, 'Profesional', '2-9',1),
  (292, 'Josefina', 'Valenzuela', 'Martínez', 'Bombero', 2, 0, 0, 'Operativo', '2-9',1),
  (293, 'Josefina', 'Fernández', 'Morales', 'Bombero', 2, 0, 1, 'Profesional', '2-9',1),
  (294, 'Iván', 'Hernández', 'Pérez', 'Bombero', 1, 0, 0, 'Operativo', '1-9',1),
  (295, 'Iván', 'Muñoz', 'Herrera', 'Bombero', 3, 0, 0, 'Operativo', '3-9',1),
  (296, 'Francisca', 'Fernández', 'Díaz', 'Bombero', 4, 0, 1, 'Profesional', '4-9',1),
  (297, 'Pedro', 'Araya', 'Tapia', 'Bombero', 1, 0, 0, 'Inicial', '1-9',1),
  (298, 'Camila', 'Reyes', 'González', 'Bombero', 1, 0, 1, 'Operativo', '1-9',1),
  (299, 'Francisco', 'Silva', 'Cortés', 'Bombero', 1, 0, 0, 'Inicial', '1-9',1),
  (300, 'Francisca', 'Rodríguez', 'Espinoza', 'Bombero', 4, 1, 0, 'Inicial', '4-9',1),
  (301, 'Lorenzo', 'Fernández', 'Riquelme', 'Bombero', 3, 1, 1, 'Operativo', '3-9',1);
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
    SUM(CASE WHEN v.status = 'yellow' THEN 1 ELSE 0 END) AS dispatched,
    SUM(CASE WHEN v.status = 'red' THEN 1 ELSE 0 END) AS at_incident,
    SUM(CASE WHEN v.status = 'blue' THEN 1 ELSE 0 END) AS returning,
    SUM(CASE WHEN v.status = 'gray' THEN 1 ELSE 0 END) AS unavailable
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
