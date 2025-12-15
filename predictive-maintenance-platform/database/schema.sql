-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- 1. USERS & ROLES
CREATE TABLE public.roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    role_id INTEGER REFERENCES public.roles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 2. VEHICLES
CREATE TABLE public.vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vin VARCHAR(17) UNIQUE NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    owner_id UUID REFERENCES public.user_profiles(id),
    health_score FLOAT DEFAULT 100.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 3. TELEMETRY (High frequency data)
CREATE TABLE public.telemetry (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id),
    speed FLOAT,
    engine_rpm FLOAT,
    engine_temp FLOAT,
    battery_voltage FLOAT,
    tire_pressure FLOAT,
    vibration_level FLOAT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 4. PREDICTIONS (AI Results)
CREATE TABLE public.predictions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id),
    failure_probability FLOAT,
    -- 0.0 to 1.0
    predicted_failure_type VARCHAR(100),
    remaining_useful_life INTEGER,
    -- in days
    components_at_risk TEXT [],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 5. SERVICE BOOKINGS
CREATE TABLE public.service_bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id),
    service_center_id UUID REFERENCES public.user_profiles(id),
    booking_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'PENDING',
    -- PENDING, CONFIRMED, COMPLETED
    description TEXT,
    severity_level VARCHAR(20),
    -- LOW, MEDIUM, HIGH, CRITICAL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 6. AGENT LOGS (Explainable AI & Audit)
CREATE TABLE public.agent_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_name VARCHAR(50),
    -- 'Master', 'Predictor', 'Scheduler'
    action_type VARCHAR(50),
    -- 'ALERT', 'BOOK_SERVICE', 'NOTIFY_OWNER'
    vehicle_id UUID REFERENCES public.vehicles(id),
    details JSONB,
    decision_confidence FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 7. RCA & FEEDBACK (Manufacturing loop)
CREATE TABLE public.rca_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES public.service_bookings(id),
    root_cause TEXT,
    failed_component VARCHAR(100),
    manufacturer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- RLS POLICIES (Simplified for Hackathon - allow all for authenticated)
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.vehicles FOR
SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.vehicles FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
ALTER TABLE public.telemetry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read all" ON public.telemetry FOR
SELECT USING (true);
CREATE POLICY "Enable insert all" ON public.telemetry FOR
INSERT WITH CHECK (true);
-- Enable Realtime
ALTER PUBLICATION supabase_realtime
ADD TABLE public.telemetry;
ALTER PUBLICATION supabase_realtime
ADD TABLE public.predictions;
ALTER PUBLICATION supabase_realtime
ADD TABLE public.agent_logs;
ALTER PUBLICATION supabase_realtime
ADD TABLE public.vehicles;