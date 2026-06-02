from models import (
    Incident,
    IncidentEvent,
    Vehicle,
    IncidentVehicle,
    EmergencyType,
    IncidentVictim,
    IncidentVehicleInstruction
)
from sqlalchemy.orm import Session
from sqlalchemy import func

def obtener_incidentes_activos(
    db: Session
):

    incidents = (
        db.query(Incident)
        .filter(
            Incident.status.in_(
                [
                    "registered",
                    "pending",
                    "in_progress",
                    "resolved"
                ]
            )
        )
        .order_by(
            Incident.created_at.desc()
        )
        .all()
    )

    ids = []
    texts = []
    dates = []
    times = []

    for incident in incidents:

        ids.append( str(incident.incident_code))

        texts.append(
            f"{incident.street_1} con "
            f"{incident.street_2}"
        )

        dates.append(
            incident.created_at.strftime(
                "%d-%m-%Y"
            )
        )

        times.append(
            incident.created_at.strftime(
                "%H:%M"
            )
        )

    return {
        "ids": ids,
        "texts": texts,
        "dates": dates,
        "times": times
    }

# para entregar la info de un accidente en especifico
# en el caso de que se haga click sobre ella

def obtener_incidente_por_codigo(
    db: Session,
    incident_code: str
):

    incident = (
        db.query(Incident)
        .filter(
            Incident.incident_code
            == incident_code
        )
        .first()
    )

    if not incident:
        raise Exception(
            "Incident not found"
        )

    # =========================
    # Vehículos asignados
    # =========================

    assigned_vehicles = []

    for relation in incident.vehicles:

        vehicle = relation.vehicle

        assigned_vehicles.append(
            {
                "id":
                    vehicle.id,

                "vehicle_code":
                    vehicle.vehicle_code,

                "vehicle_type":
                    vehicle.vehicle_type,

                "station_name":
                    vehicle.station.name,

                "status":
                    vehicle.status,

                "assigned_at":
                    relation.assigned_at,

                "personnel_in_charge":
                    (
                        {
                            "id":
                                relation.personnel_in_charge.id,

                            "name":
                                (
                                    f"{relation.personnel_in_charge.first_name} "
                                    f"{relation.personnel_in_charge.last_name_1 or ''} "
                                    f"{relation.personnel_in_charge.last_name_2 or ''}"
                                ).strip(),

                            "rank":
                                relation.personnel_in_charge.rank
                        }
                        if relation.personnel_in_charge
                        else None
                    ),

                "personnel_count":
                    relation.personnel_count
            }
        )

    # =========================
    # Timeline de eventos
    # =========================

    event_type_labels = {
    "created": "Emergencia Activa Registrada",
    "vehicle_assigned": "Unidad asignada",
    "vehicle_arrived": "Unidad en el lugar",
    "vehicle_departed": "Unidad dada de baja",
    "status_changed": "Cambio de estado",
    "additional_units_requested": "Solicitud de más unidades",
    "ambulance_requested": "Solicitud de ambulancia",
    "form_submitted": "Formulario registrado",
    "incident_closed": "Emergencia cerrado",
    "victims_reported": "Registro de víctimas",
    "personel_asigned": "Personal Asignado",
    "other": "Otro Suceso",
    "A_evaluacion_incidente": "Evaluación del incidente",
    "A_nueva_clave": "Nueva clave",
    "A_instrucciones": "Instrucciones",
    "A_comandante": "Comandante",
    "A_externos": "Recursos externos",
    "A_informacion": "Información",
    "A_victimas": "Víctimas",}

    timeline = [
        {
            "event_type":
                event.event_type,
            
            "tipo": event_type_labels.get(event.event_type, event.event_type),

            "description":
                event.description,

            "user_name":
                event.user_name,

            "created_at":
                event.created_at
        }
        for event in sorted(
            incident.events,
            key=lambda x: x.created_at,
            reverse=True
        )
    ]

    # =========================
    # Response
    # =========================

    return {

        "id":
            incident.id,

        "incident_code":
            incident.incident_code,

        "emergency": {
            "code":
                incident
                .emergency_type
                .code,

            "name":
                incident
                .emergency_type
                .name,

            "description":
                incident
                .emergency_type
                .description,

            "required_personnel":
                incident
                .emergency_type
                .required_personnel
        },

        "location": {
            "street_1":
                incident.street_1,

            "street_2":
                incident.street_2,

            "latitude":
                float(
                    incident.latitude
                ),

            "longitude":
                float(
                    incident.longitude
                ),

            "location_notes":
                incident.location_notes
        },

        "caller": {
            "name":
                incident.caller_name,

            "phone":
                incident.caller_phone
        },

        "incident_description":
            incident
            .incident_description,

        "status":
            incident.status,

        "priority":
            incident.priority,

        "created_at":
            incident.created_at,

        "assigned_vehicles":
            assigned_vehicles,

        "timeline":
            timeline
    }

