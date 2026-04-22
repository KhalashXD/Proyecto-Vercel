import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# =========================
# Configuración DB
# =========================
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL no está definida")

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# =========================
# Rutas
# =========================
@app.route("/")
def home():
    return {"message": "Emergency Backend Running 🚀"}

@app.route("/health")
def health():
    return {"status": "ok"}

# =========================
# Test DB
# =========================
@app.route("/db-test")
def db_test():
    try:
        db.session.execute("SELECT 1")
        return {"database": "connected"}
    except Exception as e:
        return {"error": str(e)}, 500

# =========================
# Run
# =========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
    