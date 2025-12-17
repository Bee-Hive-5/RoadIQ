import pandas as pd
import numpy as np
import os

class DataAgent:
    def __init__(self):
        # Assuming data is in backend/data relative to where app runs or absolute path
        # Adjust path as necessary. Using a relative path that works when running from backend root.
        self.data_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'vehicle_data.csv')
        
    def analyze_risk(self, vehicle_id):
        try:
            if not os.path.exists(self.data_path):
                return {'level': 'UNKNOWN', 'score': 0.0, 'factors': ['Data source missing']}

            df = pd.read_csv(self.data_path)
            vehicle_data_rows = df[df['vehicle_id'] == vehicle_id]
            
            if vehicle_data_rows.empty:
                return {'level': 'UNKNOWN', 'score': 0.0, 'factors': ['Vehicle not found']}

            vehicle_data = vehicle_data_rows.iloc[0]
            
            # Risk calculation based on sensor thresholds
            risk_factors = []
            
            if vehicle_data['engine_temp'] > 100:
                risk_factors.append('High Engine Temperature')
            if vehicle_data['vibration'] > 1.0:
                risk_factors.append('Excessive Vibration')
            if vehicle_data['battery_voltage'] < 11.5:
                risk_factors.append('Low Battery')
            if vehicle_data['failure_risk'] > 0.7:
                risk_factors.append('Component Degradation')
                
            # Determine risk level
            if len(risk_factors) >= 2 or vehicle_data['failure_risk'] > 0.8:
                level = 'HIGH'
            elif len(risk_factors) == 1 or vehicle_data['failure_risk'] > 0.5:
                level = 'MEDIUM'
            else:
                level = 'LOW'
                
            return {
                'level': level,
                'score': float(vehicle_data['failure_risk']),
                'factors': risk_factors,
                'engine_temp': float(vehicle_data['engine_temp']),
                'vibration': float(vehicle_data['vibration']),
                'battery': float(vehicle_data['battery_voltage'])
            }
        except Exception as e:
            print(f"DataAgent Error: {e}")
            return {'level': 'LOW', 'score': 0.1, 'factors': []}
    
    def get_fleet_overview(self):
        try:
            if not os.path.exists(self.data_path):
                 return {'total_vehicles': 0, 'high_risk': 0, 'medium_risk': 0, 'low_risk': 0}

            df = pd.read_csv(self.data_path)
            
            high_risk = len(df[df['failure_risk'] > 0.7])
            medium_risk = len(df[(df['failure_risk'] > 0.4) & (df['failure_risk'] <= 0.7)])
            low_risk = len(df[df['failure_risk'] <= 0.4])
            
            # Helper to handle NaN/Inf for JSON serialization
            def clean_float(val):
                if np.isnan(val) or np.isinf(val):
                    return 0.0
                return float(val)

            avg_health = 1 - df['failure_risk'].mean()

            return {
                'total_vehicles': len(df),
                'high_risk': high_risk,
                'medium_risk': medium_risk,
                'low_risk': low_risk,
                'avg_health_score': clean_float(avg_health),
                # Converting to dict records for frontend
                'vehicles': df.fillna(0).to_dict('records') 
            }
        except Exception as e:
            print(f"DataAgent Error (Fleet): {e}")
            return {'total_vehicles': 0, 'high_risk': 0, 'medium_risk': 0, 'low_risk': 0}