#para cambiar el estado de una emergencia (patch)
def actualizar_estado_incidente(
    db: Session,
    incident_code: str,
    new_status: str
):

    valid_status = [
        "pending",
        "in_progress",
        "resolved",
        "closed"
    ]

    if new_status not in valid_status:

        raise Exception(
            "Invalid status"
        )

    incident = (
        db.query(Incident)
        .filter(
            Incident.incident_code
            == incident_code
        )
        .first()
    )

    if not incident:
        raise Exception(
            "Incident not found"
        )
    
    if incident.status == new_status:
        raise Exception(
            "Incident already has this status"
        )

    previous_status = (
        incident.status
    )

    previous_status = (
        incident.status
    )

    # cambiar estado
    incident.status = (
        new_status
    )

    # si la emergencia se cierra
    if new_status == "closed":

        incident.closed_at = (
            func.current_timestamp()
        )

        # Los carros deben confirmar posteriormente su regreso al cuartel.
        for relation in incident.vehicles:

            vehicle = (
                relation.vehicle
            )

            vehicle.status = (
                "blue"
            )

            relation.departure_time = (
                func.current_timestamp()
            )

        # evento de cierre
        close_event = (
            IncidentEvent(
                incident_id=incident.id,
                event_type="incident_closed",
                description=(
                    "Emergencia cerrada. Carros en retorno al cuartel"
                ),
                user_name="system"
            )
        )

        db.add(close_event)

    # evento de cambio de estado
    event = (
        IncidentEvent(
            incident_id=incident.id,
            event_type="status_changed",
            description=(
                f"Estado cambiado "
                f"desde {previous_status} "
                f"a {new_status}"
            ),
            user_name="system"
        )
    )

    db.add(event)

    db.commit()

    db.refresh(incident)

    return {
        "message":
            "Incident updated",

        "incident_code":
            incident.incident_code,

        "old_status":
            previous_status,

        "new_status":
            incident.status
    }

# historial de emergencias cerradas
def obtener_historial_incidentes(
    db: Session
):

    incidents = (
        db.query(Incident)
        .filter(
            Incident.status == "closed"
        )
        .order_by(
            Incident.closed_at.desc()
        )
        .all()
    )

    resultado = []

    for incident in incidents:

        assigned_vehicles = [
            relation.vehicle.vehicle_code
            for relation in incident.vehicles
        ]

        resultado.append(
            {
                "id":
                    incident.id,

                "incident_code":
                    incident.incident_code,

                "emergency_code":
                    incident
                    .emergency_type
                    .code,

                "emergency_name":
                    incident
                    .emergency_type
                    .name,

                "street_1":
                    incident.street_1,

                "street_2":
                    incident.street_2,

                "status":
                    incident.status,

                "priority":
                    incident.priority,

                "created_at":
                    incident.created_at,

                "closed_at":
                    incident.closed_at,

                "assigned_vehicles":
                    assigned_vehicles
            }
        )

    return resultado

#Para la vista desde acciones, asignar carros adicionales
def asignar_vehiculo_adicional(
    db: Session,
    incident_code: str,
    vehicle_id: int
):
    incident = (
        db.query(Incident)
        .filter(Incident.incident_code == incident_code)
        .first()
    )

    if not incident:
        raise Exception("Incident not found")

    vehicle = (
        db.query(Vehicle)
        .filter(Vehicle.id == vehicle_id)
        .first()
    )

    if not vehicle:
        raise Exception("Vehicle not found")

    if vehicle.status != "green":
        raise Exception("Vehicle is not available")

    relation = IncidentVehicle(
        incident_id=incident.id,
        vehicle_id=vehicle.id
    )

    vehicle.status = "yellow"

    event = IncidentEvent(
        incident_id=incident.id,
        vehicle_id=vehicle.id,
        event_type="vehicle_assigned",
        description=f"Unidad {vehicle.vehicle_code} asignada",
        user_name="system"
    )

    db.add(relation)
    db.add(event)
    db.commit()

    return {
        "message": "Unidad asignada correctamente",
        "vehicle_code": vehicle.vehicle_code
    }

