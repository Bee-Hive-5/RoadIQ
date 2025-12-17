import pandas as pd
import numpy as np
import os

class DiagnosisAgent:
    def __init__(self):
        self.data_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'vehicle_data.csv')
        self.model = self._load_or_train_model()
        
    def _load_or_train_model(self):
        # Simple rule-based prediction for demo
        return None
    
    def predict_failure(self, vehicle_id):
        try:
            if not os.path.exists(self.data_path):
                return self._default_response()

            df = pd.read_csv(self.data_path)
            vehicle_data_rows = df[df['vehicle_id'] == vehicle_id]
            
            if vehicle_data_rows.empty:
                return self._default_response()

            vehicle_data = vehicle_data_rows.iloc[0]
            
            # Rule-based failure prediction
            component = str(vehicle_data['component_health'])
            probability = float(vehicle_data['failure_risk'])
            
            # Determine urgency
            if probability > 0.8:
                urgency = 'Critical'
            elif probability > 0.6:
                urgency = 'High'
            elif probability > 0.4:
                urgency = 'Medium'
            else:
                urgency = 'Low'
                
            # Component-specific recommendations
            recommendations = {
                'brake_system': 'Replace brake pads and check fluid levels',
                'engine': 'Engine diagnostic and oil change required',
                'suspension': 'Inspect shock absorbers and springs',
                'transmission': 'Transmission fluid check and service'
            }
            
            comp_key = component.lower().replace(' ', '_')
            
            return {
                'component': component.replace('_', ' ').title(),
                'probability': probability,
                'urgency': urgency,
                'recommendation': recommendations.get(comp_key, 'General inspection required'),
                'estimated_days': 7 if urgency == 'Critical' else 14 if urgency == 'High' else 30
            }
        except Exception as e:
            print(f"DiagnosisAgent Error: {e}")
            return self._default_response(error=True)

    def _default_response(self, error=False):
        return {
            'component': 'Unknown',
            'probability': 0.1,
            'urgency': 'Low',
            'recommendation': 'Regular maintenance check',
            'estimated_days': 30
        }
