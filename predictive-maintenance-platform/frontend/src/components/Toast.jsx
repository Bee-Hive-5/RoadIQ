import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const colors = {
        success: 'border-neon-blue text-neon-blue',
        error: 'border-red-500 text-red-500',
        info: 'border-purple-500 text-purple-500',
    };

    const Icon = type === 'error' ? AlertTriangle : type === 'info' ? Info : CheckCircle;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-[#0f172a]/90 backdrop-blur border ${colors[type]} rounded-full shadow-glow-blue`}
        >
            <Icon size={20} />
            <span className="font-medium text-white">{message}</span>
        </motion.div>
    );
}
