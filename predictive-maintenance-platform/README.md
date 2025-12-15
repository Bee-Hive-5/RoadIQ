# Agentic Predictive Vehicle Maintenance Platform 🚗🤖

> **Winner of the International Hackathon (Goal)**  
> A production-grade, AI-driven platform for predicting vehicle failures before they happen, orchestrated by autonomous agents.

## 🌟 The "Wow" Factors

1.  **Neural Agent Core**: Watch the AI agents (Master, Predictor, Scheduler) debate and make decisions in real-time.
2.  **Geo-AI Hotspots**: Interactive heatmap of component failures to guide manufacturing R&D.
3.  **Voice Integration Loop**: Automated phone calls to owners when critical failures are predicted (Mocked).

## 🏗 Architecture

- **Frontend**: React + Vite + Tailwind + Framer Motion (Cyberpunk/Industrial aesthetic)
- **Backend**: Python FastAPI (High performance async API)
- **Brain**: Celery + Redis (Agent orchestration)
- **Database**: Supabase (PostgreSQL + Realtime)

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- A Supabase Project (Free Tier)

### 1. Setup Environment

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
# Edit .env with your SUPABASE_URL and SUPABASE_KEY
```

### 2. Run Database Migrations

Go to your Supabase SQL Editor and run the contents of `database/schema.sql` and `database/seed.sql`.

### 3. Launch System

```bash
docker-compose up --build
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs
- **Agent Processor**: Background (logs visible in terminal)

## 🧪 Demo Script for Judges

1.  **Login**: Click "Login" (Enter any email, it uses Magic Link or just browse as demo).
2.  **Dashboard**: Show the "Vehicle Owner Dashboard". Note the "Live Telemetry" card waiting for data.
3.  **Simulate Failure**:
    - Go to **Agent Monitor** page.
    - Click **"Simulate Failure"**.
    - _Watch_: A new log entry appears instantly as the "Prediction Agent" analyzes the data.
    - _Watch_: "Master Agent" triggers an ALERT due to high risk.
4.  **Verification**: Go back to Dashboard. The vehicle health score has dropped!
5.  **Geo-AI**: Show the Map page to see the "Cluster" of simulated failures.

## 📂 Project Structure

- `/backend`: FastAPI + Celery
- `/frontend`: React Code
- `/database`: SQL Schemas

---

_Built with ❤️ by the Elite Engineering Team._
