from fastapi import APIRouter
from app.database import supabase

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats():
    # Simple aggregates (in real production, use DB views)
    vehicles = supabase.table("vehicles").select("id", count="exact").execute()
    alerts = supabase.table("predictions").select("id", count="exact").execute()
    services_pending = supabase.table("service_bookings").select("id", count="exact").eq("status", "PENDING").execute()
    
    return {
        "total_vehicles": vehicles.count,
        "active_alerts": alerts.count,
        "pending_services": services_pending.count
    }
