

from pydantic import BaseModel
from typing import Optional, List


class DespachoRequest(BaseModel):
    emergency_code: str

    street_1: str
    street_2: str

    location_notes: Optional[str] = None
    incident_description: Optional[str] = None

    caller_name: Optional[str] = None
    caller_phone: Optional[str] = None


class VehiculoAsignado(BaseModel):
    id: int
    vehicle_code: str
    vehicle_type: str
    station_name: str


class DespachoResponse(BaseModel):
    incident_id: int
    incident_code: str

    latitude: float
    longitude: float

    assigned_vehicles: List[VehiculoAsignado]