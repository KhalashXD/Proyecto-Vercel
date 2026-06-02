import os
from typing import Optional

from fastapi import (
    FastAPI,
    Request,
    Depends
)

from fastapi.responses import StreamingResponse

from fastapi.middleware.cors import (
    CORSMiddleware
)

from pydantic import BaseModel

from sqlalchemy import (
    create_engine,
    text
)

from sqlalchemy.orm import (
    sessionmaker,
    Session
)


# =========================
# Imports rutas / schemas
# =========================

from schemas.despacho_schema import ( DespachoRequest, FrontDespachoRequest)

from services.despacho_service import ( ejecutar_despacho)

from utils.maps import (  obtener_coordenadas)

from schemas.incident_schema import ( UpdateIncidentStatusRequest, AssignVehicleRequest, UpdateVehicleStatusRequest, CreateIncidentActionRequest, CreateIncidentVictimRequest, CreateVehicleInstructionRequest)

from services.incident_service import (obtener_incidentes_activos,obtener_incidente_por_codigo,actualizar_estado_incidente, obtener_historial_incidentes, asignar_vehiculo_adicional, actualizar_estado_vehiculo_incidente, liberar_vehiculo_incidente, registrar_accion_incidente, obtener_victimas_incidente, registrar_victima_incidente, obtener_instrucciones_unidades, registrar_instrucciones_unidades)

from services.vehicle_service import (obtener_vehiculos, obtener_vehiculos_disponibles, actualizar_estado_vehiculo)
from services.personnel_service import (obtener_personal)
from schemas.carros_mando_schema import (CarroMandoRequest)
from services.carros_mando_service import (registrar_carro_mando)
from services.report_service import (
    crear_excel,
    crear_pdf,
    obtener_filas_historial,
    obtener_filas_incidente
)
from services.telegram_service import (
    enviar_mensaje_telegram,
    telegram_configurado
)
from services.weather_service import (obtener_clima_actual)
# =========================
# App
# =========================

app = FastAPI()


class TelegramMessageRequest(BaseModel):
    message: str
    chat_id: Optional[str] = None

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Configuración DB
# =========================

DATABASE_URL = os.getenv(
    "DATABASE_URL"
)

if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL no está definida"
    )

# Engine SQLAlchemy
engine = create_engine(
    DATABASE_URL
)

# Sesiones DB
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# =========================
# Dependencia DB
# =========================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

# =========================
# Variables globales
# =========================

id_emergencia = None
despacho = None
id_acciones = None
coord = None

# =========================
# RUTAS
# =========================
@app.post("/despacho")  # version conexion con front
def despacho(
    request: FrontDespachoRequest,
    db: Session = Depends(get_db)
):
    adapted_request = (
        DespachoRequest(
            emergency_code=request.clave,
            street_1=request.calle,
            street_2=request.interseccion,
            latitude=request.latitude,
            longitude=request.longitude,
            location_notes=request.direccion,
            incident_description=request.informacion,
            caller_name="No informado",
            caller_phone="No informado"
        )
    )

    resultado_backend = (
        ejecutar_despacho(
            db=db,
            data=adapted_request
        )
    )

    despacho_codigos = [
        vehiculo["vehicle_code"]
        for vehiculo in resultado_backend["assigned_vehicles"]
    ]

    resultado_texto = ""

    for codigo in despacho_codigos:
        resultado_texto += f"{codigo} "

    resultado_texto += (
        f"Clave {request.clave} "
        f"{request.calle} con {request.interseccion}. "
        f"Personal requerido: {resultado_backend['required_personnel']}"
    )

    telegram_result = None
    if telegram_configurado():
        telegram_result = enviar_mensaje_telegram(resultado_texto)

    return {
        "resultado": resultado_texto,
        "despacho": despacho_codigos,
        "id": resultado_backend["incident_code"],
        "required_personnel": resultado_backend["required_personnel"],
        "telegram": telegram_result
        #"id": resultado_backend["incident_id"]  
        }

@app.get("/personal")
def personal(db: Session = Depends(get_db)):
    return obtener_personal(db=db)

@app.post("/carros_mando")
def carros_mando(
    request: CarroMandoRequest,
    db: Session = Depends(get_db)
):

    return registrar_carro_mando(
        db=db,
        data=request
    )

@app.get("/emergenciasActivas")
# entrega el listado de emergencias activas
def incidentes_activos(
    db: Session = Depends(get_db)
):

    resultado = (
        obtener_incidentes_activos(
            db=db
        )
    )

    return resultado

@app.get("/emergenciasHistorial")
# entrega historial de emergencias cerradas
def historial_emergencias(
    db: Session = Depends(get_db)
):

    resultado = (
        obtener_historial_incidentes(
            db=db
        )
    )

    return resultado

