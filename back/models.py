# models.py

#RECREACION FORMATO DE TABLAS 
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    Enum,
    ForeignKey,
    TIMESTAMP,
    DECIMAL,
    JSON,
    Time,
    UniqueConstraint,
    Index,
    func,
)
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

# ============================================================
# TABLA: stations
# ============================================================

class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(20), nullable=False, unique=True)
    name = Column(String(255), nullable=False, unique=True)
    address = Column(Text, nullable=False)

    latitude = Column(DECIMAL(10, 8), nullable=False)
    longitude = Column(DECIMAL(11, 8), nullable=False)

    phone = Column(String(20))
    email = Column(String(100))

    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    vehicles = relationship("Vehicle", back_populates="station")

    __table_args__ = (
        Index("idx_code", "code"),
    )


# ============================================================
# TABLA: emergency_types
# ============================================================

class EmergencyType(Base):
    __tablename__ = "emergency_types"

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(20), nullable=False, unique=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)

    required_units = Column(Integer, default=1)
    required_personnel = Column(Integer, default=4)

    morse_code = Column(String(100))
    priority = Column(Integer, default=1)
    active = Column(Boolean, default=True)

    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    dispatch_rules = relationship(
        "DispatchRule",
        back_populates="emergency_type",
        cascade="all, delete"
    )

    incidents = relationship("Incident", back_populates="emergency_type")

    __table_args__ = (
        Index("idx_code", "code"),
        Index("idx_priority", "priority"),
    )


# ============================================================
# TABLA: vehicles
# ============================================================

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, autoincrement=True)

    vehicle_code = Column(String(50), nullable=False, unique=True)
    vehicle_type = Column(String(100), nullable=False)

    station_id = Column(
        Integer,
        ForeignKey("stations.id", ondelete="RESTRICT"),
        nullable=False
    )

    status = Column(
        Enum("green", "yellow", "red", name="vehicle_status_enum"),
        default="green"
    )

    driver_name = Column(String(255))
    capacity = Column(Integer)

    last_location_lat = Column(DECIMAL(10, 8))
    last_location_lng = Column(DECIMAL(11, 8))
    last_location_updated = Column(TIMESTAMP)

    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    station = relationship("Station", back_populates="vehicles")

    incident_assignments = relationship(
        "IncidentVehicle",
        back_populates="vehicle"
    )

    incident_events = relationship(
        "IncidentEvent",
        back_populates="vehicle"
    )

    __table_args__ = (
        Index("idx_station", "station_id"),
        Index("idx_status", "status"),
        Index("idx_code", "vehicle_code"),
    )


# ============================================================
# TABLA: dispatch_rules
# ============================================================

class DispatchRule(Base):
    __tablename__ = "dispatch_rules"

    id = Column(Integer, primary_key=True, autoincrement=True)

    emergency_type_id = Column(
        Integer,
        ForeignKey("emergency_types.id", ondelete="CASCADE"),
        nullable=False
    )

    priority_order = Column(Integer, nullable=False)

    vehicle_type = Column(String(100))
    morse_code = Column(String(100))
    telegram_message = Column(Text)

    required_count = Column(Integer, default=1)
    additional_requirements = Column(JSON)

    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    emergency_type = relationship(
        "EmergencyType",
        back_populates="dispatch_rules"
    )

    __table_args__ = (
        Index("idx_type", "emergency_type_id"),
        Index("idx_priority", "priority_order"),
    )


# ============================================================
# TABLA: incidents
# ============================================================

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, autoincrement=True)

    incident_code = Column(String(50), nullable=False, unique=True)

    emergency_type_id = Column(
        Integer,
        ForeignKey("emergency_types.id"),
        nullable=False
    )

    street_1 = Column(String(255), nullable=False)
    street_2 = Column(String(255), nullable=False)

    latitude = Column(DECIMAL(10, 8), nullable=False)
    longitude = Column(DECIMAL(11, 8), nullable=False)

    location_notes = Column(Text)

    caller_name = Column(String(255))
    caller_phone = Column(String(20))

    incident_description = Column(Text)

    status = Column(
        Enum(
            "registered",
            "pending",
            "in_progress",
            "resolved",
            "closed",
            name="incident_status_enum"
        ),
        default="registered"
    )

    priority = Column(Integer, default=1)

    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    first_unit_arrival = Column(TIMESTAMP)
    closed_at = Column(TIMESTAMP)

    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    emergency_type = relationship(
        "EmergencyType",
        back_populates="incidents"
    )

    vehicles = relationship(
        "IncidentVehicle",
        back_populates="incident",
        cascade="all, delete"
    )

    operational_form = relationship(
        "OperationalForm",
        back_populates="incident",
        uselist=False,
        cascade="all, delete"
    )

    events = relationship(
        "IncidentEvent",
        back_populates="incident",
        cascade="all, delete"
    )

    __table_args__ = (
        Index("idx_status", "status"),
        Index("idx_type", "emergency_type_id"),
        Index("idx_created", "created_at"),
        Index("idx_location", "latitude", "longitude"),
        Index("idx_code", "incident_code"),
        Index("idx_incidents_status_created", "status", "created_at"),
    )

# ============================================================
# TABLA: personnel
# ============================================================

