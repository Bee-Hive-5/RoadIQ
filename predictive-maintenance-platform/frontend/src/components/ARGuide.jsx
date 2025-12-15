import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw, PenTool, CheckCircle } from 'lucide-react';

export default function ARGuide() {
    const [step, setStep] = useState(0);
    const steps = [
        { text: "Locate Engine Cover Bolts (4x)", x: 20, y: 30 },
        { text: "Disconnect Negative Battery Terminal", x: 60, y: 60 },
        { text: "Inspect Spark Plug Wells", x: 40, y: 40 }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(s => (s + 1) % steps.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const current = steps[step];

    return (
        <div className="glass-panel p-0 relative overflow-hidden h-[300px] group">
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full border border-neon-blue/30 backdrop-blur">
                <Camera size={16} className="text-neon-blue animate-pulse" />
                <span className="text-xs font-bold font-mono text-neon-blue">AR REPAIR ASSIST v2.0</span>
            </div>

            {/* Background Feed (Engine Mock) */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486262715619-01b80258eac2?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-50 group-hover:opacity-100 transition-opacity duration-500 scale-110" />
            
             {/* HUD Overlay */}
             <div className="absolute inset-0 pointer-events-none">
                {/* Crosshairs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/20 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-neon-blue rounded-full" />
                </div>
                
                {/* Floating Instruction */}
                <div className="absolute transition-all duration-500 ease-out" style={{ top: `${current.y}%`, left: `${current.x}%` }}>
                    <div className="relative">
                        <div className="absolute -left-2 -top-2 w-full h-full border-2 border-neon-blue rounded animate-ping opacity-20" />
                        <div className="bg-black/80 text-white text-xs p-3 rounded-lg border-l-4 border-l-neon-blue shadow-[0_0_20px_rgba(0,243,255,0.3)] backdrop-blur max-w-[150px]">
                            <p className="font-bold flex items-center gap-2">
                                <PenTool size={12} className="text-neon-blue" />
                                Step {step + 1}
                            </p>
                            <p className="mt-1 text-gray-300">{current.text}</p>
                        </div>
                        {/* Connecting Line */}
                        <div className="w-px h-16 bg-gradient-to-b from-neon-blue to-transparent absolute top-full left-4" />
                    </div>
                </div>
             </div>

             <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                 <div className="flex justify-between text-xs font-mono text-gray-400">
                     <span>Focal Length: 34mm</span>
                     <span>ISO: 1200</span>
                 </div>
             </div>
        </div>
    );
}
