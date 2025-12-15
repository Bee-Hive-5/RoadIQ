import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY

// MOCK DATA FOR HACKATHON DEMO (When keys are missing)
const MOCK_DATA = {
    vehicles: [
        { id: '1', vin: 'VIN-8821-DEMO', make: 'Tesla', model: 'Model S Plaid', year: 2024, health_score: 92, owner_id: 'user1' },
        { id: '2', vin: 'VIN-9932-DEMO', make: 'Ford', model: 'Mach-E', year: 2023, health_score: 45, owner_id: 'user1' },
        { id: '3', vin: 'VIN-7744-DEMO', make: 'Rivian', model: 'R1T', year: 2024, health_score: 98, owner_id: 'user2' }
    ],
    agent_logs: [
        { id: '1', agent_name: "Master Agent", action_type: "ANALYSIS", created_at: new Date().toISOString(), details: { message: "System initialized" }, decision_confidence: 0.99 }
    ]
};

class MockSupabaseClient {
    from(table) {
        return {
            select: () => Promise.resolve({ data: MOCK_DATA[table] || [], error: null }),
            insert: (payload) => Promise.resolve({ data: payload, error: null }),
            update: () => Promise.resolve({ data: [], error: null }),
            eq: () => ({ execute: () => Promise.resolve({ data: [], error: null }) }), // Simplified
        };
    }
    channel() {
        return {
            on: () => ({ subscribe: () => {} }),
            subscribe: () => {}
        };
    }
    removeChannel() {}
    
    get auth() {
        return {
            signInWithOtp: () => Promise.resolve({ error: null }),
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
        };
    }
}

// Fallback to Mock if no keys provided, OR if the user manually wants execution without backend
let client;
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("your-project")) {
    console.warn("⚠️ SUPABASE CREDENTIALS MISSING: Using Mock Client for Demo");
    client = new MockSupabaseClient();
} else {
    try {
        client = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
        console.error("Supabase Init Error:", e);
        client = new MockSupabaseClient();
    }
}

export const supabase = client;
