const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const agentsApi = {
  // Vehicle Health & Diagnosis
  getVehicleHealth: async (vehicleId) => {
    try {
      const response = await fetch(`${API_URL}/agents/vehicle-health/${vehicleId}`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },

  // Service Scheduling
  scheduleService: async (vehicleId, urgency) => {
    try {
      const response = await fetch(`${API_URL}/agents/schedule-service`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle_id: vehicleId, urgency })
      });
      return await response.json();
    } catch (error) {
      console.error('Schedule Error:', error);
      return null;
    }
  },

  // Dashboard Data (Fleet & Manufacturing)
  getDashboardData: async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard/`);
      return await response.json();
    } catch (error) {
      console.error('Dashboard Error:', error);
      return null;
    }
  },

  // Security Logs
  getUEBAAlerts: async () => {
    try {
      const response = await fetch(`${API_URL}/agents/ueba-alerts`);
      return await response.json();
    } catch (error) {
      console.error('UEBA Error:', error);
      return null;
    }
  },

  // Voice Interaction
  voiceSpeak: async (text, emotion = 'professional') => {
    try {
      const response = await fetch(`${API_URL}/agents/voice/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, emotion })
      });
      return await response.json();
    } catch (error) {
      console.error('Voice Error:', error);
      return null;
    }
  },

  voiceQuestion: async (questionType) => {
    try {
      const response = await fetch(`${API_URL}/agents/voice/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_type: questionType })
      });
      return await response.json();
    } catch (error) {
      console.error('Voice Question Error:', error);
      return null;
    }
  }
};
