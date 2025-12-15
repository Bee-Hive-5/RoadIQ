import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scan, Zap, Thermometer, Wind } from 'lucide-react';

export default function DigitalTwin() {
    const [hoveredPart, setHoveredPart] = useState(null);

    const parts = [
        { id: 'engine', name: 'Engine Core', color: 'bg-red-500', x: '40%', y: '30%', temp: '105°C', status: 'Critical' },
        { id: 'battery', name: 'HV Battery', color: 'bg-green-500', x: '50%', y: '50%', temp: '34°C', status: 'Healthy' },
        { id: 'brakes', name: 'Brake System', color: 'bg-yellow-500', x: '70%', y: '70%', temp: '85°C', status: 'Warning' },
    ];

    return (
        <div className="glass-panel p-6 relative min-h-[300px] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            
            <div className="absolute top-4 left-4 z-10">
                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <Scan size={16} className="text-neon-blue" /> Digital Twin Inspector
                </h3>
            </div>

            {/* Wireframe Outline (Mock CSS car) */}
            <div className="relative w-64 h-96 border-2 border-white/10 rounded-3xl mx-auto opacity-50">
                {/* Wheels */}
                <div className="absolute -left-2 top-10 w-2 h-12 bg-gray-600 rounded-l" />
                <div className="absolute -right-2 top-10 w-2 h-12 bg-gray-600 rounded-r" />
                <div className="absolute -left-2 bottom-10 w-2 h-12 bg-gray-600 rounded-l" />
                <div className="absolute -right-2 bottom-10 w-2 h-12 bg-gray-600 rounded-r" />
                
                {/* Hotspots */}
                {parts.map(part => (
                    <motion.button
                        key={part.id}
                        whileHover={{ scale: 1.2 }}
                        onMouseEnter={() => setHoveredPart(part)}
                        onMouseLeave={() => setHoveredPart(null)}
                        style={{ top: part.y, left: part.x }}
                        className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full ${part.color} shadow-[0_0_15px_currentColor] border-2 border-white z-20 cursor-pointer animate-pulse`}
                    />
                ))}
            </div>

            {/* Hover Tooltip */}
            {hoveredPart && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 left-4 right-4 glass-panel p-4 z-30 border-l-4 border-l-neon-blue bg-black/90"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-white text-lg">{hoveredPart.name}</h4>
                            <p className="text-xs text-gray-400">Real-time Telemetry</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-bold rounded ${hoveredPart.color} text-black`}>
                            {hoveredPart.status}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Thermometer size={14} className="text-neon-blue" /> {hoveredPart.temp}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Zap size={14} className="text-yellow-400" /> Voltage Stable
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
