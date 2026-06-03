from sqlalchemy.orm import Session
from sqlalchemy import func

from models import (
    Vehicle,
    IncidentVehiclePersonnel
)

VEHICLE_STATUSES = {
    "green",
    "yellow",
    "red",
    "blue",
    "gray"
}

def obtener_vehiculos(
    db: Session
):

    vehicles = (
        db.query(Vehicle)
        .all()
    )

    resultado = []

    for vehicle in vehicles:

        active_incident = None

        for assignment in (
            vehicle.incident_assignments
        ):

            incident = (
                assignment.incident
            )

            if incident.status != "closed":

                active_incident = {
                    "incident_code":
                        incident.incident_code,

                    "status":
                        incident.status
                }

                break

        resultado.append(
            {
                "id":
                    vehicle.id,

                "vehicle_code":
                    vehicle.vehicle_code,

                "vehicle_type":
                    vehicle.vehicle_type,

                "status":
                    vehicle.status,

                "driver_name":
                    vehicle.driver_name,

                "capacity":
                    vehicle.capacity,

                "station": {
                    "id":
                        vehicle.station.id,

                    "code":
                        vehicle.station.code,

                    "name":
                        vehicle.station.name,

                    "latitude":
                        float(
                            vehicle
                            .station
                            .latitude
                        ),

                    "longitude":
                        float(
                            vehicle
                            .station
                            .longitude
                        )
                },

                "active_incident":
                    active_incident
            }
        )
    return resultado

#Para vista Emergencia Activa ID: Accion: Unidades
def obtener_vehiculos_disponibles(db: Session):
    vehicles = (
        db.query(Vehicle)
        .filter(Vehicle.status == "green")
        .all()
    )

    return [
        {
            "id": vehicle.id,
            "vehicle_code": vehicle.vehicle_code,
            "vehicle_type": vehicle.vehicle_type,
            "station_name": vehicle.station.name,
            "status": vehicle.status,
            "driver_name": vehicle.driver_name
        }
        for vehicle in vehicles
    ]

def actualizar_estado_vehiculo(
    db: Session,
    vehicle_id: int,
    new_status: str
):
    if new_status not in VEHICLE_STATUSES:
        raise Exception("Vehicle status is not valid")

    vehicle = (
        db.query(Vehicle)
        .filter(Vehicle.id == vehicle_id)
        .first()
    )

    if not vehicle:
        raise Exception("Vehicle not found")

    allowed_transitions = {
        "green": {"gray"},
        "blue": {"green", "gray"},
        "gray": {"green"},
    }

    if new_status not in allowed_transitions.get(vehicle.status, set()):
        raise Exception("Vehicle status transition is not allowed")

    previous_status = vehicle.status
    vehicle.status = new_status

    if previous_status == "blue" and new_status == "green":
        active_personnel = (
            db.query(IncidentVehiclePersonnel)
            .filter(
                IncidentVehiclePersonnel.vehicle_id == vehicle.id,
                IncidentVehiclePersonnel.released_at.is_(None)
            )
            .all()
        )

        for assignment in active_personnel:
            assignment.released_at = func.current_timestamp()
            assignment.personnel.disponible = 1

    db.commit()
    db.refresh(vehicle)

    return {
        "message": "Vehicle status updated",
        "vehicle_id": vehicle.id,
        "vehicle_code": vehicle.vehicle_code,
        "old_status": previous_status,
        "new_status": vehicle.status
    }