@app.get("/emergenciasActivas/{incident_code}")
# entrega el detalle de una emergencia en caso de q se haga click sobre ella
def obtener_emergencia(
    incident_code: str,
    db: Session = Depends(get_db)
):

    resultado = (
        obtener_incidente_por_codigo(
            db=db,
            incident_code=incident_code
        )
    )

    return resultado

@app.patch( "/emergenciasActivas/{incident_code}/estado")
#cambia el estado de una emergencia activa
def actualizar_estado(
    incident_code: str,
    request:
        UpdateIncidentStatusRequest,
    db: Session = Depends(get_db)
):
    resultado = (
        actualizar_estado_incidente(
            db=db,
            incident_code=
                incident_code,
            new_status=
                request.status
        )
    )
    return resultado

@app.get("/vehiculos")
# entrega todos los vehículos
def vehiculos(
    db: Session = Depends(get_db)
):

    resultado = (
        obtener_vehiculos(
            db=db
        )
    )

    return resultado

@app.get("/vehiculos/disponibles")
#Entrega los vehiculos disponibles (estado:green)
def vehiculos_disponibles(db: Session = Depends(get_db)):
    return obtener_vehiculos_disponibles(db=db)

@app.post("/emergenciasActivas/{incident_code}/vehiculos")
def asignar_vehiculo(
    incident_code: str,
    request: AssignVehicleRequest,
    db: Session = Depends(get_db)
):
    return asignar_vehiculo_adicional(
        db=db,
        incident_code=incident_code,
        vehicle_id=request.vehicle_id
    )

@app.patch("/emergenciasActivas/{incident_code}/vehiculos/{vehicle_id}/estado")
def actualizar_estado_carro_en_emergencia(
    incident_code: str,
    vehicle_id: int,
    request: UpdateVehicleStatusRequest,
    db: Session = Depends(get_db)
):
    return actualizar_estado_vehiculo_incidente(
        db=db,
        incident_code=incident_code,
        vehicle_id=vehicle_id,
        new_status=request.status
    )

@app.delete("/emergenciasActivas/{incident_code}/vehiculos/{vehicle_id}")
def liberar_carro_de_emergencia(
    incident_code: str,
    vehicle_id: int,
    db: Session = Depends(get_db)
):
    return liberar_vehiculo_incidente(
        db=db,
        incident_code=incident_code,
        vehicle_id=vehicle_id
    )

@app.patch("/vehiculos/{vehicle_id}/estado")
def actualizar_estado_carro(
    vehicle_id: int,
    request: UpdateVehicleStatusRequest,
    db: Session = Depends(get_db)
):
    return actualizar_estado_vehiculo(
        db=db,
        vehicle_id=vehicle_id,
        new_status=request.status
    )

@app.post("/emergenciasActivas/{incident_code}/acciones")
def registrar_accion(
    incident_code: str,
    request: CreateIncidentActionRequest,
    db: Session = Depends(get_db)
):
    return registrar_accion_incidente(
        db=db,
        incident_code=incident_code,
        event_type=request.event_type,
        description=request.description,
        user_name=request.user_name,
        emergency_code=request.emergency_code
    )

@app.get("/emergenciasActivas/{incident_code}/instrucciones")
def obtener_instrucciones(
    incident_code: str,
    db: Session = Depends(get_db)
):
    return obtener_instrucciones_unidades(
        db=db,
        incident_code=incident_code
    )

@app.post("/emergenciasActivas/{incident_code}/instrucciones")
def registrar_instrucciones(
    incident_code: str,
    request: CreateVehicleInstructionRequest,
    db: Session = Depends(get_db)
):
    return registrar_instrucciones_unidades(
        db=db,
        incident_code=incident_code,
        vehicle_codes=request.vehicle_codes,
        instruction=request.instruction
    )

@app.get("/emergenciasActivas/{incident_code}/victimas")
def obtener_victimas(
    incident_code: str,
    db: Session = Depends(get_db)
):
    return obtener_victimas_incidente(
        db=db,
        incident_code=incident_code
    )

@app.post("/emergenciasActivas/{incident_code}/victimas")
def registrar_victima(
    incident_code: str,
    request: CreateIncidentVictimRequest,
    db: Session = Depends(get_db)
):
    return registrar_victima_incidente(
        db=db,
        incident_code=incident_code,
        name=request.name,
        sex=request.sex,
        age=request.age,
        reason_at_scene=request.reason_at_scene,
        injury_type=request.injury_type,
        details=request.details
    )


@app.get("/api/fire-risk")
def fire_risk():
    return obtener_clima_actual()


