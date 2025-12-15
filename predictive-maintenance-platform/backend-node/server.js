import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // Load from root .env

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'placeholder';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- SIMULATED DATA (Since we can't seed properly without Python/Docker sometimes) ---
const MOCK_VEHICLES = [
    { id: 'v1', vin: 'VIN-1234-TESLA', make: 'Tesla', model: 'Model 3', year: 2023, health_score: 98, owner_id: 'user1' },
    { id: 'v2', vin: 'VIN-5678-FORD', make: 'Ford', model: 'F-150 Lightning', year: 2022, health_score: 45, owner_id: 'user1' },
    { id: 'v3', vin: 'VIN-9012-BMW', make: 'BMW', model: 'i4', year: 2024, health_score: 100, owner_id: 'user2' },
];
const MOCK_LOGS = [];

// --- ENDPOINTS ---

app.get('/', (req, res) => {
    res.json({ status: "System Online (Node.js Fallback)", agents: "active" });
});

app.get('/api/vehicles', async (req, res) => {
    // Try Supabase first, fallback to mock
    try {
        const { data, error } = await supabase.from('vehicles').select('*');
        if (!error && data && data.length > 0) return res.json(data);
    } catch (e) {}
    res.json(MOCK_VEHICLES);
});

app.get('/api/vehicles/:id', async (req, res) => {
    // Simple mock detail return
    const v = MOCK_VEHICLES.find(x => x.id === req.params.id) || MOCK_VEHICLES[0];
    res.json({ vehicle: v, history: [] });
});

app.get('/api/agents/logs', (req, res) => {
    res.json(MOCK_LOGS);
});

app.post('/api/agents/simulate/:id', (req, res) => {
    const { id } = req.params;
    const body = req.body;
    
    // Simulate Agent Logic immediately
    const risk = body.engine_temp > 95 ? 0.9 : 0.1;
    
    const log = {
        id: Date.now(),
        agent_name: "Prediction Agent",
        action_type: risk > 0.5 ? "ALERT" : "ANALYSIS",
        vehicle_id: id,
        details: { risk, temp: body.engine_temp },
        created_at: new Date().toISOString(),
        decision_confidence: 0.99
    };
    MOCK_LOGS.unshift(log);
    
    if (risk > 0.5) {
        MOCK_LOGS.unshift({
            id: Date.now() + 1,
            agent_name: "Master Agent",
            action_type: "ALERT_TRIGGER",
            vehicle_id: id,
            details: { message: "Critical failure imminent!" },
            created_at: new Date().toISOString(),
            decision_confidence: 1.0
        });
        
        // Update local mock state (hacky sync)
        const v = MOCK_VEHICLES.find(x => x.id === id);
        if (v) v.health_score = 20;
    }
    
    res.json({ status: "Agent Processed", risk });
});

app.get('/api/dashboard/stats', (req, res) => {
    res.json({
        total_vehicles: MOCK_VEHICLES.length,
        active_alerts: MOCK_LOGS.filter(l => l.action_type === 'ALERT').length,
        pending_services: 5
    });
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
