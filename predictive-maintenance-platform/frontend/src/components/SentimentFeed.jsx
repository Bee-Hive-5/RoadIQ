import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ThumbsUp, ThumbsDown, Smile, Frown } from 'lucide-react';

export default function SentimentFeed() {
    const [reviews, setReviews] = useState([
        { id: 1, user: "Alice M.", text: "Car feels brand new after the update!", sentiment: "positive" },
        { id: 2, user: "Bob D.", text: "Battery replacement took longer than expected.", sentiment: "negative" },
    ]);

    useEffect(() => {
        const newReviews = [
            { user: "Charlie", text: "Love the new transparent pricing.", sentiment: "positive" },
            { user: "Dave", text: "Dashboard UI is extremely cool.", sentiment: "positive" },
            { user: "Eve", text: "Scheduling tool is a bit confusing.", sentiment: "negative" }
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < newReviews.length) {
                const next = newReviews[i];
                setReviews(prev => [ { id: Date.now(), ...next }, ...prev.slice(0, 3)]);
                i++;
            }
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="glass-panel p-6 h-[400px] flex flex-col">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare size={20} className="text-blue-400" />
                Live Sentiment AI
            </h3>

            <div className="flex-1 overflow-hidden relative space-y-3">
                <AnimatePresence>
                    {reviews.map(review => (
                        <motion.div 
                            key={review.id}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white/5 p-3 rounded-lg border-l-2 border-l-transparent hover:bg-white/10 transition-colors"
                            style={{ 
                                borderLeftColor: review.sentiment === 'positive' ? '#10b981' : '#ef4444' 
                            }}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-sm text-gray-200">{review.user}</span>
                                {review.sentiment === 'positive' ? (
                                    <Smile size={16} className="text-accent" />
                                ) : (
                                    <Frown size={16} className="text-danger" />
                                )}
                            </div>
                            <p className="text-xs text-gray-400 italic">"{review.text}"</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {/* Gradient fade at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
            </div>

            <div className="mt-4 flex gap-2">
                <div className="flex-1 bg-accent/10 rounded p-2 text-center border border-accent/20">
                    <ThumbsUp size={16} className="mx-auto mb-1 text-accent" />
                    <span className="text-xs font-bold text-accent">88% Positive</span>
                </div>
                <div className="flex-1 bg-danger/10 rounded p-2 text-center border border-danger/20">
                    <ThumbsDown size={16} className="mx-auto mb-1 text-danger" />
                    <span className="text-xs font-bold text-danger">12% Negative</span>
                </div>
            </div>
        </div>
    );
}
