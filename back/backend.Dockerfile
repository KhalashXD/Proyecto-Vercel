# ============================================================
# Backend Dockerfile - FastAPI
# Emergency Management System
# ============================================================

FROM python:3.11-slim

# Variables de entorno
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Directorio de trabajo
WORKDIR /app

# Dependencias del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    default-mysql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements
COPY requirements.txt .

# Instalar dependencias Python
RUN pip install --upgrade pip setuptools wheel && \
    pip install -r requirements.txt

# Copiar aplicación
#COPY src/ /app/src/
#COPY app.py /app/
#COPY config.py /app/
#COPY schemas/ /app/schemas/
#COPY services/ /app/services/
#COPY env.example /app/.env.example
# Copiar aplicación
COPY . /app/

# Crear logs
RUN mkdir -p /app/logs

# Puerto FastAPI/Uvicorn
EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/db-test || exit 1

# Ejecutar FastAPI con Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
