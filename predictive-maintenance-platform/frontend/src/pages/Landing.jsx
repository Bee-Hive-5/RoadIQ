import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Cpu, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
    return (
        <div className="min-h-screen bg-background text-white overflow-hidden relative">
            {/* Hero Section */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2583&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
            
            <nav className="relative z-10 flex justify-between items-center p-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">P.M.S. AI</h1>
                <Link to="/login" className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full border border-white/10 transition-all">
                    Login / Portal
                </Link>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-8 py-20">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl"
                >
                    <h1 className="text-7xl font-bold leading-tight mb-6">
                        Predictive Maintenance <br />
                        <span className="text-primary">Orchestrated by Agents.</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 max-w-xl">
                        The world's first autonomous vehicle health platform. 
                        We don't just detect failures; our agents predict, schedule, and solve them before you know they exist.
                    </p>
                    <Link to="/login" className="px-8 py-4 bg-primary text-white text-lg font-bold rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2 group">
                        Launch Demo System <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                    <div className="glass-panel p-8">
                        <Cpu className="text-accent mb-4" size={40} />
                        <h3 className="text-xl font-bold mb-2">Agent Neural Core</h3>
                        <p className="text-gray-400">Autonomous workers analyze telemetry in real-time using distributed isolation forests.</p>
                    </div>
                    <div className="glass-panel p-8">
                        <Globe className="text-purple-400 mb-4" size={40} />
                        <h3 className="text-xl font-bold mb-2">Geo-Spatial Intelligence</h3>
                        <p className="text-gray-400">Identify regional failure clusters and optimize supply chain routing dynamically.</p>
                    </div>
                    <div className="glass-panel p-8">
                        <ShieldCheck className="text-pink-400 mb-4" size={40} />
                        <h3 className="text-xl font-bold mb-2">Explainable AI</h3>
                        <p className="text-gray-400">Full audit trails of every decision made by the system. Trust, verified.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
