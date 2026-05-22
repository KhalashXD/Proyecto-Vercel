from pydantic import BaseModel
from typing import List, Union


class CarroMandoRequest(BaseModel):
    incidentId: Union[int, str]
    despachoIndex: int
    selectedId: int
    integerValue: int
    despacho: List[str]