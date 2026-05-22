from sqlalchemy.orm import Session

from models import (
    Incident,
    IncidentVehicle,
    Vehicle,
    Personnel
)


def registrar_carro_mando(
    db: Session,
    data
):

    vehicle_code = (
        data.despacho[
            data.despachoIndex
        ]
    )

    incident = (
        db.query(Incident)
        .filter(
            Incident.incident_code
            == str(data.incidentId)
        )
        .first()
    )

    if not incident:

        raise Exception(
            "No se encontró la emergencia"
        )

    relation = (
        db.query(IncidentVehicle)
        .join(Vehicle)
        .filter(
            IncidentVehicle.incident_id
            == incident.id,

            Vehicle.vehicle_code
            == vehicle_code
        )
        .first()
    )

    if not relation:

        raise Exception(
            "No se encontró el carro asignado a esta emergencia"
        )

    personnel = (
        db.query(Personnel)
        .filter(
            Personnel.id
            == data.selectedId
        )
        .first()
    )

    if not personnel:

        raise Exception(
            "No se encontró el bombero seleccionado"
        )

    relation.personnel_in_charge_id = (
        data.selectedId
    )

    relation.personnel_count = (
        data.integerValue
    )

    db.commit()
    db.refresh(relation)

    return {
        "message":
            "Mando registrado correctamente",

        "incident_code":
            incident.incident_code,

        "vehicle_code":
            vehicle_code,

        "personnel_in_charge_id":
            relation.personnel_in_charge_id,

        "personnel_count":
            relation.personnel_count
    }
"""
from sqlalchemy.orm import Session

from models import (
    IncidentVehicle,
    Vehicle,
    Personnel
)


def registrar_carro_mando(
    db: Session,
    data
):

    vehicle_code = data.despacho[
        data.despachoIndex
    ]

    relation = (
        db.query(IncidentVehicle)
        .join(Vehicle)
        .filter(
            IncidentVehicle.incident_id == int(data.incidentId),
            Vehicle.vehicle_code == vehicle_code
        )
        .first()
    )

    if not relation:
        raise Exception(
            "No se encontró el carro asignado a esta emergencia"
        )

    personnel = (
        db.query(Personnel)
        .filter(
            Personnel.id == data.selectedId
        )
        .first()
    )

    if not personnel:
        raise Exception(
            "No se encontró el bombero seleccionado"
        )

    relation.personnel_in_charge_id = data.selectedId
    relation.personnel_count = data.integerValue

    db.commit()
    db.refresh(relation)

    return {
        "message": "Mando registrado correctamente",
        "incident_id": relation.incident_id,
        "vehicle_code": vehicle_code,
        "personnel_in_charge_id": relation.personnel_in_charge_id,
        "personnel_count": relation.personnel_count
    }

"""