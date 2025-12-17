import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu, Activity, Database, Users, Calendar, Shield, Zap,
    MessageSquare, AlertTriangle, CheckCircle, Terminal
} from 'lucide-react';
import { agentsApi } from '../services/api';

export default function AgentPlayground() {
    const [vehicleId, setVehicleId] = useState('V001');
    const [loading, setLoading] = useState(false);

    // Agent States
    const [masterLog, setMasterLog] = useState(null);
    const [dataOutput, setDataOutput] = useState(null);
    const [diagnosisOutput, setDiagnosisOutput] = useState(null);
    const [mfgOutput, setMfgOutput] = useState(null);
    const [custInput, setCustInput] = useState('');
    const [custOutput, setCustOutput] = useState(null);
    const [schedUrgency, setSchedUrgency] = useState('High');
    const [schedOutput, setSchedOutput] = useState(null);
    const [uebaLog, setUebaLog] = useState([]);

    // 1. MASTER AGENT (Orchestrator)
    const runMasterAnalysis = async () => {
        setLoading(true);
        setMasterLog({ status: 'Orchestrating Agents...', steps: [] });

        // Mocking the orchestration visualization
        const steps = ['DataAgent: Fetching Telemetry...', 'DiagnosisAgent: Running ML Model...', 'ManufacturingAgent: Checking Patterns...', 'UEBAAgent: Verifying Access...'];

        for (let i = 0; i < steps.length; i++) {
            await new Promise(r => setTimeout(r, 500));
            setMasterLog(prev => ({ ...prev, steps: [...prev.steps, steps[i]] }));
        }

        const result = await agentsApi.getVehicleHealth(vehicleId);
        if (result) {
            setMasterLog(prev => ({ ...prev, status: 'Analysis Complete', result }));
            // Auto-populate other agents if they were part of the chain
            setDataOutput(result.risk_assessment);
            setDiagnosisOutput(result.diagnosis);
            setCustOutput({ message: "Auto-generated engagement based on diagnosis." }); // Simplified for demo
        }
        setLoading(false);
    };

    // INDIVIDUAL AGENT TRIGGERS

    // 2. DATA AGENT
    const fetchRawData = async () => {
        // In real app, might have a specific endpoint, here we reuse health for demo
        const res = await agentsApi.getVehicleHealth(vehicleId);
        if (res) setDataOutput(res.risk_assessment);
    };

    // 3. CUSTOMER AGENT
    const engageCustomer = async () => {
        const res = await agentsApi.voiceSpeak(custInput || "Hello", "professional");
        setCustOutput(res);
    };

    // 5. MANUFACTURING AGENT
    const checkBatch = async () => {
        const res = await agentsApi.getDashboardData();
        if (res && res.manufacturing_quality) {
            setMfgOutput({
                batch: "BATCH-X99",
                quality: res.manufacturing_quality.quality_trend,
                issues: res.manufacturing_quality.batch_summary ? Object.keys(res.manufacturing_quality.batch_summary).length : 0
            });
        }
    };

    // 6. SCHEDULING AGENT
    const bookService = async () => {
        const res = await agentsApi.scheduleService(vehicleId, schedUrgency);
        setSchedOutput(res);
    };

    // 7. UEBA AGENT
    const simulateBreach = async () => {
        // We trigger an alert fetch which might not show immediate breach unless backend supports simulation endpoint
        // For playground, we'll mock the visual feedback of a block
        setUebaLog(prev => [...prev, { time: new Date().toLocaleTimeString(), action: "UNAUTHORIZED_ACCESS_ATTEMPT", status: "BLOCKED" }]);
    };

    return (
        <div className="space-y-6 pb-20">
            <header>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-white">Agent Playground</h2>
                <p className="text-gray-400">Interactive Control Plane for all 7 AI Agents</p>
            </header>

            {/* Global Controls */}
            <div className="glass-panel p-4 flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-gray-400">Target Vehicle:</span>
                <select
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="bg-black/50 border border-white/20 rounded px-3 py-1 text-white"
                >
                    <option value="V001">V001 (Tesla Model 3)</option>
                    <option value="V002">V002 (Ford F-150)</option>
                    <option value="V003">V003 (Toyota Camry)</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {/* 1. MASTER AGENT */}
                <motion.div layout className="glass-panel p-6 border-l-4 border-l-purple-500 relative overflow-hidden group">
                    <div className="absolute top-2 right-2 opacity-20"><Cpu size={40} /></div>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cpu className="text-purple-400" /> Master Agent</h3>
                    <p className="text-xs text-gray-400 mb-4">Orchestrator & Decision Maker</p>

                    <button
                        onClick={runMasterAnalysis}
                        disabled={loading}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded mb-4"
                    >
                        {loading ? 'Orchestrating...' : 'Run Full Analysis'}
                    </button>

                    <div className="bg-black/40 p-3 rounded h-40 overflow-y-auto text-xs font-mono space-y-1">
                        {masterLog ? (
                            <>
                                <div className="text-purple-300 border-b border-white/10 pb-1">{masterLog.status}</div>
                                {masterLog.steps.map((s, i) => <div key={i} className="text-gray-400">&gt; {s}</div>)}
                                {masterLog.result && <div className="text-green-400 mt-2">Decision: {JSON.stringify(masterLog.result.diagnosis?.recommendation || "OK")}</div>}
                            </>
                        ) : <span className="text-gray-600">Waiting for command...</span>}
                    </div>
                </motion.div>

                {/* 2. DATA AGENT */}
                <motion.div layout className="glass-panel p-6 border-l-4 border-l-blue-500 relative overflow-hidden group">
                    <div className="absolute top-2 right-2 opacity-20"><Database size={40} /></div>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database className="text-blue-400" /> Data Agent</h3>
                    <p className="text-xs text-gray-400 mb-4">Telemetry Ingestion & Risk Calc</p>

                    <button onClick={fetchRawData} className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded mb-4">Analyze Sensor Risk</button>

                    <div className="bg-black/40 p-3 rounded h-40 overflow-y-auto text-xs font-mono">
                        {dataOutput ? (
                            <pre>{JSON.stringify(dataOutput, null, 2)}</pre>
                        ) : <span className="text-gray-600">No data fetched</span>}
                    </div>
                </motion.div>

                {/* 3. DIAGNOSIS AGENT */}
                <motion.div layout className="glass-panel p-6 border-l-4 border-l-green-500 relative overflow-hidden group">
                    <div className="absolute top-2 right-2 opacity-20"><Activity size={40} /></div>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Activity className="text-green-400" /> Diagnosis Agent</h3>
                    <p className="text-xs text-gray-400 mb-4">Failure Prediction & RCA</p>

                    {/* Triggered via Master usually, but visualization here shows output */}
                    <div className={`p-4 rounded border ${diagnosisOutput ? 'border-green-500/50 bg-green-500/10' : 'border-white/10 bg-white/5'} mb-4 text-center`}>
                        {diagnosisOutput ? (
                            <>
                                <div className="text-lg font-bold text-white">{diagnosisOutput.component}</div>
                                <div className="text-xs text-green-300">{diagnosisOutput.recommendation}</div>
                            </>
                        ) : <span className="text-gray-500 italic">Run Master to Diagnose</span>}
                    </div>
                </motion.div>

                {/* 4. CUSTOMER AGENT */}
                <motion.div layout className="glass-panel p-6 border-l-4 border-l-pink-500 relative overflow-hidden group">
                    <div className="absolute top-2 right-2 opacity-20"><Users size={40} /></div>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users className="text-pink-400" /> Customer Agent</h3>
                    <p className="text-xs text-gray-400 mb-4">Engagement & Voice Interface</p>

                    <input
                        type="text"
                        placeholder="Type message to user..."
                        value={custInput}
                        onChange={e => setCustInput(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs mb-2 text-white"
                    />
                    <button onClick={engageCustomer} className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white rounded mb-4">Send / Speak</button>

                    <div className="bg-black/40 p-3 rounded h-20 overflow-y-auto text-xs font-mono">
                        {custOutput ? (
                            <div className="text-pink-300">" {custOutput.text} "</div>
                        ) : <span className="text-gray-600">...</span>}
                    </div>
                </motion.div>

                {/* 5. MANUFACTURING AGENT */}
                <motion.div layout className="glass-panel p-6 border-l-4 border-l-orange-500 relative overflow-hidden group">
                    <div className="absolute top-2 right-2 opacity-20"><Zap size={40} /></div>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap className="text-orange-400" /> Mfg Agent</h3>
                    <p className="text-xs text-gray-400 mb-4">Batch Quality & Feedback</p>

                    <button onClick={checkBatch} className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white rounded mb-4">Check Batch Quality</button>

                    <div className="bg-black/40 p-3 rounded h-40 overflow-y-auto text-xs font-mono">
                        {mfgOutput ? (
                            <>
                                <div>Batch: {mfgOutput.batch}</div>
                                <div>Trend: {mfgOutput.quality}</div>
                                <div>Active Issues: {mfgOutput.issues}</div>
                            </>
                        ) : <span className="text-gray-600">No report generated</span>}
                    </div>
                </motion.div>

                {/* 6. SCHEDULING AGENT */}
                <motion.div layout className="glass-panel p-6 border-l-4 border-l-teal-500 relative overflow-hidden group">
                    <div className="absolute top-2 right-2 opacity-20"><Calendar size={40} /></div>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Calendar className="text-teal-400" /> Scheduling Agent</h3>
                    <p className="text-xs text-gray-400 mb-4">Service Optimization</p>

                    <select
                        value={schedUrgency} onChange={e => setSchedUrgency(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-xs mb-2 text-white"
                    >
                        <option value="High">Urgency: High</option>
                        <option value="Medium">Urgency: Medium</option>
                        <option value="Low">Urgency: Low</option>
                    </select>

                    <button onClick={bookService} className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded mb-4">Book Service</button>

                    <div className="bg-black/40 p-3 rounded h-24 overflow-y-auto text-xs font-mono">
                        {schedOutput ? (
                            <div className="text-teal-300">
                                <div>ID: {schedOutput.booking_id}</div>
                                <div>Slot: {schedOutput.slot}</div>
                                <div>Center: {schedOutput.service_center}</div>
                            </div>
                        ) : <span className="text-gray-600">...</span>}
                    </div>
                </motion.div>

                {/* 7. UEBA AGENT */}
                <motion.div layout className="glass-panel p-6 border-l-4 border-l-red-500 relative overflow-hidden group">
                    <div className="absolute top-2 right-2 opacity-20"><Shield size={40} /></div>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield className="text-red-400" /> UEBA Agent</h3>
                    <p className="text-xs text-gray-400 mb-4">Security & Anomaly Detection</p>

                    <button onClick={simulateBreach} className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded mb-4 flex items-center justify-center gap-2">
                        <AlertTriangle size={14} /> Simulate Breach
                    </button>

                    <div className="bg-black/40 p-3 rounded h-40 overflow-y-auto text-xs font-mono space-y-2">
                        {uebaLog.length > 0 ? (
                            uebaLog.map((log, i) => (
                                <div key={i} className="text-red-400 border-b border-white/5 pb-1">
                                    <span className="text-gray-500">[{log.time}]</span> {log.status}: {log.action}
                                </div>
                            ))
                        ) : <span className="text-gray-600">System Secure. Monitoring...</span>}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
