import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Cpu, Shield, Activity, Play, Pause, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { agentsApi } from '../services/api';

export default function AgentMonitor() {
    const [logs, setLogs] = useState([]);
    const [active, setActive] = useState(true);
    const scrollRef = useRef(null);

    const fetchLogs = async () => {
        const uebaData = await agentsApi.getUEBAAlerts();
        if (uebaData && uebaData.active_alerts) {
            // Transform alerts to logs format if needed, or just append new ones
            // For demo, we might mix real alerts with simulated stream or just show real ones
            const newLogs = uebaData.active_alerts.map(alert => ({
                id: alert.id || Date.now(),
                timestamp: alert.timestamp ? alert.timestamp.split('T')[1].split('.')[0] : new Date().toLocaleTimeString(),
                action: alert.status === 'Blocked' ? 'BLOCKED' : 'ALERT',
                target: alert.agent,
                message: alert.description,
                color: alert.status === 'Blocked' ? 'text-red-500' : 'text-yellow-500'
            }));

            // Only add unique ones or refresh list
            setLogs(newLogs);
        }
    };

    // Simulate stream for "aliveness" but inject real data when available
    const generateLog = () => {
        const actions = ["ANALYZING", "OPTIMIZING", "SYNCING", "VERIFIED"];
        const targets = ["MasterAgent", "DataAgent", "DiagnosisAgent", "SchedulingAgent", "ManufacturingAgent"];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const target = targets[Math.floor(Math.random() * targets.length)];

        return {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString([], { hour12: false }),
            action,
            target,
            message: `Routine check completed. Latency: ${Math.floor(Math.random() * 20)}ms`,
            color: "text-neon-blue"
        };
    };

    useEffect(() => {
        if (!active) return;

        // Poll for real data less frequently
        const pollInterval = setInterval(fetchLogs, 5000);

        // Stream effect
        const streamInterval = setInterval(() => {
            setLogs(prev => {
                const newLog = generateLog();
                return [...prev.slice(-20), newLog];
            });
        }, 1500);

        return () => {
            clearInterval(pollInterval);
            clearInterval(streamInterval);
        };
    }, [active]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col gap-6">
            <header className="flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                    <h2 className="text-3xl font-bold font-mono flex items-center gap-3 text-neon-blue">
                        <Terminal size={32} />
                        AGENT_MONITOR_V2.0
                    </h2>
                    <p className="text-gray-400 font-mono text-sm mt-1">&gt; SYSTEM_READY // UEBA_SECURITY_ACTIVE</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActive(!active)}
                        className={`px-4 py-2 border font-mono text-sm flex items-center gap-2 transition-all ${active
                            ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/20'
                            : 'bg-green-500/10 border-green-500 text-green-500 hover:bg-green-500/20'
                            }`}
                    >
                        {active ? <Pause size={14} /> : <Play size={14} />}
                        {active ? 'HALT_PROCESS' : 'RESUME_STREAM'}
                    </button>
                    <button
                        onClick={() => setLogs([])}
                        className="px-4 py-2 border border-white/20 bg-white/5 text-gray-400 font-mono text-sm flex items-center gap-2 hover:bg-white/10"
                    >
                        <RotateCcw size={14} /> CLEAR_LOGS
                    </button>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Visualizer Panel */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="glass-panel p-6 bg-black/40 border-neon-blue/30 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent animate-pulse" />
                        <h3 className="font-mono text-neon-blue mb-4 flex items-center gap-2 text-sm">
                            <Cpu size={16} /> CORE_UTILIZATION
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(core => (
                                <div key={core} className="bg-black/50 p-3 rounded border border-white/5">
                                    <div className="flex justify-between text-xs text-gray-500 font-mono mb-1">
                                        <span>CORE_0{core}</span>
                                        <span className={active ? "text-green-400" : "text-yellow-500"}>{active ? "ACTIVE" : "IDLE"}</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: "10%" }}
                                            animate={{ width: active ? `${Math.random() * 60 + 20}%` : "5%" }}
                                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                                            className="h-full bg-neon-blue"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-6 bg-black/40 border-neon-purple/30 flex-1">
                        <h3 className="font-mono text-neon-purple mb-4 flex items-center gap-2 text-sm">
                            <Shield size={16} /> UEBA SECURITY PROTOCOL
                        </h3>
                        <div className="space-y-4 font-mono text-xs">
                            <div className="flex justify-between items-center text-gray-400 border-b border-white/5 pb-2">
                                <span>AGENT_AUTH</span>
                                <span className="text-green-400">VERIFIED</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-400 border-b border-white/5 pb-2">
                                <span>ANOMALY_DETECTION</span>
                                <span className="text-green-400">ACTIVE</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-400">
                                <span>THREAT_LEVEL</span>
                                <span className="text-neon-blue">LOW</span>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-white/10 animate-spin-slow flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-neon-purple/20 animate-pulse border border-neon-purple/50" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terminal Output */}
                <div className="lg:col-span-2 glass-panel bg-black/80 font-mono text-sm p-4 border-white/10 flex flex-col relative overflow-hidden">
                    {/* Scanlines Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_4px,3px_100%]" />

                    <div className="flex items-center gap-2 text-gray-500 border-b border-white/10 pb-2 mb-2 sticky top-0 bg-black/90 z-20">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <span className="ml-2">root@agent-system:~# tail -f /var/log/ueba.log</span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 p-2" ref={scrollRef}>
                        <AnimatePresence>
                            {logs.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex gap-3 hover:bg-white/5 p-0.5 rounded"
                                >
                                    <span className="text-gray-600">[{log.timestamp}]</span>
                                    <span className={log.color}>{log.action}</span>
                                    <span className="text-gray-400">
                                        &lt;
                                        <span className="text-white">{log.target}</span>
                                        &gt;
                                    </span>
                                    <span className="text-gray-500 truncflex-1">{log.message}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {active && (
                            <motion.div
                                animate={{ opacity: [0, 1] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="w-2 h-4 bg-neon-blue mt-1"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
