import React, { useState } from 'react';
import { Calendar, AlertTriangle, User, Check, X, CalendarCheck } from 'lucide-react';
import Toast from '../components/Toast';
import ARGuide from '../components/ARGuide';

export default function ServiceAdminDashboard() {
    const [toast, setToast] = useState(null);

    const handleAction = (action, item) => {
        setToast({ message: `${action} Successful: ${item}`, type: 'success' });
    };

    return (
        <div className="space-y-6">
             <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-pink-500">Service Operations</h2>
                    <p className="text-gray-400">Scheduler & Job Management</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 bg-surface/50 border border-white/10 rounded-lg flex items-center gap-2 shadow-lg">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="font-mono text-sm">5 Technicians Available</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-6 h-[650px]">
                {/* Calendar View */}
                <div className="flex-1 glass-panel p-6 flex flex-col">
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-neon-purple"><Calendar size={18} /> Daily Schedule</h3>
                    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {[9, 10, 11, 12, 13, 14, 15, 16].map(time => (
                            <div key={time} className="flex gap-4 border-b border-white/5 py-3 group">
                                <div className="w-16 text-right text-gray-500 font-mono text-sm pt-2">{time}:00</div>
                                <div className="flex-1 bg-white/5 rounded-lg p-2 min-h-[60px] relative hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-white/10">
                                    {time === 10 && (
                                        <div className="absolute top-1 left-1 right-1 bottom-1 bg-blue-500/20 border border-blue-500/50 rounded-md p-2 text-xs hover:scale-[1.02] transition-transform">
                                            <p className="font-bold text-blue-200 flex justify-between">
                                                Vehicle #VIN-8821
                                                <User size={12} />
                                            </p>
                                            <p className="text-blue-300 mt-1">Brake Inspection (AI Triggered)</p>
                                        </div>
                                    )}
                                    {time === 14 && (
                                        <div className="absolute top-1 left-1 right-1 bottom-1 bg-purple-500/20 border border-purple-500/50 rounded-md p-2 text-xs hover:scale-[1.02] transition-transform">
                                             <p className="font-bold text-purple-200 flex justify-between">
                                                Vehicle #VIN-9932
                                                <User size={12} />
                                            </p>
                                            <p className="text-purple-300 mt-1">Annual Maintenance</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Alerts + AR Guide */}
                <div className="w-full lg:w-96 flex flex-col gap-6">
                    <div className="glass-panel p-6 flex-1">
                        <h3 className="font-bold mb-4 text-warning flex items-center gap-2"><AlertTriangle size={18} /> Urgent Approvals</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-background/40 rounded-xl border border-warning/20 hover:border-warning/50 transition-colors shadow-lg shadow-warning/5">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm text-white">Critical Engine Alert</span>
                                    <span className="text-xs text-gray-500 font-mono">2m ago</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-4 leading-relaxed">Model S Plaid reported 98% failure probability on thermal manifold.</p>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleAction('Approved', 'Engine Alert')}
                                        className="flex-1 py-2 bg-accent hover:bg-emerald-400 text-black text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <Check size={14} /> Approve
                                    </button>
                                    <button 
                                        onClick={() => handleAction('Ignored', 'Engine Alert')}
                                        className="flex-1 py-2 bg-surface border border-white/10 hover:bg-white/10 text-xs rounded flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <X size={14} /> Ignore
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-background/40 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm text-white">Routine Checkup</span>
                                    <span className="text-xs text-gray-500 font-mono">15m ago</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-4">Customer requested tire rotation via app.</p>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleAction('Booked', 'Tire Rotation')}
                                        className="flex-1 py-2 bg-primary hover:bg-blue-400 text-white text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <CalendarCheck size={14} /> Book Slot
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* NEW: AR MAINTENANCE GUIDE COMPONENT */}
                    <ARGuide />
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
