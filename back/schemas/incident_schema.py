from datetime import datetime
from pydantic import BaseModel


class IncidenteActivo(BaseModel):
    id: int
    incident_code: str

    emergency_code: str
    emergency_name: str

    street_1: str
    street_2: str

    latitude: float
    longitude: float

    status: str
    priority: int

    created_at: datetime

    assigned_vehicles: list[str]

class UpdateIncidentStatusRequest(
    BaseModel
):
    status: str