def actualizar_estado_vehiculo_incidente(
    db: Session,
    incident_code: str,
    vehicle_id: int,
    new_status: str
):
    incident = (
        db.query(Incident)
        .filter(Incident.incident_code == incident_code)
        .first()
    )

    if not incident:
        raise Exception("Incident not found")

    relation = (
        db.query(IncidentVehicle)
        .filter(
            IncidentVehicle.incident_id == incident.id,
            IncidentVehicle.vehicle_id == vehicle_id
        )
        .first()
    )

    if not relation:
        raise Exception("Vehicle is not assigned to this incident")

    vehicle = relation.vehicle

    if vehicle.status != "yellow" or new_status != "red":
        raise Exception("Vehicle status transition is not allowed")

    vehicle.status = "red"
    relation.arrived_at = func.current_timestamp()

    event = IncidentEvent(
        incident_id=incident.id,
        vehicle_id=vehicle.id,
        event_type="vehicle_arrived",
        description=f"Unidad {vehicle.vehicle_code} confirmada en emergencia",
        user_name="system"
    )

    db.add(event)
    db.commit()
    db.refresh(vehicle)

    return {
        "message": "Unidad confirmada en emergencia",
        "vehicle_id": vehicle.id,
        "vehicle_code": vehicle.vehicle_code,
        "status": vehicle.status
    }

def liberar_vehiculo_incidente(
    db: Session,
    incident_code: str,
    vehicle_id: int
):
    incident = (
        db.query(Incident)
        .filter(Incident.incident_code == incident_code)
        .first()
    )

    if not incident:
        raise Exception("Incident not found")

    relation = (
        db.query(IncidentVehicle)
        .filter(
            IncidentVehicle.incident_id == incident.id,
            IncidentVehicle.vehicle_id == vehicle_id
        )
        .first()
    )

    if not relation:
        raise Exception("Vehicle is not assigned to this incident")

    vehicle = relation.vehicle

    if vehicle.status != "red":
        raise Exception("Only vehicles confirmed at the emergency can be released")

    vehicle.status = "blue"

    event = IncidentEvent(
        incident_id=incident.id,
        vehicle_id=vehicle.id,
        event_type="vehicle_departed",
        description=f"Unidad {vehicle.vehicle_code} liberada. Regreso pendiente al cuartel",
        user_name="system"
    )

    db.add(event)
    db.delete(relation)
    db.commit()
    db.refresh(vehicle)

    return {
        "message": "Unidad liberada correctamente",
        "vehicle_id": vehicle.id,
        "vehicle_code": vehicle.vehicle_code,
        "status": vehicle.status
    }

INCIDENT_ACTION_TYPES = {
    "A_evaluacion_incidente",
    "A_nueva_clave",
    "A_instrucciones",
    "A_comandante",
    "A_externos",
    "A_informacion",
    "A_victimas"
}

