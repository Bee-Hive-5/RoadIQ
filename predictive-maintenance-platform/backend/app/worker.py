from celery import Celery
from app.config import settings
import random
import time
from app.database import supabase
import json
import os

# Check if we should run in Lite mode (No Redis/Docker)
USE_CELERY = os.getenv("USE_CELERY", "True").lower() == "true"

class MockCelery:
    def task(self, func):
        def wrapper(*args, **kwargs):
            # For hackathon demo without Docker: run synchronously
            return func(*args, **kwargs)
        wrapper.delay = wrapper # Mock the .delay() method
        return wrapper

if USE_CELERY:
    celery_app = Celery(
        "worker",
        broker=settings.REDIS_URL,
        backend=settings.REDIS_URL
    )
else:
    celery_app = MockCelery()


# Mock ML Model (Stub)
def predict_failure_risk(telemetry_data):
    # In a real model, this would use scikit-learn
    # Return random risk for demo if rpm or temp is high
    risk = 0.1
    if telemetry_data.get('engine_temp', 90) > 100:
        risk += 0.4
    if telemetry_data.get('vibration_level', 0) > 0.5:
        risk += 0.3
    return min(risk, 0.99)

@celery_app.task
def ingest_telemetry_task(vehicle_id, data):
    # 1. Store Telemetry
    supabase.table('telemetry').insert(data).execute()
    
    # 2. Trigger Prediction Agent
    analyze_failure_risk.delay(vehicle_id, data)
    
    return f"Ingested telemetry for {vehicle_id}"

@celery_app.task
def analyze_failure_risk(vehicle_id, data):
    # Agent: Failure Prediction Agent
    risk = predict_failure_risk(data)
    
    # Log Agent Action
    supabase.table('agent_logs').insert({
        "agent_name": "Failure Prediction Agent",
        "action_type": "ANALYSIS",
        "vehicle_id": vehicle_id,
        "details": {"risk_score": risk, "input": data},
        "decision_confidence": 0.95
    }).execute()

    if risk > 0.7:
        # High likelihood of failure -> Trigger Master Agent to act
        handle_critical_failure.delay(vehicle_id, risk)
        # Update vehicle health
        supabase.table('vehicles').update({"health_score": (1.0 - risk) * 100}).eq("id", vehicle_id).execute()
    
    return {"vehicle_id": vehicle_id, "risk": risk}

@celery_app.task
def handle_critical_failure(vehicle_id, risk_score):
    # Agent: Master Agent
    # 1. Check existing bookings?
    # 2. Alert User via Voice Agent hook (mock)
    
    alert = {
        "vehicle_id": vehicle_id,
        "severity": "CRITICAL",
        "message": f"Failure probability {risk_score*100:.1f}%. Immediate service recommended."
    }
    
    # Verify we aren't spamming (basic check)
    # ... logic skipped for hackathon speed
    
    # Store Prediction
    supabase.table('predictions').insert({
        "vehicle_id": vehicle_id,
        "failure_probability": risk_score,
        "predicted_failure_type": "Engine Overheat Risk",
        "remaining_useful_life": random.randint(5, 100),
        "components_at_risk": ["Engine", "Coolant System"]
    }).execute()
    
    # Log Action
    supabase.table('agent_logs').insert({
        "agent_name": "Master Agent",
        "action_type": "ALERT_TRIGGER",
        "vehicle_id": vehicle_id,
        "details": alert,
        "decision_confidence": 1.0
    }).execute()
    
    return "Critical alert processed"
