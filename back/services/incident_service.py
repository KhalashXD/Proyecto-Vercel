from models import (
    Incident,
    IncidentEvent,
    Vehicle,
    IncidentVehicle,
    EmergencyType
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

    for incident in incidents:

        ids.append( str(incident.incident_code))

        texts.append(
            f"{incident.emergency_type.code} "
            f"{incident.street_1} con "
            f"{incident.street_2}"
        )

        dates.append(
            incident.created_at.strftime(
                "%d-%m-%Y %H:%M"
            )
        )

    return {
        "ids": ids,
        "texts": texts,
        "dates": dates
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
                    relation.assigned_at
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
                .description
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
