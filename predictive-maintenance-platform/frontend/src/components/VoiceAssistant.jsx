import React, { useState, useEffect } from 'react';
import { Mic, Activity } from 'lucide-react';

export default function VoiceAssistant() {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const toggleListen = () => {
        if (listening) {
            setListening(false);
            setTranscript('');
        } else {
            setListening(true);
            setTranscript("Listening...");
            // Mock simulation of voice recognition
            setTimeout(() => {
                const commands = ["Running full system diagnostics...", "Scheduling maintenance for Tuesday...", "Optimizing engine performance..."];
                setTranscript(commands[Math.floor(Math.random() * commands.length)]);
                setTimeout(() => setListening(false), 2000);
            }, 1500);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end pointer-events-none">
            {listening && (
                <div className="mb-4 bg-black/80 backdrop-blur border border-white/10 p-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom pointer-events-auto">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 h-8">
                            {[1,2,3,4,5].map(i => (
                                <div key={i} className="w-1 bg-neon-blue animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDuration: `${0.2 + Math.random() * 0.5}s` }} />
                            ))}
                        </div>
                        <p className="font-mono text-neon-blue">{transcript}</p>
                    </div>
                </div>
            )}

            <button 
                onClick={toggleListen}
                className={`pointer-events-auto p-4 rounded-full shadow-lg shadow-neon-blue/20 transition-all hover:scale-110 ${listening ? 'bg-red-500 animate-pulse' : 'bg-neon-blue hover:bg-cyan-400'}`}
            >
                {listening ? <Activity className="text-white" /> : <Mic className="text-black" />}
            </button>
        </div>
    );
}
