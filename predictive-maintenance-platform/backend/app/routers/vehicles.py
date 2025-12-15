from fastapi import APIRouter, HTTPException
from app.database import supabase
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

class VehicleCreate(BaseModel):
    vin: str
    make: str
    model: str
    year: int
    owner_id: Optional[str] = None

@router.get("/")
def get_vehicles():
    response = supabase.table("vehicles").select("*").execute()
    return response.data

@router.get("/{vehicle_id}")
def get_vehicle_details(vehicle_id: str):
    response = supabase.table("vehicles").select("*").eq("id", vehicle_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    # Get recent telemetry
    telemetry = supabase.table("telemetry").select("*").eq("vehicle_id", vehicle_id).order("timestamp", desc=True).limit(20).execute()
    
    return {"vehicle": response.data[0], "history": telemetry.data}

@router.post("/")
def register_vehicle(vehicle: VehicleCreate):
    response = supabase.table("vehicles").insert(vehicle.dict()).execute()
    return response.data
