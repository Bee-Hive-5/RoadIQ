from datetime import datetime, timedelta
import random

class SchedulingAgent:
    def __init__(self):
        self.service_centers = [
            {'id': 'SC001', 'name': 'Downtown Service Center', 'capacity': 8},
            {'id': 'SC002', 'name': 'North Side Auto Care', 'capacity': 6},
            {'id': 'SC003', 'name': 'Express Service Hub', 'capacity': 10}
        ]
    
    def book_service(self, vehicle_id, urgency):
        # Determine booking priority based on urgency
        if urgency == 'Critical':
            days_ahead = 1
            priority = 'Emergency'
        elif urgency == 'High':
            days_ahead = 2
            priority = 'High Priority'
        elif urgency == 'Medium':
            days_ahead = 7
            priority = 'Standard'
        else:
            days_ahead = 14
            priority = 'Routine'
        
        # Select service center based on capacity and urgency
        selected_center = self.service_centers[0] if urgency == 'Critical' else random.choice(self.service_centers)
        
        # Generate appointment time
        appointment_date = datetime.now() + timedelta(days=days_ahead)
        time_slots = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']
        selected_time = random.choice(time_slots)
        
        booking_id = f"BK{random.randint(1000, 9999)}"
        
        return {
            'booking_id': booking_id,
            'vehicle_id': vehicle_id,
            'service_center': selected_center['name'],
            'appointment_date': appointment_date.strftime('%Y-%m-%d'),
            'appointment_time': selected_time,
            'priority': priority,
            'estimated_duration': '2 hours',
            'status': 'Confirmed'
        }
    
    def get_available_slots(self, urgency):
        # Mock available slots based on urgency
        base_date = datetime.now()
        slots = []
        
        for i in range(1, 8):
            date = base_date + timedelta(days=i)
            # Simplified mock logic
            for time in ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']:
                slots.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'time': time,
                    'available': random.choice([True, False])
                })
        
        return slots
