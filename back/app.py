import os

from fastapi import (
    FastAPI,
    Request,
    Depends
)

from fastapi.middleware.cors import (
    CORSMiddleware
)

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

from schemas.despacho_schema import ( DespachoRequest)

from services.despacho_service import ( ejecutar_despacho)

from utils.maps import (  obtener_coordenadas)

from schemas.incident_schema import ( UpdateIncidentStatusRequest)

from services.incident_service import (
    obtener_incidentes_activos,
    obtener_incidente_por_codigo,
    actualizar_estado_incidente,
    obtener_historial_incidentes
)

from services.vehicle_service import (obtener_vehiculos)

# =========================
# App
# =========================

app = FastAPI()

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

@app.post("/despacho")
#genera un despacho de carros basada en la interseccion de calles. cambia el estado de los carros y crea el incidente
#tb los asigna calculando la ruta más corta desde las estaciones hasta el accidente
def despacho(
    request: DespachoRequest,
    db: Session = Depends(get_db)
):

    resultado = (
        ejecutar_despacho(
            db=db,
            data=request
        )
    )

    return resultado


@app.get("/emergencias/activas")
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

@app.get("/emergencias/historial")
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

@app.get("/emergencias/{incident_code}")
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

@app.patch( "/emergencias/{incident_code}/estado")
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
    