def registrar_accion_incidente(
    db: Session,
    incident_code: str,
    event_type: str,
    description: str,
    user_name: str,
    emergency_code: str | None = None
):
    if event_type not in INCIDENT_ACTION_TYPES:
        raise Exception("Incident action type is not valid")

    incident = (
        db.query(Incident)
        .filter(Incident.incident_code == incident_code)
        .first()
    )

    if not incident:
        raise Exception("Incident not found")

    if event_type == "A_nueva_clave":
        if not emergency_code:
            raise Exception("Emergency code is required")

        emergency_type = (
            db.query(EmergencyType)
            .filter(EmergencyType.code == emergency_code)
            .first()
        )

        if not emergency_type:
            raise Exception("Emergency type not found")

        incident.emergency_type_id = emergency_type.id
        incident.priority = emergency_type.priority

    event = IncidentEvent(
        incident_id=incident.id,
        event_type=event_type,
        description=description,
        user_name=user_name
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return {
        "message": "Acción registrada correctamente",
        "event_type": event.event_type,
        "description": event.description,
        "created_at": event.created_at
    }

def obtener_instrucciones_unidades(
    db: Session,
    incident_code: str
):
    incident = (
        db.query(Incident)
        .filter(Incident.incident_code == incident_code)
        .first()
    )

    if not incident:
        raise Exception("Incident not found")

    return [
        {
            "id": instruction.id,
            "vehicle_id": instruction.vehicle.id,
            "vehicle_code": instruction.vehicle.vehicle_code,
            "instruction": instruction.instruction,
            "created_at": instruction.created_at
        }
        for instruction in sorted(
            incident.vehicle_instructions,
            key=lambda item: item.created_at,
            reverse=True
        )
    ]

def registrar_instrucciones_unidades(
    db: Session,
    incident_code: str,
    vehicle_codes: list[str],
    instruction: str
):
    clean_instruction = instruction.strip()
    unique_vehicle_codes = list(dict.fromkeys(vehicle_codes))

    if not unique_vehicle_codes or not clean_instruction:
        raise Exception("Vehicles and instruction are required")

    incident = (
        db.query(Incident)
        .filter(Incident.incident_code == incident_code)
        .first()
    )

    if not incident:
        raise Exception("Incident not found")

    assigned_vehicles = {
        relation.vehicle.vehicle_code: relation.vehicle
        for relation in incident.vehicles
    }

    if any(code not in assigned_vehicles for code in unique_vehicle_codes):
        raise Exception("Vehicle is not assigned to this incident")

    for vehicle_code in unique_vehicle_codes:
        db.add(
            IncidentVehicleInstruction(
                incident_id=incident.id,
                vehicle_id=assigned_vehicles[vehicle_code].id,
                instruction=clean_instruction
            )
        )

    db.add(
        IncidentEvent(
            incident_id=incident.id,
            event_type="A_instrucciones",
            description=(
                f"Unidades {', '.join(unique_vehicle_codes)}: "
                f"{clean_instruction}"
            ),
            user_name="system"
        )
    )

    db.commit()

    return {
        "message": "Instrucción registrada correctamente",
        "vehicle_codes": unique_vehicle_codes
    }

VICTIM_SEXES = {
    "female",
    "male",
    "other",
    "not_informed"
}

VICTIM_INJURY_TYPES = {
    "minor",
    "serious",
    "fatal",
    "not_informed"
}

def obtener_victimas_incidente(
    db: Session,
    incident_code: str
):
    incident = (
        db.query(Incident)
        .filter(Incident.incident_code == incident_code)
        .first()
    )

    if not incident:
        raise Exception("Incident not found")

    return [
        {
            "id": victim.id,
            "name": victim.name,
            "sex": victim.sex,
            "age": victim.age,
            "reason_at_scene": victim.reason_at_scene,
            "injury_type": victim.injury_type,
            "details": victim.details,
            "created_at": victim.created_at
        }
        for victim in incident.victims
    ]

def registrar_victima_incidente(
    db: Session,
    incident_code: str,
    name: str,
    sex: str,
    age: int | None,
    reason_at_scene: str,
    injury_type: str,
    details: str | None
):
    if sex not in VICTIM_SEXES:
        raise Exception("Victim sex is not valid")

    if injury_type not in VICTIM_INJURY_TYPES:
        raise Exception("Victim injury type is not valid")

    if age is not None and age < 0:
        raise Exception("Victim age is not valid")

    incident = (
        db.query(Incident)
        .filter(Incident.incident_code == incident_code)
        .first()
    )

    if not incident:
        raise Exception("Incident not found")

    victim = IncidentVictim(
        incident_id=incident.id,
        name=name,
        sex=sex,
        age=age,
        reason_at_scene=reason_at_scene,
        injury_type=injury_type,
        details=details
    )

    event = IncidentEvent(
        incident_id=incident.id,
        event_type="A_victimas",
        description=f"Víctima registrada: {name}",
        user_name="system"
    )

    db.add(victim)
    db.add(event)
    db.commit()
    db.refresh(victim)

    return {
        "message": "Víctima registrada correctamente",
        "victim_id": victim.id
    }
