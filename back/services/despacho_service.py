
from uuid import uuid4
from math import radians, sin, cos, sqrt, atan2

from sqlalchemy.orm import Session

from models import (
    EmergencyType,
    DispatchRule,
    Vehicle,
    Station,
    Incident,
    IncidentVehicle,
    IncidentEvent
)

from utils.maps import (
    obtener_coordenadas
)


def calcular_distancia(
    lat1,
    lon1,
    lat2,
    lon2
):

    R = 6371

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    c = (
        2
        * atan2(
            sqrt(a),
            sqrt(1 - a)
        )
    )

    return R * c


def ejecutar_despacho(
    db: Session,
    data
):

    # ==================================
    # Buscar tipo de emergencia
    # ==================================

    emergency_type = (
        db.query(EmergencyType)
        .filter(
            EmergencyType.code
            == data.emergency_code
        )
        .first()
    )

    if not emergency_type:
        raise Exception(
            "Emergency type not found"
        )

    # ==================================
    # Obtener coordenadas
    # ==================================

    coordenadas = (
    obtener_coordenadas(
        data.street_1,
        data.street_2
    )
    )

    latitude = coordenadas["latitude"]
    longitude = coordenadas["longitude"]

    # ==================================
    # Buscar reglas de despacho
    # ==================================

    dispatch_rules = (
        db.query(DispatchRule)
        .filter(
            DispatchRule
            .emergency_type_id
            == emergency_type.id
        )
        .order_by(
            DispatchRule.priority_order
        )
        .all()
    )

    assigned_vehicles = []
    missing_units = []

    # ==================================
    # Buscar vehículos cercanos
    # ==================================

    for rule in dispatch_rules:

        available_vehicles = (
            db.query(Vehicle)
            .join(Station)
            .filter(
                Vehicle.status
                == "green",

                Vehicle.vehicle_type
                == rule.vehicle_type
            )
            .all()
        )

        scored_vehicles = []

        for vehicle in (
            available_vehicles
        ):

            distance = (
                calcular_distancia(
                    float(
                        vehicle
                        .station
                        .latitude
                    ),
                    float(
                        vehicle
                        .station
                        .longitude
                    ),
                    latitude,
                    longitude
                )
            )

            scored_vehicles.append(
                (
                    distance,
                    vehicle
                )
            )

        scored_vehicles.sort(
            key=lambda x: x[0]
        )

        selected = (
            scored_vehicles[
                :rule.required_count
            ]
        )

        missing_count = ( #cuenta cuantos carros faltaron para agregar
            rule.required_count
            - len(selected)
        )

        if missing_count > 0:

            missing_units.append(
                {
                    "vehicle_type":
                        rule.vehicle_type,

                    "missing_count":
                        missing_count
                }
            )

        for _, vehicle in selected:
            assigned_vehicles.append(
                vehicle
            )

    # ==================================
    # Crear incidente
    # ==================================

    incident = Incident(

        incident_code=(
            f"INC-"
            f"{uuid4().hex[:8]}"
        ),

        emergency_type_id=(
            emergency_type.id
        ),

        street_1=data.street_1,
        street_2=data.street_2,

        latitude=latitude,
        longitude=longitude,

        location_notes=(
            data.location_notes
        ),

        caller_name=(
            data.caller_name
        ),

        caller_phone=(
            data.caller_phone
        ),

        incident_description=(
            data
            .incident_description
        ),

        status="pending",

        priority=(
            emergency_type
            .priority
        )
    )

    db.add(incident)
    db.commit()
    db.refresh(incident)

    # ==================================
    # Relacionar vehículos
    # ==================================

    for vehicle in (
        assigned_vehicles
    ):

        # cambiar estado
        vehicle.status = (
            "yellow"
        )

        relation = (
            IncidentVehicle(
                incident_id=
                    incident.id,

                vehicle_id=
                    vehicle.id
            )
        )

        db.add(relation)

        event = (
            IncidentEvent(
                incident_id=
                    incident.id,

                vehicle_id=
                    vehicle.id,

                event_type=
                    "vehicle_assigned",

                description=(
                    f"Vehicle "
                    f"{vehicle.vehicle_code} "
                    f"assigned"
                ),

                user_name=
                    "system"
            )
        )

        db.add(event)

    # evento creación

    created_event = (
        IncidentEvent(
            incident_id=
                incident.id,

            event_type=
                "created",

            description=
                "Incident created",

            user_name=
                "system"
        )
    )

    db.add(created_event)

    db.commit()

    return {

        "incident_id":
            incident.id,

        "incident_code":
            incident.incident_code,

        "latitude":
            latitude,

        "longitude":
            longitude,

        "assigned_vehicles": [

            {
                "id":
                    vehicle.id,

                "vehicle_code":
                    vehicle.vehicle_code,

                "vehicle_type":
                    vehicle.vehicle_type,

                "station_name":
                    vehicle.station.name
            }

            for vehicle in
            assigned_vehicles
        ],
        "missing_units":
            missing_units
    }