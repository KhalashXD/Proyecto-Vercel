from sqlalchemy.orm import Session

from models import Personnel


def obtener_personal(
    db: Session
):

    personnel = (
        db.query(Personnel)
        .all()
    )

    return [
        {
            "id": person.id,
            "external_id": person.external_id,
            "nombre": (
                f"{person.first_name} "
                f"{person.last_name_1 or ''} "
                f"{person.last_name_2 or ''}"
            ).strip(),
            "rank": person.rank,
            "station_id": person.station_id,
            "radio_code": person.radio_code,
        }
        for person in personnel
    ]