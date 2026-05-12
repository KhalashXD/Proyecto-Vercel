import os
#from flask import Flask, jsonify
#from flask_sqlalchemy import SQLAlchemy

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import text

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
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL no está definida")

# Engine SQLAlchemy
engine = create_engine(DATABASE_URL)

# Sesiones DB
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Crear sesión
db = SessionLocal()

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
async def despacho_route(request: Request):
    pass

@app.get("/db-test")
def test_db():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            return {"message": "Conexión exitosa a MariaDB"}
    except Exception as e:
        return {"error": str(e)}

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
    