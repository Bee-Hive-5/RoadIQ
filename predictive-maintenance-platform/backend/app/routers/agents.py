from fastapi import APIRouter
from app.database import supabase
from app.worker import ingest_telemetry_task
import uuid
from pydantic import BaseModel

router = APIRouter()

class TelemetryInput(BaseModel):
    vehicle_id: str
    speed: float
    engine_rpm: float
    engine_temp: float
    battery_voltage: float
    vibration_level: float

@router.get("/logs")
def get_agent_logs():
    response = supabase.table("agent_logs").select("*").order("created_at", desc=True).limit(50).execute()
    return response.data

@router.post("/simulate/{vehicle_id}")
def simulate_telemetry(vehicle_id: str, data: TelemetryInput):
    # Manually trigger the ingestion agent
    ingest_telemetry_task.delay(vehicle_id, data.dict())
    return {"status": "Agent Job Queued", "data": data}

@router.post("/voice-webhook")
def voice_agent_webhook(payload: dict):
    # This endpoint receives status updates from the Voice Agent (e.g. Rasa or VAPI)
    # Payload example: {"call_id": "123", "status": "CONFIRMED", "vehicle_id": "uuid"}
    
    supabase.table("agent_logs").insert({
        "agent_name": "Voice Agent",
        "action_type": "CALL_RESULT",
        "vehicle_id": payload.get("vehicle_id"),
        "details": payload,
        "decision_confidence": 1.0
    }).execute()
    
    return {"status": "processed"}