class Personnel(Base):
    __tablename__ = "personnel"

    id = Column(Integer, primary_key=True, autoincrement=True)
    external_id = Column(Integer)

    first_name = Column(String(100), nullable=False)
    last_name_1 = Column(String(100))
    last_name_2 = Column(String(100))

    rank = Column(String(100))

    station_id = Column(
        Integer,
        ForeignKey("stations.id", ondelete="SET NULL")
    )

    can_rescue = Column(Boolean, default=False)
    can_hazmat = Column(Boolean, default=False)

    level = Column(String(50))
    radio_code = Column(String(20))

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )

    station = relationship("Station")

    __table_args__ = (
        Index("idx_station", "station_id"),
        Index("idx_rank", "rank"),
    )

# ============================================================
# TABLA: incident_vehicles
# ============================================================

class IncidentVehicle(Base):
    __tablename__ = "incident_vehicles"

    id = Column(Integer, primary_key=True, autoincrement=True)

    incident_id = Column(
        Integer,
        ForeignKey("incidents.id", ondelete="CASCADE"),
        nullable=False
    )

    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id"),
        nullable=False
    )

    personnel_in_charge_id = Column(
        Integer,
        ForeignKey(
            "personnel.id",
            ondelete="SET NULL"
        )
    )

    personnel_count = Column(
        Integer,
        default=0
    )

    assigned_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )

    arrived_at = Column(TIMESTAMP)
    departure_time = Column(TIMESTAMP)

    notes = Column(Text)

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )

    incident = relationship(
        "Incident",
        back_populates="vehicles"
    )

    vehicle = relationship(
        "Vehicle",
        back_populates="incident_assignments"
    )

    personnel_in_charge = relationship(
        "Personnel"
    )

    __table_args__ = (
        UniqueConstraint(
            "incident_id",
            "vehicle_id",
            name="unique_assignment"
        ),
        Index("idx_incident", "incident_id"),
        Index("idx_vehicle", "vehicle_id"),
        Index(
            "idx_personnel_in_charge",
            "personnel_in_charge_id"
        ),
    )


# ============================================================
# TABLA: operational_forms
# ============================================================

class OperationalForm(Base):
    __tablename__ = "operational_forms"

    id = Column(Integer, primary_key=True, autoincrement=True)

    incident_id = Column(
        Integer,
        ForeignKey("incidents.id", ondelete="CASCADE"),
        nullable=False,
        unique=True
    )

    personnel_on_scene = Column(Integer)

    equipment_used = Column(JSON)
    patient_info = Column(JSON)

    actions_taken = Column(Text)

    outcome = Column(String(100))

    additional_units_requested = Column(Boolean, default=False)
    ambulance_requested = Column(Boolean, default=False)

    institutional_support = Column(Text)

    form_completed = Column(Boolean, default=False)

    completed_by = Column(String(255))

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )

    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    incident = relationship(
        "Incident",
        back_populates="operational_form"
    )

    __table_args__ = (
        Index("idx_incident", "incident_id"),
    )


# ============================================================
# TABLA: incident_events
# ============================================================

class IncidentEvent(Base):
    __tablename__ = "incident_events"

    id = Column(Integer, primary_key=True, autoincrement=True)

    incident_id = Column(
        Integer,
        ForeignKey("incidents.id", ondelete="CASCADE"),
        nullable=False
    )

    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id", ondelete="SET NULL")
    )

    event_type = Column(
        Enum(
            "created",
            "vehicle_assigned",
            "vehicle_arrived",
            "vehicle_departed",
            "status_changed",
            "additional_units_requested",
            "ambulance_requested",
            "form_submitted",
            "incident_closed",
            name="incident_event_type_enum"
        ),
        nullable=False
    )

    description = Column(Text)

    user_name = Column(String(255))

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )

    incident = relationship(
        "Incident",
        back_populates="events"
    )

    vehicle = relationship(
        "Vehicle",
        back_populates="incident_events"
    )

    __table_args__ = (
        Index("idx_incident", "incident_id"),
        Index("idx_created", "created_at"),
        Index("idx_type", "event_type"),
        Index("idx_incident_events_timestamp", "created_at"),
    )


# ============================================================
# TABLA: incident_history
# ============================================================

class IncidentHistory(Base):
    __tablename__ = "incident_history"

    id = Column(Integer, primary_key=True, autoincrement=True)

    incident_id = Column(Integer, nullable=False)

    incident_code = Column(String(50), nullable=False)

    emergency_type = Column(String(255))

    location_streets = Column(String(511))

    status = Column(String(50))

    total_response_time = Column(Time)

    vehicles_assigned = Column(Integer)

    archived_data = Column(JSON)

    archived_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )

    __table_args__ = (
        Index("idx_code", "incident_code"),
        Index("idx_archived", "archived_at"),
    )


# ============================================================
# TABLA: audit_log
# ============================================================

class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(Integer, primary_key=True, autoincrement=True)

    entity_type = Column(String(100))
    entity_id = Column(Integer)

    action = Column(String(50))

    old_values = Column(JSON)
    new_values = Column(JSON)

    changed_by = Column(String(255))

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )

    __table_args__ = (
        Index("idx_entity", "entity_type", "entity_id"),
        Index("idx_created", "created_at"),
    )
