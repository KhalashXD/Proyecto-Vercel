from models import (
    Incident,
    IncidentEvent,
    Vehicle
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
"""
#para entregar lista de accidentes activos
def obtener_incidentes_activos(db):

    incidents = (
        db.query(Incident)
        .filter(
            Incident.status != "closed"
        )
        .order_by(
            Incident.priority.asc(),
            Incident.created_at.desc()
        )
        .all()
    )

    resultado = []

    for incident in incidents:

        assigned_vehicles = [
            relation.vehicle.vehicle_code
            for relation in incident.vehicles
        ]

        resultado.append({
            "id":
                incident.id,

            "incident_code":
                incident.incident_code,

            "emergency_code":
                incident.emergency_type.code,

            "emergency_name":
                incident.emergency_type.name,

            "street_1":
                incident.street_1,

            "street_2":
                incident.street_2,

            "latitude":
                float(incident.latitude),

            "longitude":
                float(incident.longitude),

            "status":
                incident.status,

            "priority":
                incident.priority,

            "created_at":
                incident.created_at,

            "assigned_vehicles":
                assigned_vehicles
        })

    return resultado
"""
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

    timeline = [
        {
            "event_type":
                event.event_type,

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

        # liberar vehículos
        for relation in incident.vehicles:

            vehicle = (
                relation.vehicle
            )

            vehicle.status = (
                "green"
            )

        # evento de cierre
        close_event = (
            IncidentEvent(
                incident_id=incident.id,
                event_type="incident_closed",
                description=(
                    "Incident closed "
                    "and vehicles released"
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
                f"Status changed "
                f"from {previous_status} "
                f"to {new_status}"
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
