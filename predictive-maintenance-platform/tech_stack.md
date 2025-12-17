# RoadIQ Project: Technology Stack Documentation

This document outlines the complete technology stack used to build the **RoadIQ** Autonomous Vehicle Health Platform.

---

## 1. Frontend (User Interface)
The frontend is built as a **Single Page Application (SPA)** to ensure a smooth, app-like experience without page reloads.

| Technology | Purpose in RoadIQ |
| :--- | :--- |
| **React.js (v18)** | The core JavaScript library for building the component-based UI (Dashboards, Cards, Modals). |
| **Vite** | Next-generation build tool that provides instant server start and fast Hot Module Replacement (HMR). |
| **Tailwind CSS** | Utility-first CSS framework used for all styling (Glassmorphism, Gradients, Responsive Layouts). |
| **Framer Motion** | Production-ready animation library. Used for: <br>• Smooth page transitions <br>• Hover effects on Agent cards <br>• The "breathing" animation of the Digital Twin. |
| **Recharts** | Composable charting library used for the Failure Trends graph and Batch Quality Index visualization. |
| **Lucide React** | Modern, consistent icon set used throughout the app (Sidebar icons, Warning emblems). |
| **React Leaflet** | Warning system map visualization. Wraps `Leaflet.js` to display the "Failure Hotspots" map data. |
| **React Router** | Handles navigation between the 3 views (Owner, Service, Manufacturer) and the Landing Page. |

---

## 2. Backend (API & Intelligence)
The backend serves as the orchestration layer for the multi-agent system.

| Technology | Purpose in RoadIQ |
| :--- | :--- |
| **Python 3.10+** | The primary programming language chosen for its rich ecosystem in AI and Data Science. |
| **FastAPI** | High-performance async web framework. It builds the REST APIs (`/vehicle-health`, `/voice/speak`) that the Frontend calls. |
| **Uvicorn** | An ASGI web server implementation used to run the FastAPI application. |
| **Pyttsx3** | Offline Text-to-Speech (TTS) conversion library. <br>• Used by **MasterAgent** & **CustomerAgent** to generate voice audio. |
| **Pywin32** | Provides access to the Windows Component Object Model (COM). <br>• **Critical** for running the SAPI5 voice engine in a dedicated background thread without freezing the server. |
| **Pandas** | High-performance data manipulation tool. <br>• Used by **DataAgent** & **DiagnosisAgent** to read `vehicle_data.csv` and filter rows efficiently. |
| **NumPy** | Fundamental package for scientific computing. Used for numerical operations in risk calculation. |
| **Scikit-learn** | Machine Learning library. Included for the Random Forest / Isolation Forest models used in the `DiagnosisAgent` (simulated/simplified for demo). |

---

## 3. Data & Infrastructure
For this standalone demo version, we prioritize portability and ease of setup.

| Technology | Purpose in RoadIQ |
| :--- | :--- |
| **CSV Files** | *vehicle_data.csv* serves as the simulation "database", storing telemetry history and sensor readings. |
| **Supabase (Client)** | Included in the frontend code (`supabaseClient.js`) for future cloud synchronization capabilities (Real-time subscriptions). |
| **Local Memory** | The **Agent Monitor** and **Master Agent** store immediate session state (active alerts, queue messages) in Python's runtime memory. |

---

## 4. Development Tools
| Technology | Purpose in RoadIQ |
| :--- | :--- |
| **VS Code** | Primary Integrated Development Environment (IDE). |
| **Leaflet CSS** | Base styles for the map component. |
| **Queue (Python)** | Standard library module used to implement the **Thread-Safe Voice Worker**, solving the "event loop blocking" problem. |

---

## Summary of Architecture
**Frontend** (React/Vite) ↔ **HTTP/JSON** ↔ **Backend** (FastAPI/Python) ↔ **Agents** (Pandas/Pyttsx3)