@app.get("/clima")
def clima():
    return obtener_clima_actual()


@app.get("/telegram/status")
def telegram_status():
    return {
        "configured": telegram_configurado()
    }


@app.post("/telegram/send")
def telegram_send(request: TelegramMessageRequest):
    return enviar_mensaje_telegram(
        mensaje=request.message,
        chat_id=request.chat_id
    )


@app.get("/reportes/emergencias.xlsx")
def reporte_emergencias_excel(
    db: Session = Depends(get_db)
):
    content = crear_excel(
        rows=obtener_filas_historial(db),
        sheet_name="Emergencias"
    )

    return StreamingResponse(
        iter([content]),
        media_type=(
            "application/vnd.openxmlformats-officedocument."
            "spreadsheetml.sheet"
        ),
        headers={
            "Content-Disposition":
                "attachment; filename=reporte_emergencias.xlsx"
        }
    )


@app.get("/reportes/emergencias.pdf")
def reporte_emergencias_pdf(
    db: Session = Depends(get_db)
):
    content = crear_pdf(
        rows=obtener_filas_historial(db),
        title="Reporte de emergencias"
    )

    return StreamingResponse(
        iter([content]),
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                "attachment; filename=reporte_emergencias.pdf"
        }
    )


@app.get("/reportes/emergencias/{incident_code}.xlsx")
def reporte_incidente_excel(
    incident_code: str,
    db: Session = Depends(get_db)
):
    content = crear_excel(
        rows=obtener_filas_incidente(db, incident_code),
        sheet_name=f"Incidente {incident_code}"
    )

    return StreamingResponse(
        iter([content]),
        media_type=(
            "application/vnd.openxmlformats-officedocument."
            "spreadsheetml.sheet"
        ),
        headers={
            "Content-Disposition":
                f"attachment; filename=reporte_{incident_code}.xlsx"
        }
    )


@app.get("/reportes/emergencias/{incident_code}.pdf")
def reporte_incidente_pdf(
    incident_code: str,
    db: Session = Depends(get_db)
):
    content = crear_pdf(
        rows=obtener_filas_incidente(db, incident_code),
        title=f"Reporte de emergencia {incident_code}"
    )

    return StreamingResponse(
        iter([content]),
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                f"attachment; filename=reporte_{incident_code}.pdf"
        }
    )

#DESDE ACA ENDPOINTS DE PRUEBAS:-----------------
@app.get("/db-test")
#prueba de BD
def test_db():

    try:

        with engine.connect() as connection:

            result = connection.execute(
                text("SELECT 1")
            )

            return {
                "message":
                "Conexión exitosa a MariaDB"
            }

    except Exception as e:

        return {
            "error": str(e)
        }


@app.get("/test-maps")
#prueba del funcionamienteo de maps
def test_maps():

    coordenadas = (
        obtener_coordenadas(
            "A",
            "Bß"
        )
    )

    return coordenadas


""""
@app.post("/carros_mando")
async def carros_mando(request: Request):
    pass


@app.post("/carros_mando2")
async def carros_mando2(request: Request):
    pass


@app.get("/api/fire-risk")
async def get_fire_risk():
    pass


@app.get("/emergencia_info/{id}")
async def emergencia_info(id: int):
    pass


@app.post("/informacion")
async def handle_info(request: Request):
    pass


@app.post("/externos")
async def handle_externos(request: Request):
    pass


@app.post("/superacion")
async def handle_superacion(request: Request):
    pass


@app.post("/evaluacion")
async def handle_evaluacion(request: Request):
    pass


@app.get("/evaluaciones/{id}")
async def evaluaciones(id: int):
    pass


@app.post("/instrucciones")
async def handle_instruccion(request: Request):
    pass


@app.get("/carros/{id}")
async def carros_emergencia(id: int):
    pass


@app.post("/desmov")
async def handle_desmov(request: Request):
    pass


@app.post("/desp")
async def handle_desp(request: Request):
    pass


@app.get("/disponibles/{id}")
async def carros_disponibles(id: int):
    pass


@app.get("/api/estados")
async def estados():
    pass


@app.post("/clave")
async def handle_clave(request: Request):
    pass


@app.post("/estado-carro")
async def handle_estado_carro(request: Request):
    pass


@app.get("/emergencias")
async def emergencias():
    pass


@app.get("/historial")
async def historial():
    pass


@app.post("/mando")
async def handle_mando(request: Request):
    pass

# =========================
# Test DB
# =========================
@app.get("/db-test")
async def db_test():
    try:
        db.execute(text("SELECT 1"))
        return {"database": "connected"}
    except Exception as e:
        return {"error": str(e)} 
"""        

# =========================
# Run
# =========================
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
    
