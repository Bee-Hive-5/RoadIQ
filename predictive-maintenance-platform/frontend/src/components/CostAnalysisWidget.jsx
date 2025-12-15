import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CostAnalysisWidget() {
    const [saved, setSaved] = useState(1250);

    useEffect(() => {
        const interval = setInterval(() => {
            setSaved(prev => prev + Math.floor(Math.random() * 5));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="glass-panel p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <DollarSign size={100} />
            </div>
            
            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4">Predictive Cost Benefit</h3>
            
            <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-white">${saved.toLocaleString()}</span>
                <span className="text-neon-blue text-sm mb-1 font-bold">+12% vs Reactive</span>
            </div>
            
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mb-4">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    className="h-full bg-neon-blue shadow-[0_0_10px_#00f3ff]"
                />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                    <p className="text-gray-500">Preventive Cost</p>
                    <p className="text-white font-mono">$150</p>
                </div>
                <div>
                    <p className="text-gray-500">Projected Repair</p>
                    <p className="text-red-400 font-mono line-through">$2,400</p>
                </div>
            </div>
        </div>
    );
}
