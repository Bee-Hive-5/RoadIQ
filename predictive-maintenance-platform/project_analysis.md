# RoadIQ: Deep Technical Analysis & Functionality Report

This document provides a deep-dive analysis of the **RoadIQ** platform, explaining its "Digital Twin" architecture, user roles, agent orchestration, and specific technical implementations.

---

## 1. Core Concept: The Digital Twin
RoadIQ is not just a dashboard; it is a **Digital Twin** platform.
-   **Definition:** A digital replica of a physical asset (the car) that updates in real-time.
-   **Implementation:**
    -   **Telemetry Stream:** The `OwnerDashboard.jsx` subscribes to a real-time data stream (simulated via `supabase` channels and `vehicle_data.csv`).
    -   **Live Synchronization:** As the "physical" car's data (Speed, RPM, Temp) changes, the "digital" car on the screen updates instantly.
    -   **Predictive Layer:** Unlike a passive twin that just shows data, RoadIQ uses AI to predict the *future* state of the twin (e.g., "Brake failure in 200 miles").

---

## 2. The Three User Views (Role-Based Access)
 The system uses a **Role-Based Architecture** controlled by `Layout.jsx`. The "Demo Role Switcher" allows instant toggling between these three perspectives:

### View 1: Vehicle Owner (The "Digital Twin" Dashboard)
*File: `OwnerDashboard.jsx`*
-   **Purpose:** For the driver to monitor their specific car.
-   **Key Functionalities:**
    -   **Health Scores:** A visual 0-100% health bar calculated by the **Data Agent**.
    -   **Telematics Grid:** Real-time gauges for Speed, RPM, and Vibration.
    -   **One-Click Diagnostics:** Clicking a car triggers the `MasterAgent.analyze_vehicle()` chain.
    -   **Voice Integration:** The driver can ask "Is it safe to drive?" via the floating microphone (`VoiceAssistant.jsx`).

### View 2: Service Admin (The "Repair Shop" Dashboard)
*File: `ServiceAdminDashboard.jsx`*
-   **Purpose:** For mechanics and shop managers to handle incoming repairs.
-   **Key Functionalities:**
    -   **AI Scheduler:** Automatically books slots (`SmartScheduler` component) based on the **Diagnosis Agent's** urgency rating.
    -   **AR Maintenance Guide:** An Augmented Reality component (`ARGuide`) that overlays repair instructions on the vehicle part.
    -   **Urgency Sorting:** Critical alerts (e.g., "Brake Failure") are prioritized over routine tasks (e.g., "Tire Rotation").

### View 3: Manufacturer (The "Factory" Dashboard)
*File: `ManufacturerDashboard.jsx`*
-   **Purpose:** For R&D engineers to analyze fleet-wide patterns.
-   **Key Functionalities:**
    -   **Batch Analysis:** The **Manufacturing Agent** groups failures by production batch (e.g., "Batch-X99").
    -   **Root Cause Analysis (RCA):** A table linking specific failures to engineering specs (e.g., "Thermal expansion exceeding tolerances").
    -   **Blockchain Visualizer:** A component verifying the supply chain integrity of failed parts.

---

## 3. The 7 Autonomous Agents (Backend Architecture)
The backend (`/backend/app/agents/`) is built on a **Neuro-Symbolic Architecture**.
-   **Neuro:** Machine Learning models (Random Forest) for prediction.
-   **Symbolic:** Rule-based logic for decision making.

### 1. Master Agent (The Orchestrator)
-   **File:** `master_agent.py`
-   **Role:** The "Boss". It does not do the work itself; it delegates.
-   **Workflow:**
    1.  Receives request -> Calls **UEBA Agent** (Security Check).
    2.  Calls **Data Agent** (Fetch Context).
    3.  Calls **Diagnosis Agent** (Get Prediction).
    4.  Calls **Manufacturing Agent** (Log Pattern).
    5.  Calls **Customer Agent** (Format Response).
    6.  Returns final JSON.

### 2. Data Agent (The Sensor Hub)
-   **File:** `data_agent.py`
-   **Role:** Ingests raw noisy data from sensors (CSV) and cleans it. It calculates the raw "Risk Score" (0-100).

### 3. Diagnosis Agent await (The Doctor)
-   **File:** `diagnosis_agent.py`
-   **Role:** Takes the clean data and predicts *specific* failures.
-   **Logic:** Uses specific thresholds (e.g., `if vibration > 80: Critical`) to output a `diagnosis` object containing `component`, `urgency`, and `recommendation`.

### 4. UEBA Agent (The Security Guard)
-   **File:** `ueba_agent.py`
-   **Role:** **User & Entity Behavior Analytics**. It monitors *who* is asking for data.
-   **Feature:** If an IP address makes too many requests or requests authorized data (SQL Injection pattern), it blocks the user. Visible in `AgentMonitor.jsx`.

### 5. Manufacturing Agent (The R&D Analyst)
-   **File:** `manufacturing_agent.py`
-   **Role:** Looks for patterns *across* vehicles. If 5 cars fail with the same "Brake Caliper", it flags a "Batch Defect".

### 6. Scheduling Agent (The Logistics Manager)
-   **File:** `scheduling_agent.py`
-   **Role:** Finds the optimal time for repair. It balances "Urgency" (from Diagnosis Agent) vs "Shop Availability".

### 7. Customer Agent (The Empathetic Interaction)
-   **File:** `customer_agent.py`
-   **Role:** Translates technical codes ("P0300 Misfire") into human language ("Engine issue detected"). It also handles the **Voice Emotion** logic (Urgent vs Calm).

---

## 4. Special Modules & Functionalities

### Geo-Spatial Intelligence (Map View)
*File: `Map.jsx`*
-   **Tech:** Uses **Leaflet.js** (`react-leaflet`) to render a dark-mode interactive map.
-   **Function:** It plots "Failure Hotspots". This isn't just a map of cars; it's a map of *risk*.
-   **Use Case:** If the **Manufacturing Agent** sees 50 brake failures in one city, the Map highlights that zone, suggesting a regional issue (e.g., icy roads or bad local supplier).

### Agent Monitor (The "Matrix" View)
*File: `AgentMonitor.jsx`*
-   **Tech:** A simulated terminal interface using `framer-motion` for animations.
-   **Function:** Visualizes the "Thought Process" of the AI. You see real-time logs: `> ANALYSIS_COMPLETE`, `> UEBA_CHECK_PASSED`.
-   **Purpose:** Digital trust. By showing the user *how* the AI thinks, we increase confidence in the system.

### Threaded Voice Engine
*File: `master_agent.py`* (RoadIQVoiceAPI class)
-   **Problem:** Python's audio library (`pyttsx3`) blocks the server. If it speaks, the website freezes.
-   **Solution:** Implemented a **Queue-Based Background Worker**.
    -   The main web server puts a text message into a Queue.
    -   A separate, persistent background thread wakes up, reads the queue, initializes the COM library (Windows Audio), speaks the text, and goes back to sleep.
    -   **Result:** The website stays fast ⚡ while the voice speaks fluently 🗣️.

---

## 5. Summary of Functionality
RoadIQ is a closed-loop autonomous system:
1.  **Sensing:** The **Data Agent** feels the car (Digital Twin).
2.  **Thinking:** The **Diagnosis** and **Manufacturing Agents** predict failures.
3.  **Acting:** The **Scheduling Agent** books the repair.
4.  **Communicating:** The **Customer** and **Master Agents** explain it to the human via Voice and Dashboards.
5.  **Securing:** The **UEBA Agent** watches over the whole process.
