from typing import Dict, Any, Optional
import threading
try:
    import pyttsx3
except ImportError:
    pyttsx3 = None

from .data_agent import DataAgent
from .diagnosis_agent import DiagnosisAgent
from .customer_agent import CustomerAgent
from .scheduling_agent import SchedulingAgent
from .manufacturing_agent import ManufacturingAgent
from .ueba_agent import UEBAAgent

import queue

class RoadIQVoiceAPI:
    def __init__(self):
        self.message_queue = queue.Queue()
        self.available = False
        self.worker_thread = None
        
        try:
            if pyttsx3:
                # Test initialization to set availability
                # Actual engine will live in the worker thread
                self.available = True
                self._start_worker()
            else:
                self.available = False
        except:
            self.available = False
    
    def _start_worker(self):
        """Start the dedicated voice worker thread"""
        def worker():
            # Initialize COM for this thread (Required for Windows SAPI5 in threads)
            try:
                import pythoncom
                pythoncom.CoInitialize()
            except ImportError:
                print("Warning: pythoncom not found, voice might fail on Windows")
            
            # Initialize engine inside the thread
            try:
                engine = pyttsx3.init()
            except Exception as e:
                print(f"Voice Worker Failed to Init: {e}")
                return

            while True:
                try:
                    # Block until a message is available
                    task = self.message_queue.get()
                    if task is None:
                        break
                    
                    text, emotion = task
                    
                    # Apply properties based on emotion
                    if emotion == "urgent":
                        engine.setProperty('rate', 200)
                        engine.setProperty('volume', 1.0)
                    elif emotion == "calm":
                        engine.setProperty('rate', 150)
                        engine.setProperty('volume', 0.7)
                    else:
                        engine.setProperty('rate', 175)
                        engine.setProperty('volume', 0.9)
                        
                    print(f"🤖 RoadIQ Output ({emotion}): {text}")
                    engine.say(text)
                    engine.runAndWait()
                    
                    self.message_queue.task_done()
                except Exception as e:
                    print(f"Voice Worker Error: {e}")
                    # Re-init engine if it crashed?
                    try:
                        engine = pyttsx3.init()
                    except:
                        pass
            
            try:
                import pythoncom
                pythoncom.CoUninitialize()
            except:
                pass

        self.worker_thread = threading.Thread(target=worker, daemon=True)
        self.worker_thread.start()

    def setup_voice(self):
        # Configuration is now dynamic per message in the worker
        pass
    
    def speak_async(self, text, emotion="professional"):
        if not self.available:
            return
        
        # Determine emotion if not provided, for now assume passed correctly
        self.message_queue.put((text, emotion))

class MasterAgent:
    def __init__(self):
        self.data_agent = DataAgent()
        self.diagnosis_agent = DiagnosisAgent()
        self.customer_agent = CustomerAgent()
        self.scheduling_agent = SchedulingAgent()
        self.manufacturing_agent = ManufacturingAgent()
        self.ueba_agent = UEBAAgent()
        self.voice_assistant = RoadIQVoiceAPI()
        
    def analyze_vehicle(self, vehicle_id: str):
        # UEBA Check
        self.ueba_agent.monitor_agent_action('MasterAgent', 'analyze_vehicle', f'vehicle_{vehicle_id}')
        
        # 1. Gather Data
        self.ueba_agent.monitor_agent_action('DataAgent', 'read_sensor_data', f'vehicle_{vehicle_id}')
        risk_data = self.data_agent.analyze_risk(vehicle_id)
        
        # 2. Diagnose if risk is present
        diagnosis = None
        customer_engagement = None
        
        if risk_data['level'] in ['HIGH', 'MEDIUM']:
            self.ueba_agent.monitor_agent_action('DiagnosisAgent', 'predict_failure', f'vehicle_{vehicle_id}')
            diagnosis = self.diagnosis_agent.predict_failure(vehicle_id)
            
            # 3. Log pattern for manufacturing
            self.ueba_agent.monitor_agent_action('ManufacturingAgent', 'log_failure_pattern', f'vehicle_{vehicle_id}')
            self.manufacturing_agent.log_failure_pattern(vehicle_id, diagnosis)
            
            # 4. Generate Customer Engagement
            self.ueba_agent.monitor_agent_action('CustomerAgent', 'engage_customer', f'vehicle_{vehicle_id}')
            customer_engagement = self.customer_agent.engage_customer(vehicle_id, diagnosis)
            
        return {
            'vehicle_id': vehicle_id,
            'risk_assessment': risk_data,
            'diagnosis': diagnosis,
            'customer_engagement': customer_engagement,
            'timestamp': risk_data.get('timestamp') # Assuming timestamp might be added later or generated now
        }

    def get_dashboard_data(self):
        self.ueba_agent.monitor_agent_action('MasterAgent', 'get_dashboard_data', 'dashboard')
        
        fleet = self.data_agent.get_fleet_overview()
        quality = self.manufacturing_agent.get_quality_insights()
        
        return {
            'fleet_overview': fleet,
            'manufacturing_quality': quality,
            'system_status': 'Operational',
            'active_agents': 7
        }
        
    def schedule_service(self, data: Dict[str, Any]):
        self.ueba_agent.monitor_agent_action('SchedulingAgent', 'book_service', f"vehicle_{data.get('vehicle_id')}")
        return self.scheduling_agent.book_service(data.get('vehicle_id'), data.get('urgency'))

    def get_security_alerts(self):
        return self.ueba_agent.get_alerts()
    
    def get_voice_assistant(self):
        return self.voice_assistant
