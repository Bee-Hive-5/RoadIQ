from datetime import datetime
import random

class UEBAAgent:
    def __init__(self):
        self.agent_permissions = {
            'DataAgent': ['read_sensor_data', 'analyze_trends'],
            'DiagnosisAgent': ['read_sensor_data', 'access_ml_model'],
            'CustomerAgent': ['read_customer_data', 'send_notifications'],
            'SchedulingAgent': ['read_calendar', 'book_appointments'],
            'ManufacturingAgent': ['read_batch_data', 'generate_reports'],
            'MasterAgent': ['*'] # Master Agent has all permissions
        }
        self.security_logs = []
        
    def monitor_agent_action(self, agent_name, action, resource):
        # Check if action is permitted for this agent
        permitted_actions = self.agent_permissions.get(agent_name, [])
        is_allowed = '*' in permitted_actions or action in permitted_actions
        
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'agent': agent_name,
            'action': action,
            'resource': resource,
            'status': 'allowed' if is_allowed else 'blocked',
            'risk_level': 'low'
        }
        
        # Detect anomalies
        if not is_allowed:
            log_entry['risk_level'] = 'high'
            log_entry['alert'] = f"Unauthorized action: {agent_name} attempted {action}"
            
        # Specific anomaly patterns
        if agent_name == 'SchedulingAgent' and 'sensor_data' in resource:
            log_entry['status'] = 'blocked'
            log_entry['risk_level'] = 'medium'
            log_entry['alert'] = "Scheduling agent accessing sensor data - potential privilege escalation"
            
        if agent_name == 'CustomerAgent' and 'manufacturing' in resource:
            log_entry['status'] = 'blocked'
            log_entry['risk_level'] = 'high'
            log_entry['alert'] = "Customer agent accessing manufacturing data - data breach attempt"
        
        self.security_logs.append(log_entry)
        return log_entry
    
    def get_alerts(self):
        # Generate some sample security alerts for demo if logs are empty, 
        # otherwise use real logs.
        # For the sake of the demo script, we can mix them.
        
        sample_alerts = [
            {
                'id': 'ALERT001',
                'timestamp': datetime.now().isoformat(),
                'severity': 'Medium',
                'agent': 'SchedulingAgent',
                'description': 'Attempted unauthorized sensor data access',
                'status': 'Blocked',
                'action_taken': 'Access denied, agent permissions reviewed'
            },
            {
                'id': 'ALERT002', 
                'timestamp': datetime.now().isoformat(),
                'severity': 'Low',
                'agent': 'DataAgent',
                'description': 'Unusual data access pattern detected',
                'status': 'Monitoring',
                'action_taken': 'Increased logging enabled'
            }
        ]
        
        return {
            'active_alerts': sample_alerts,
            'total_events': len(self.security_logs),
            'blocked_actions': len([log for log in self.security_logs if log.get('status') == 'blocked']),
            'security_score': 85  # Mock security score
        }
    
    def validate_agent_behavior(self, agent_name):
        # Baseline behavior validation
        recent_actions = [log for log in self.security_logs if log['agent'] == agent_name]
        
        if len(recent_actions) > 100:  # Too many actions
            return {'status': 'anomaly', 'reason': 'Excessive activity detected'}
        
        blocked_count = len([log for log in recent_actions if log.get('status') == 'blocked'])
        if blocked_count > 5:  # Too many blocked actions
            return {'status': 'suspicious', 'reason': 'Multiple unauthorized attempts'}
            
        return {'status': 'normal', 'reason': 'Behavior within expected parameters'}
