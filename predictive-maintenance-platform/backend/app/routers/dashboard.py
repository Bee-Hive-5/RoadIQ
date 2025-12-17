from fastapi import APIRouter
from app.agents.master_agent import MasterAgent

router = APIRouter()
master_agent = MasterAgent()

@router.get("/")
async def get_dashboard():
    return master_agent.get_dashboard_data()
