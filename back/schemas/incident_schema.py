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

class AssignVehicleRequest(BaseModel):
    vehicle_id: int

class UpdateVehicleStatusRequest(BaseModel):
    status: str

class CreateIncidentActionRequest(BaseModel):
    event_type: str
    description: str
    user_name: str = "system"
    emergency_code: str | None = None

class CreateIncidentVictimRequest(BaseModel):
    name: str
    sex: str
    age: int | None = None
    reason_at_scene: str
    injury_type: str
    details: str | None = None

class CreateVehicleInstructionRequest(BaseModel):
    vehicle_codes: list[str]
    instruction: str
