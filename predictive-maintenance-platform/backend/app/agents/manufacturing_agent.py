import pandas as pd
from collections import defaultdict
import os
import datetime

class ManufacturingAgent:
    def __init__(self):
        self.failure_patterns = defaultdict(list)
        self.data_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'vehicle_data.csv')
        
    def log_failure_pattern(self, vehicle_id, diagnosis):
        try:
            if not os.path.exists(self.data_path):
                return {'status': 'error', 'message': 'Data file missing'}

            df = pd.read_csv(self.data_path)
            vehicle_data_rows = df[df['vehicle_id'] == vehicle_id]
            
            if vehicle_data_rows.empty:
                 return {'status': 'error', 'message': 'Vehicle not found'}
                 
            vehicle_data = vehicle_data_rows.iloc[0]
            
            batch_id = vehicle_data['batch_id']
            component = diagnosis['component']
            
            self.failure_patterns[batch_id].append({
                'vehicle_id': vehicle_id,
                'component': component,
                'probability': diagnosis['probability'],
                'timestamp': datetime.datetime.now().isoformat()
            })
            
            return self.analyze_batch_quality(batch_id)
        except Exception as e:
            print(f"ManufacturingAgent Error: {e}")
            return {'status': 'error', 'message': 'Unable to log failure pattern'}
    
    def analyze_batch_quality(self, batch_id):
        try:
            if not os.path.exists(self.data_path):
                 return {}

            df = pd.read_csv(self.data_path)
            batch_vehicles = df[df['batch_id'] == batch_id]
            
            if batch_vehicles.empty:
                return {'batch_id': batch_id, 'message': 'No data for batch'}

            # Calculate batch statistics
            avg_failure_risk = batch_vehicles['failure_risk'].mean()
            high_risk_count = len(batch_vehicles[batch_vehicles['failure_risk'] > 0.7])
            total_count = len(batch_vehicles)
            
            # Identify common failure components
            component_failures = batch_vehicles['component_health'].value_counts()
            
            # Generate insights
            insights = []
            if avg_failure_risk > 0.6:
                insights.append(f"Batch {batch_id} shows elevated failure risk ({avg_failure_risk:.2f})")
            
            if high_risk_count > total_count * 0.3:
                insights.append(f"30%+ vehicles in batch {batch_id} are high-risk")
            
            most_common_issue = component_failures.index[0] if len(component_failures) > 0 else 'Unknown'
            insights.append(f"Primary concern: {str(most_common_issue).replace('_', ' ').title()}")
            
            return {
                'batch_id': batch_id,
                'total_vehicles': total_count,
                'high_risk_vehicles': high_risk_count,
                'avg_failure_risk': float(avg_failure_risk),
                'primary_issue': str(most_common_issue),
                'insights': insights,
                'recommendation': self._generate_recommendation(avg_failure_risk, str(most_common_issue))
            }
        except Exception as e:
            print(f"ManufacturingAgent Error (Analyze): {e}")
            return {'status': 'error', 'message': 'Unable to analyze batch quality'}
    
    def _generate_recommendation(self, avg_risk, primary_issue):
        if avg_risk > 0.8:
            return f"URGENT: Investigate {primary_issue} supplier quality. Consider batch recall."
        elif avg_risk > 0.6:
            return f"Review {primary_issue} manufacturing process and supplier standards."
        else:
            return "Continue monitoring. No immediate action required."
    
    def get_quality_insights(self):
        try:
            if not os.path.exists(self.data_path):
                return {'batch_summary': {}, 'total_batches': 0, 'quality_trend': 'Unknown'}

            df = pd.read_csv(self.data_path)
            
            # Batch analysis - simplified for pandas compat without complex lambdas in agg if possible
            # But the user code used lambda, so we'll try to keep it safe
            
            def get_mode(x):
                m = x.mode()
                return m[0] if not m.empty else 'Unknown'

            batch_analysis = df.groupby('batch_id').agg({
                'failure_risk': ['mean', 'count'],
                'component_health': get_mode
            }).round(3)
            
            # Flatten columns for easier JSON
            # But specific aggregation structure might be expected. 
            # We will convert to a straightforward dict structure.
            
            # Note: The original code returned `batch_analysis.to_dict()` which results in nested dicts with tuple keys or similar depending on pandas version.
            # Let's make it a bit safer for JSON serialization if needed, but for now stick to close-to-original.
            
            # To avoid tuple keys in JSON (which fails), we might need to stringify keys or restructure.
            # However, standard pandas to_dict default is usually okay-ish or needs 'records'. 
            # Let's use a custom transform to be safe for API.
            
            summary = {}
            for batch_id, group in df.groupby('batch_id'):
                summary[batch_id] = {
                    'avg_failure_risk': float(group['failure_risk'].mean()),
                    'count': int(len(group)),
                    'common_component': get_mode(group['component_health'])
                }

            return {
                'batch_summary': summary,
                'total_batches': len(df['batch_id'].unique()),
                'quality_trend': 'Declining' if df['failure_risk'].mean() > 0.5 else 'Stable'
            }
        except Exception as e:
            print(f"ManufacturingAgent Error (Insights): {e}")
            return {'status': 'error', 'message': 'Unable to generate quality insights'}
