# 🎬 RoadIQ: Technical Demo Script (4 Minutes)

**Presenter Goal:** Demonstrate the autonomy, security, and integration of the 7-Agent System.
**Setup:**
- Open Browser to: `http://localhost:5173/` (Landing Page)
- Ensure Backend (`port 8000`) and Frontend (`port 5173`) are running.
- Ensure Audio is on (for Voice Demo).

---

## ⏱️ PHASE 1: THE HOOK (0:00 - 0:45)
**Screen:** `Landing.jsx` (Root URL)

**Action 1:**
- **Visual:** Show the Hero Section with the "RoadIQ" logo and text "AI-Powered Predictive Maintenance Portal".
- **Cursor:** Hover over the "Vehicles that think ahead" tagline.

> **Presenter:**
> "Judges, we are moving from *connected* vehicles to *autonomous* maintenance. This is RoadIQ.
> Existing platforms just show you error codes. RoadIQ uses a multi-agent neuro-symbolic architecture to predict, schedule, and solve problems before the driver even notices."

**Action 2:**
- **Click:** The **"Launch Dashboard"** gradient button in the center.
- **Transition:** Browser navigates to `/agents-interactive` (Agent Playground).

> **Presenter:**
> "Let's log directly into the Neural Core. Unlike traditional dashboards that just show charts, this is our **Agent Playground**—the live control plane for our 7 autonomous agents."

---

## ⏱️ PHASE 2: ORCHESTRATION & AGENTS (0:45 - 1:45)
**Screen:** `AgentPlayground.jsx`

**Action 3:**
- **Visual:** Point out the grid of cards (Master, Data, Diagnosis, Manufacturing, etc.).
- **Click:** Locate the **Master Agent** card (Purple). Click **"Run Full Analysis"**.

> **Presenter:**
> "Watch the Master Agent. I'm triggering a full fleet scan. It's not just running a script; it's orchestrating a chain of thought.
> First, it commands the **Data Agent** to ingest telemetry.
> Then, it passes that context to the **Diagnosis Agent** to run a failure prediction model."

**Action 4:**
- **Visual:** Wait for the green "Decision" text to appear in the log window (e.g., "Decision: Urgent Service...").
- **Cursor:** Highlight the **Diagnosis Agent** card (Green) showing the output.

> **Presenter:**
> "See that? The system detected a 'Brake System Risk' with 78% probability. It didn't just log it—it autonomously decided that this is 'Critical'."

---

## ⏱️ PHASE 3: SECURITY & OPERATIONS (1:45 - 2:45)
**Screen:** `AgentPlayground.jsx` (Still here)

**Action 5:**
- **Visual:** Move cursor to the **UEBA Agent** card (Red, bottom right).
- **Click:** Click the **"Simulate Breach"** button.

> **Presenter:**
> "But connectivity brings risk. Let's simulate a hostile injection attempt on the vehicle's CAN bus.
> I'm clicking 'Simulate Breach'. Instantly, the **UEBA (User & Entity Behavior Analytics) Agent** intercepts the anomaly pattern and blocks the IP."

**Action 6:**
- **Click:** Sidebar Navigation -> **"Manufacturer"** (Car Icon).
- **Transition:** Browser navigates to `/manufacturer`.

> **Presenter:**
> "This intelligence loops back to the factory. Here on the **Manufacturer Dashboard**, the **Manufacturing Agent** has already flagged 'Batch-X99' based on the failure data we just analyzed. This creates a closed feedback loop from road to factory."

---

## ⏱️ PHASE 4: THE USER EXPERIENCE (2:45 - 3:30)
**Screen:** `AgentPlayground.jsx` (Click "Playground" in Sidebar to return).

**Action 7:**
- **Visual:** Locate the **Floating Microphone Button** (Bottom Right).
- **Click:** Click the button to expand the Voice Menu.

> **Presenter:**
> "Finally, how does the driver interact with this complexity? They don't. They just ask."

**Action 8:**
- **Click:** Select the option: **"Is it safe to drive?"**
- **Audio Output:** *System speaks in an **Urgent/Fast** tone: "With 78% brake failure risk, limit driving... Schedule service immediately."*

> **Presenter:**
> "Did you hear the urgency? Our **Customer Agent** uses emotional modulation. It detected 'High Risk', so it spoke faster and louder to alert the driver."

**Action 9:**
- **Click:** Select the option: **"Is my vehicle under warranty?"**
- **Audio Output:** *System speaks in a **Calm** tone: "Yes, your 3-year warranty is active..."*

> **Presenter:**
> "But for a simple warranty question, it shifts to a calm, reassuring tone. Context-aware empathy."

---

## ⏱️ PHASE 5: CONCLUSION (3:30 - 4:00)
**Screen:** `AgentPlayground.jsx`

**Action 10:**
- **Visual:** Quick pan over the 7 Agent Cards one last time.

> **Presenter:**
> "This is RoadIQ. Seven specialized agents. One orchestrator.
> From detecting a brake failure, to booking the repair, to securing the data, to comforting the driver—it's all autonomous.
> We aren't just predicting maintenance; we're automating peace of mind. Thank you."

**[END RECORDING]**
