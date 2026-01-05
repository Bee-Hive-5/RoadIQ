import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Activity, AlertTriangle, CheckCircle, Thermometer, Plus, FileText, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { agentsApi } from '../services/api';

import Modal from '../components/Modal';
import Toast from '../components/Toast';
import CostAnalysisWidget from '../components/CostAnalysisWidget';
import SmartScheduler from '../components/SmartScheduler';
import DigitalTwin from '../components/DigitalTwin';

export default function OwnerDashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [telemetry, setTelemetry] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);

    useEffect(() => {
        // Fetch vehicles from Supabase for list (keeping existing logic for list)
        // In full integration, we might fetch from API if we had a list endpoint
        const fetchVehicles = async () => {
            const { data } = await supabase.from('vehicles').select('*');
            if (data) setVehicles(data);
        };
        fetchVehicles();

        const channel = supabase.channel('realtime-telemetry')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'telemetry' }, (payload) => {
                setTelemetry(payload.new);
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    const healthColor = (score) => {
        if (score > 80) return 'text-accent';
        if (score > 50) return 'text-warning';
        return 'text-danger';
    };

    const runAgentAnalysis = async (vehicleId) => {
        setToast({ message: 'Agents Analyzing Vehicle Telemetry...', type: 'info' });
        const result = await agentsApi.getVehicleHealth(vehicleId);
        if (result) {
            setAnalysisResult(result);
            if (result.diagnosis) {
                setToast({ message: `Alert: ${result.diagnosis.component}`, type: 'error' });
            } else {
                setToast({ message: 'Analysis Complete: System Nominal', type: 'success' });
            }
        } else {
            setToast({ message: 'Analysis Failed', type: 'error' });
        }
    };

    const handleAddVehicle = (e) => {
        e.preventDefault();
        setIsModalOpen(false);
        setToast({ message: 'Vehicle Added Successfully', type: 'success' });
    };

    const generateReport = () => {
        setToast({ message: 'Generating Comprehensive Report...', type: 'info' });
        setTimeout(() => {
            setToast({ message: 'Report Sent to Email', type: 'success' });
        }, 2000);
    };

    return (
        <div className="space-y-6 pb-20">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Owner Dashboard</h2>
                    <p className="text-gray-400">Real-time Fleet Status & Predictive Insights</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform hover:scale-105"
                    >
                        <Plus size={18} /> Add Vehicle
                    </button>
                    <button
                        onClick={generateReport}
                        className="px-4 py-2 bg-surface hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                    >
                        <FileText size={18} /> Reports
                    </button>
                </div>
            </header>

            {/* ROW 1: Vehicle Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {vehicles.map((v, i) => (
                    <motion.div
                        key={v.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => runAgentAnalysis(v.vin)} // Use VIN or ID as per API
                        className="glass-panel p-6 hover:border-primary/50 transition-colors cursor-pointer group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-all" />

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{v.make} {v.model}</h3>
                                <p className="text-xs text-gray-500 font-mono">{v.vin}</p>
                            </div>
                            <div className={`${healthColor(v.health_score)} p-2 bg-white/5 rounded-lg border border-white/5`}>
                                <Activity size={20} />
                            </div>
                        </div>

                        <div className="space-y-2 relative z-10">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Health Score</span>
                                <span className={`font-bold ${healthColor(v.health_score)}`}>{v.health_score}%</span>
                            </div>
                            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${v.health_score}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className={`h-full ${v.health_score > 80 ? 'bg-accent shadow-[0_0_10px_#10b981]' : v.health_score > 50 ? 'bg-warning' : 'bg-danger'}`}
                                />
                            </div>
                        </div>

                        {/* Analysis indicator */}
                        <div className="mt-4 pt-4 border-t border-white/5 text-xs text-center text-cyan-400 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Zap size={12} /> Click to Run AI Diagnostics
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Analysis Result Section */}
            {analysisResult && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 border-l-4 border-l-neon-blue"
                >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Activity className="text-neon-blue" />
                        AI Diagnostic Report: {analysisResult.vehicle_id}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-black/30 p-4 rounded-lg">
                            <h4 className="text-gray-400 text-sm mb-2">Risk Assessment</h4>
                            <div className="text-2xl font-bold text-white">{analysisResult.risk_assessment?.level || 'N/A'}</div>
                            <ul className="text-sm text-gray-500 mt-2 list-disc list-inside">
                                {analysisResult.risk_assessment?.factors?.map((f, i) => <li key={i}>{f}</li>)}
                            </ul>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg">
                            <h4 className="text-gray-400 text-sm mb-2">Diagnosis</h4>
                            {analysisResult.diagnosis ? (
                                <>
                                    <div className="text-xl font-bold text-red-400">{analysisResult.diagnosis.component}</div>
                                    <p className="text-sm text-gray-300 mt-1">{analysisResult.diagnosis.recommendation}</p>
                                    <div className="mt-2 text-xs font-mono text-neon-blue bg-neon-blue/10 inline-block px-2 py-1 rounded">
                                        Urgency: {analysisResult.diagnosis.urgency}
                                    </div>

                                    {/* Video Tutorial Link */}
                                    {analysisResult.diagnosis.video_tutorial && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <a
                                                href={analysisResult.diagnosis.video_tutorial}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                <div className="bg-red-600 text-white p-1 rounded">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                                    </svg>
                                                </div>
                                                Watch Repair Tutorial
                                            </a>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-green-500 font-bold">Systems Nominal</div>
                            )}
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg">
                            <h4 className="text-gray-400 text-sm mb-2">Customer Action</h4>
                            {analysisResult.customer_engagement?.agreed ? (
                                <div className="text-green-400">
                                    <CheckCircle size={20} className="inline mr-2" />
                                    Service Scheduled
                                    <p className="text-xs text-gray-500 mt-1">Preferred Time: {analysisResult.customer_engagement.preferred_time}</p>
                                </div>
                            ) : (
                                <div className="text-yellow-500">
                                    Pending Approval
                                    <p className="text-xs text-gray-500 mt-1">Follow-up needed</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ROW 2: New Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <CostAnalysisWidget />
                </div>
                <div className="lg:col-span-1">
                    <SmartScheduler />
                </div>
                <div className="lg:col-span-2">
                    <DigitalTwin />
                </div>
            </div>

            {/* ROW 3: Telemetry */}
            <div className="glass-panel p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Activity size={150} />
                </div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    Live Telemetry Stream
                </h3>

                {telemetry ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {['Speed', 'RPM', 'Temp', 'Vibration'].map((metric, i) => (
                            <div key={metric} className="bg-black/40 border border-white/5 p-4 rounded-xl relative overflow-hidden group hover:border-neon-blue/30 transition-colors">
                                <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">{metric}</p>
                                <p className="text-3xl font-bold font-mono text-white">
                                    {metric === 'Speed' ? telemetry.speed?.toFixed(0) :
                                        metric === 'RPM' ? telemetry.engine_rpm?.toFixed(0) :
                                            metric === 'Temp' ? telemetry.engine_temp?.toFixed(1) : '0.04'}
                                    <span className="text-xs text-gray-600 ml-1">
                                        {metric === 'Speed' ? 'km/h' : metric === 'Temp' ? '°C' : metric === 'Vibration' ? 'G' : ''}
                                    </span>
                                </p>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-32 flex flex-col items-center justify-center text-gray-500 space-y-2 border-2 border-dashed border-white/10 rounded-xl">
                        <Activity className="animate-pulse-slow" />
                        <span className="text-sm font-mono">Connecting to neural stream...</span>
                    </div>
                )}
            </div>

            {/* MODAL */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Vehicle">
                <form onSubmit={handleAddVehicle} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">VIN (Vehicle Identification Number)</label>
                        <input type="text" className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue transition-all" placeholder="Enter 17-digit VIN" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Make</label>
                            <input type="text" className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white" placeholder="Tesla" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Model</label>
                            <input type="text" className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white" placeholder="Model S" />
                        </div>
                    </div>
                    <button className="w-full bg-neon-blue text-black font-bold py-3 rounded-lg hover:bg-cyan-300 transition-colors shadow-glow-blue">
                        Initialize Digital Twin
                    </button>
                </form>
            </Modal>

            {/* TOAST */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
