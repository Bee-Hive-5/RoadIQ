import React from 'react';
import { motion } from 'framer-motion';
import { Link, ShieldCheck, Box, Truck } from 'lucide-react';

export default function BlockchainVisualizer() {
    const nodes = [
        { id: 1, label: 'Part Mfg', icon: Box, status: 'provenance-verified' },
        { id: 2, label: 'Logistics', icon: Truck, status: 'in-transit' },
        { id: 3, label: 'Service Ctr', icon: ShieldCheck, status: 'pending' },
    ];

    return (
        <div className="glass-panel p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Link size={20} className="text-neon-purple" />
                Supply Chain Ledger
            </h3>

            <div className="flex items-center justify-between relative px-8 py-8">
                {/* Main Track Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2 z-0" />
                
                {/* Animated Packet */}
                <motion.div 
                    className="absolute top-1/2 left-0 w-3 h-3 bg-neon-purple rounded-full shadow-[0_0_10px_#bc13fe] z-10"
                    initial={{ left: '10%' }}
                    animate={{ left: '90%' }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    style={{ translateY: '-50%' }}
                />

                {nodes.map((node, i) => {
                    const Icon = node.icon;
                    return (
                        <div key={node.id} className="relative z-20 flex flex-col items-center gap-2">
                            <div className={`p-3 rounded-xl border-2 transition-all ${
                                i === 0 ? 'bg-neon-purple/20 border-neon-purple shadow-glow-purple' : 
                                'bg-surface border-white/20'
                            }`}>
                                <Icon size={20} className={i === 0 ? 'text-neon-purple' : 'text-gray-400'} />
                            </div>
                            <span className="text-xs font-bold text-gray-300">{node.label}</span>
                            <span className="text-[10px] text-gray-500 font-mono">
                                {i === 0 ? '0x8f...3a' : 'Pending'}
                            </span>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-4 p-3 bg-neon-purple/5 rounded border border-neon-purple/20 font-mono text-[10px] text-neon-purple/80 truncate">
                LATEST HASH: 739b5611fcf2376678583485893fd5420938...
            </div>
        </div>
    );
}
