import React, { useState } from 'react';
import { Calendar, Clock, Check } from 'lucide-react';

export default function SmartScheduler() {
    const [slots, setSlots] = useState([
        { id: 1, day: 'Tue', time: '09:00 AM', risk: 'Low', status: 'available' },
        { id: 2, day: 'Tue', time: '02:00 PM', risk: 'Optimal', status: 'recommended' },
        { id: 3, day: 'Wed', time: '10:00 AM', risk: 'High Traffic', status: 'available' },
    ]);

    const bookSlot = (id) => {
        setSlots(slots.map(s => s.id === id ? { ...s, status: 'booked' } : s));
    };

    return (
        <div className="glass-panel p-6">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Smart Schedule Optimizer</h3>
                <span className="text-xs px-2 py-1 bg-neon-purple/20 text-neon-purple border border-neon-purple/50 rounded">AI Suggested</span>
            </div>

            <div className="space-y-3">
                {slots.map(slot => (
                    <div key={slot.id} className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                        slot.status === 'recommended' ? 'bg-neon-blue/10 border-neon-blue/50' : 
                        slot.status === 'booked' ? 'bg-green-500/10 border-green-500/50' : 'bg-white/5 border-white/5'
                    }`}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded">
                                <Calendar size={16} className="text-gray-400" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">{slot.day} • {slot.time}</p>
                                <p className="text-xs text-gray-500">{slot.risk}</p>
                            </div>
                        </div>
                        
                        {slot.status === 'booked' ? (
                            <span className="flex items-center gap-1 text-green-400 text-xs font-bold"><Check size={14} /> Confirmed</span>
                        ) : (
                            <button 
                                onClick={() => bookSlot(slot.id)}
                                className={`text-xs px-3 py-1.5 rounded font-bold ${
                                    slot.status === 'recommended' 
                                    ? 'bg-neon-blue text-black hover:bg-white' 
                                    : 'bg-white/10 hover:bg-white/20'
                                }`}
                            >
                                {slot.status === 'recommended' ? 'Auto-Book' : 'Select'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
