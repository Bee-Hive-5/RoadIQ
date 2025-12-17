import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import OwnerDashboard from './pages/OwnerDashboard';
import ManufacturerDashboard from './pages/ManufacturerDashboard';
import ServiceAdminDashboard from './pages/ServiceAdminDashboard';
import AgentMonitor from './pages/AgentMonitor';
import AgentPlayground from './pages/AgentPlayground';
import GeoMap from './pages/Map';
import Login from './pages/Login';
import VoiceAssistant from './components/VoiceAssistant';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<OwnerDashboard />} />
          <Route path="/service" element={<ServiceAdminDashboard />} />
          <Route path="/manufacturer" element={<ManufacturerDashboard />} />
          <Route path="/agents" element={<AgentMonitor />} />
          <Route path="/agents-interactive" element={<AgentPlayground />} />
          <Route path="/map" element={<GeoMap />} />
        </Route>
      </Routes>
      <VoiceAssistant />
    </Router>
  );
}

export default App;
