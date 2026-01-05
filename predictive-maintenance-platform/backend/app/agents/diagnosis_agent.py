import pandas as pd
import numpy as np
import os

class DiagnosisAgent:
    def __init__(self):
        self.data_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'vehicle_data.csv')
        self.model = self._load_or_train_model()
        self._setup_gemini()
        
    def _setup_gemini(self):
        try:
            import google.generativeai as genai
            api_key = os.getenv("GOOGLE_API_KEY")
            if api_key:
                genai.configure(api_key=api_key)
                self.gemini_model = genai.GenerativeModel('gemini-pro')
                print("DiagnosisAgent: Gemini API Configured Successfully")
            else:
                self.gemini_model = None
                print("DiagnosisAgent: No Google API Key found. Using fallback.")
        except ImportError:
            self.gemini_model = None
            print("DiagnosisAgent: google-generativeai not installed. Using fallback.")
        except Exception as e:
            self.gemini_model = None
            print(f"DiagnosisAgent: Gemini Setup Error: {e}")

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
            
            # Rule-based failure prediction (Fallback & Context)
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
                
            # Component-specific recommendations (Fallback)
            recommendations = {
                'brake_system': 'Replace brake pads and check fluid levels',
                'engine': 'Engine diagnostic and oil change required',
                'suspension': 'Inspect shock absorbers and springs',
                'transmission': 'Transmission fluid check and service'
            }
            comp_key = component.lower().replace(' ', '_')
            base_recommendation = recommendations.get(comp_key, 'General inspection required')
            
            # GEMINI ENHANCEMENT
            ai_recommendation = base_recommendation
            if self.gemini_model:
                try:
                    prompt = f"""
                    Act as an expert vehicle mechanic and data analyst.
                    A vehicle (ID: {vehicle_id}) shows signs of potential failure.
                    
                    Data:
                    - Component: {component}
                    - Failure Risk Probability: {probability:.2f}
                    - Urgency: {urgency}
                    - Recent Telemetry: {vehicle_data.to_dict()}
                    
                    Explain why this failure might be happening based on these values and provide a specific technical recommendation. 
                    Keep the recommendation concise (under 2 sentences).
                    Do not start with "Based on..." or "The data suggests...". Just give the insight.
                    """
                    response = self.gemini_model.generate_content(prompt)
                    if response.text:
                        ai_recommendation = response.text.strip()
                except Exception as g_err:
                    print(f"DiagnosisAgent: Gemini Generation Error: {g_err}")

            # VIDEO TUTORIAL ENHANCEMENT
            video_url = None
            try:
                from youtubesearchpython import VideosSearch
                search_query = f"How to fix {component} {vehicle_data['vehicle_model'] if 'vehicle_model' in vehicle_data else 'car'}"
                videosSearch = VideosSearch(search_query, limit = 1)
                results = videosSearch.result()
                if results and 'result' in results and len(results['result']) > 0:
                    video_url = results['result'][0]['link']
                    print(f"DiagnosisAgent: Found tutorial: {video_url}")
            except Exception as y_err:
                print(f"DiagnosisAgent: YouTube Search Error: {y_err}")

            return {
                'component': component.replace('_', ' ').title(),
                'probability': probability,
                'urgency': urgency,
                'recommendation': ai_recommendation,
                'video_tutorial': video_url,
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
