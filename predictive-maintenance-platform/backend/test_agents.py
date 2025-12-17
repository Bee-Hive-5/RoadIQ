import sys
import os

# Appending current dir to path to find 'app'
sys.path.append(os.getcwd())

from app.agents.master_agent import MasterAgent

def test_integration():
    print("Initializing MasterAgent...")
    ma = MasterAgent()
    
    print("\n--- Testing Vehicle Analysis ---")
    vh = ma.analyze_vehicle("V001")
    print(f"Vehicle V001 Risk Level: {vh['risk_assessment']['level']}")
    if vh['diagnosis']:
        print(f"Diagnosis: {vh['diagnosis']['component']} - {vh['diagnosis']['recommendation']}")
    
    print("\n--- Testing Dashboard Data ---")
    data = ma.get_dashboard_data()
    print(f"Total Vehicles in Fleet: {data['fleet_overview']['total_vehicles']}")
    print(f"Active Agents: {data['active_agents']}")
    
    print("\n--- Testing UEBA Alerts ---")
    alerts = ma.get_security_alerts()
    print(f"Total Security Events: {alerts['total_events']}")
    
    print("\nTest Complete.")

if __name__ == "__main__":
    test_integration()
