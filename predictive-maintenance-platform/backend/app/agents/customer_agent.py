import random
from typing import Dict, Any

class CustomerAgent:
    def __init__(self):
        self.conversation_flows = {
            'brake_system': {
                'alert': "URGENT SAFETY ALERT: Your vehicle's brake system shows 78% failure probability within 7 days.",
                'explanation': "Our AI detected excessive brake pad wear and reduced fluid pressure. This could lead to complete brake failure.",
                'consequences': "Without immediate service, you risk accidents, injury, and costly emergency repairs up to $2000.",
                'solution': "We can schedule emergency service today at our certified center. This 2-hour service costs only $300.",
                'urgency': "Critical - Schedule within 24 hours"
            },
            'engine': {
                'alert': "ENGINE WARNING: Overheating detected with 92% failure risk.",
                'explanation': "Temperature sensors show your engine running 15 degrees above normal. Coolant system may be compromised.",
                'consequences': "Engine seizure could occur, resulting in $5000-8000 replacement costs and roadside breakdown.",
                'solution': "Immediate cooling system inspection and repair. Estimated cost $400-600.",
                'urgency': "Critical - Stop driving, schedule today"
            },
            'suspension': {
                'alert': "COMFORT AND SAFETY NOTICE: Suspension system degradation detected.",
                'explanation': "Shock absorbers and springs show 85% wear. Vehicle stability and ride quality are compromised.",
                'consequences': "Poor handling, tire wear, and potential loss of control in emergency situations.",
                'solution': "Suspension service recommended within 2 weeks. Cost estimate $800-1200.",
                'urgency': "High - Schedule within 14 days"
            },
            'transmission': {
                'alert': "TRANSMISSION ADVISORY: Performance degradation detected.",
                'explanation': "Fluid analysis shows contamination. Gear shifting may become erratic.",
                'consequences': "Complete transmission failure could cost $3000-5000 for replacement.",
                'solution': "Transmission service and fluid replacement. Preventive cost $200-400.",
                'urgency': "Medium - Schedule within 30 days"
            }
        }
        
        self.manufacturer_templates = {
            'quality_alert': "Manufacturing Quality Alert: Batch {batch_id} shows {failure_rate}% failure rate in {component}.",
            'recall_recommendation': "RECALL RECOMMENDED: {count} vehicles affected. Immediate supplier investigation required.",
            'trend_analysis': "Quality Trend: {component} failures increased {percentage}% in recent production."
        }
        
        # Enhanced QA Database for Chat/Voice
        self.qa_database = {
            "1": {
                "question": "What's my vehicle health?",
                "answer": "Your vehicle V001 shows brake system failure risk of 78%. Immediate service recommended within 24 hours.",
                "emotion": "urgent"
            },
            "2": {
                "question": "How much will repairs cost?",
                "answer": "Brake service costs 300 dollars preventive, or up to 2000 dollars if emergency repairs are needed.",
                "emotion": "professional"
            },
            "3": {
                "question": "When can I schedule service?",
                "answer": "Available today at Downtown Service Center: 9 AM, 11 AM, 2 PM, or 4 PM.",
                "emotion": "calm"
            },
            "4": {
                "question": "Is it safe to drive?",
                "answer": "With 78% brake failure risk, limit driving to essential trips only. Schedule service immediately.",
                "emotion": "urgent"
            },
            "5": {
                "question": "What caused the problem?",
                "answer": "AI detected brake pad wear and fluid pressure issues from normal wear over 45,000 miles.",
                "emotion": "professional"
            },
            "6": {
                "question": "Is my vehicle under warranty?",
                "answer": "Yes, your 3-year warranty is active until December 2025. This repair should be fully covered.",
                "emotion": "calm"
            }
        }
    
    def process_query(self, text: str):
        """Process natural language or menu-based queries"""
        text = text.lower().strip()
        
        # Direct Menu Match
        if text in self.qa_database:
            return self.qa_database[text]
            
        # Keyword Matching for minimal NLP
        if 'health' in text or 'status' in text:
            return self.qa_database['1']
        elif 'cost' in text or 'price' in text:
            return self.qa_database['2']
        elif 'schedule' in text or 'book' in text:
            return self.qa_database['3']
        elif 'safe' in text or 'drive' in text:
            return self.qa_database['4']
        elif 'cause' in text or 'why' in text:
            return self.qa_database['5']
        elif 'warranty' in text or 'coverage' in text:
            return self.qa_database['6']
            
        return {
            "answer": "I can help with vehicle health, repair costs, or scheduling. What do you need?",
            "emotion": "professional"
        }
    
    def engage_customer(self, vehicle_id: str, diagnosis: Dict[str, Any]) -> Dict[str, Any]:
        component = diagnosis.get('component', '').lower().replace(' ', '_')
        flow = self.conversation_flows.get(component, self._default_flow())
        
        # Full conversation sequence
        conversation = {
            'greeting': f"Hello, this is RoadIQ AI calling about your vehicle {vehicle_id}.",
            'alert': flow['alert'],
            'explanation': flow['explanation'],
            'consequences': flow['consequences'],
            'solution': flow['solution'],
            'urgency': flow['urgency'],
            'closing': "Would you like me to schedule this service immediately? I can book the nearest available slot."
        }
        
        # Simulate customer response based on urgency and explanation quality
        urgency_str = diagnosis.get('urgency', 'Low')
        urgency_factor = 0.95 if urgency_str == 'Critical' else 0.8 if urgency_str == 'High' else 0.6
        agreed = random.random() < urgency_factor
        
        return {
            'vehicle_id': vehicle_id,
            'conversation': conversation,
            'agreed': agreed,
            'response_time': '3 minutes',
            'preferred_time': 'Morning' if agreed else 'Afternoon',
            'contact_method': 'voice_call',
            'customer_concerns': self._generate_concerns(component),
            'follow_up_needed': not agreed
        }

    def generate_voice_message(self, diagnosis: Dict[str, Any]) -> str:
        component = diagnosis.get('component', '').lower().replace(' ', '_')
        flow = self.conversation_flows.get(component, self._default_flow())
        return f"{flow['alert']} {flow['explanation']} {flow['solution']}"
    
    def _default_flow(self):
        return {
            'alert': "MAINTENANCE REQUIRED: Your vehicle needs attention.",
            'explanation': "Our diagnostic systems detected component wear beyond normal parameters.",
            'consequences': "Continued operation may result in unexpected breakdowns and higher repair costs.",
            'solution': "Schedule preventive maintenance to avoid costly repairs.",
            'urgency': "Medium - Schedule within 30 days"
        }
    
    def _generate_concerns(self, component: str):
        concerns = {
            'brake_system': ['Safety for family', 'Cost of repair', 'Time without vehicle'],
            'engine': ['Reliability', 'Warranty coverage', 'Towing costs'],
            'suspension': ['Ride comfort', 'Tire replacement', 'Handling safety'],
            'transmission': ['Repair vs replace', 'Warranty options', 'Alternative transportation']
        }
        return concerns.get(component, ['General maintenance', 'Cost concerns', 'Scheduling'])
    
    def communicate_with_manufacturer(self, batch_data, failure_patterns):
        """Generate manufacturer communication for quality issues"""
        # Note: This method was in the snippet, keeping for completeness but dependencies on data format exist
        messages = []
        from datetime import datetime
        
        for batch_id, data in batch_data.items():
            if data['failure_rate'] > 0.7:
                message = self.manufacturer_templates['recall_recommendation'].format(
                    count=data['vehicle_count'],
                    batch_id=batch_id
                )
                messages.append({
                    'type': 'recall_alert',
                    'priority': 'critical',
                    'message': message,
                    'batch_id': batch_id,
                    'timestamp': datetime.now().isoformat()
                })
            elif data['failure_rate'] > 0.5:
                message = self.manufacturer_templates['quality_alert'].format(
                    batch_id=batch_id,
                    failure_rate=int(data['failure_rate'] * 100),
                    component=data['primary_component']
                )
                messages.append({
                    'type': 'quality_alert',
                    'priority': 'high',
                    'message': message,
                    'batch_id': batch_id,
                    'timestamp': datetime.now().isoformat()
                })
        
        return messages
    
    def generate_manufacturer_voice_alert(self, alert_data):
        """Generate voice message for manufacturer alerts"""
        if alert_data['type'] == 'recall_alert':
            return f"URGENT: Batch {alert_data['batch_id']} requires immediate recall. Multiple vehicle failures detected. Initiate supplier investigation and customer notification protocol."
        elif alert_data['type'] == 'quality_alert':
            return f"Quality Alert: Batch {alert_data['batch_id']} showing elevated failure rates. Recommend enhanced quality control and supplier audit."
        return "Manufacturing quality issue detected. Review required."
