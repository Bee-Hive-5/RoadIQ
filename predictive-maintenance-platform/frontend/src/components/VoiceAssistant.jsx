import React, { useState } from 'react';
import { Mic, Volume2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { agentsApi } from '../services/api';

const VoiceAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [status, setStatus] = useState('Idle');

    const questions = [
        { id: 'vehicle_health', label: "What's my vehicle health?" },
        { id: 'repair_cost', label: "How much will repairs cost?" },
        { id: 'schedule_service', label: "When can I schedule service?" },
        { id: 'safe_drive', label: "Is it safe to drive?" },
        { id: 'problem_cause', label: "What caused the problem?" },
        { id: 'warranty', label: "Is my vehicle under warranty?" }
    ];

    const handleQuestion = async (qId) => {
        setStatus('Speaking...');
        await agentsApi.voiceQuestion(qId);
        setStatus('Idle');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 bg-gray-900 border border-cyan-500/30 rounded-lg p-4 w-72 shadow-2xl backdrop-blur-md"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-cyan-400 font-semibold flex items-center gap-2">
                                <Volume2 className="w-4 h-4" /> RoadIQ Voice
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {questions.map((q) => (
                                <button
                                    key={q.id}
                                    onClick={() => handleQuestion(q.id)}
                                    className="w-full text-left text-sm p-2 rounded bg-gray-800 hover:bg-cyan-900/40 text-gray-300 hover:text-cyan-300 transition-colors border border-transparent hover:border-cyan-500/30"
                                >
                                    {q.label}
                                </button>
                            ))}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-center text-cyan-500/70">
                            {status}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white p-4 rounded-full shadow-lg shadow-cyan-500/20 border border-cyan-400"
            >
                <Mic className="w-6 h-6" />
            </motion.button>
        </div>
    );
};

export default VoiceAssistant;
