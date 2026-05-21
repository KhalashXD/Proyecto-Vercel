from sqlalchemy.orm import Session

from models import (
    Vehicle
)

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