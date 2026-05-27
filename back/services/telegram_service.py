import os
from typing import Any, Dict, Optional

import requests


def telegram_configurado() -> bool:
    return bool(os.getenv("TELEGRAM_BOT_TOKEN") and os.getenv("TELEGRAM_CHAT_ID"))


def enviar_mensaje_telegram(
    mensaje: str,
    chat_id: Optional[str] = None,
) -> Dict[str, Any]:
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    target_chat_id = chat_id or os.getenv("TELEGRAM_CHAT_ID")

    if not token or not target_chat_id:
        return {
            "ok": False,
            "message": (
                "Telegram no esta configurado. Define TELEGRAM_BOT_TOKEN "
                "y TELEGRAM_CHAT_ID."
            ),
        }

    try:
        response = requests.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            json={
                "chat_id": target_chat_id,
                "text": mensaje,
                "parse_mode": "HTML",
                "disable_web_page_preview": True,
            },
            timeout=10,
        )
    except requests.RequestException as error:
        return {
            "ok": False,
            "message": f"No se pudo conectar con Telegram: {error}"
        }

    if not response.ok:
        return {
            "ok": False,
            "status_code": response.status_code,
            "message": response.text,
        }

    return response.json()
