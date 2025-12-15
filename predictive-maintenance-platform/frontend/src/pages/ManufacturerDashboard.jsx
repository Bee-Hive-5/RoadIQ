import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FileText } from 'lucide-react';
import Modal from '../components/Modal';
import BlockchainVisualizer from '../components/BlockchainVisualizer';
import SentimentFeed from '../components/SentimentFeed';

const failureData = [
  { name: 'Jan', failures: 40, recalls: 24 },
  { name: 'Feb', failures: 30, recalls: 13 },
  { name: 'Mar', failures: 20, recalls: 98 },
  { name: 'Apr', failures: 27, recalls: 39 },
  { name: 'May', failures: 18, recalls: 48 },
  { name: 'Jun', failures: 23, recalls: 38 },
];

const componentData = [
    { name: 'Brake Pads', quality: 92 },
    { name: 'Engine ECU', quality: 98 },
    { name: 'Battery', quality: 85 },
    { name: 'Transmission', quality: 95 },
];

export default function ManufacturerDashboard() {
    const [selectedSpec, setSelectedSpec] = useState(null);

    return (
        <div className="space-y-6 pb-20">
            <header>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-white">Manufacturing Intelligence</h2>
                <p className="text-gray-400">R&D Feedback Loop and RCA Analytics</p>
            </header>

            {/* ROW 1: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold mb-4">Failure Trends (6 Months)</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={failureData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #333' }} />
                                <Legend />
                                <Line type="monotone" dataKey="failures" stroke="#ef4444" strokeWidth={2} dot={{r: 4}} activeDot={{r: 8}} />
                                <Line type="monotone" dataKey="recalls" stroke="#f59e0b" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold mb-4">Component Quality Index</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={componentData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis type="number" domain={[0, 100]} stroke="#666" />
                                <YAxis dataKey="name" type="category" width={100} stroke="#666" tick={{fill: '#9ca3af', fontSize: 12}} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #333' }} />
                                <Bar dataKey="quality" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                                    {
                                        componentData.map((entry, index) => (
                                        <cell key={`cell-${index}`} fill={entry.quality > 90 ? '#10b981' : entry.quality > 80 ? '#f59e0b' : '#ef4444'} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            {/* ROW 2: New Features */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <BlockchainVisualizer />
                </div>
                <div className="lg:col-span-1">
                    <SentimentFeed />
                </div>
            </div>

            {/* ROW 3: RCA Table */}
            <div className="glass-panel p-6">
                <h3 className="text-xl font-bold mb-4">Root Cause Analysis (RCA) Feeds</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 uppercase font-mono">
                            <tr>
                                <th className="p-3">Report ID</th>
                                <th className="p-3">Component</th>
                                <th className="p-3">Root Cause</th>
                                <th className="p-3">Priority</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr className="hover:bg-white/5 transition-colors group">
                                <td className="p-3 font-mono text-neon-blue">RCA-2024-001</td>
                                <td className="p-3 text-white font-bold">Brake Caliper X5</td>
                                <td className="p-3">Thermal expansion exceeding tolerances</td>
                                <td className="p-3"><span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded text-xs font-bold">CRITICAL</span></td>
                                <td className="p-3">
                                    <button 
                                        onClick={() => setSelectedSpec({ id: 'RCA-2024-001', title: 'Brake Caliper X5 Specification' })}
                                        className="text-primary hover:text-neon-blue hover:underline flex items-center gap-1 transition-colors"
                                    >
                                        <FileText size={14} /> View Spec
                                    </button>
                                </td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors group">
                                <td className="p-3 font-mono text-neon-blue">RCA-2024-002</td>
                                <td className="p-3 text-white font-bold">Li-Ion Cell Batch 9</td>
                                <td className="p-3">Voltage sag under load &gt; 40C</td>
                                <td className="p-3"><span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded text-xs font-bold">HIGH</span></td>
                                <td className="p-3">
                                    <button 
                                        onClick={() => setSelectedSpec({ id: 'RCA-2024-002', title: 'Li-Ion Cell Batch 9 Specification' })}
                                        className="text-primary hover:text-neon-blue hover:underline flex items-center gap-1 transition-colors"
                                    >
                                        <FileText size={14} /> View Spec
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={!!selectedSpec} onClose={() => setSelectedSpec(null)} title={selectedSpec?.title}>
                <div className="space-y-4">
                    <div className="p-4 bg-black/50 rounded border border-white/10 font-mono text-xs text-green-400 overflow-x-auto">
                        <p>{`{`}</p>
                        <p className="pl-4">{`"spec_id": "${selectedSpec?.id}",`}</p>
                        <p className="pl-4">{`"material": "Carbon Ceramic",`}</p>
                        <p className="pl-4">{`"max_temp": 850,`}</p>
                        <p className="pl-4">{`"tolerance": "±0.05mm",`}</p>
                        <p className="pl-4">{`"supplier": "BrakeCo Intl"`}</p>
                        <p>{`}`}</p>
                    </div>
                    <button className="w-full bg-surface border border-white/10 hover:bg-white/10 py-2 rounded text-sm text-gray-300 transition-colors">
                        Download Full PDF Report
                    </button>
                </div>
            </Modal>
        </div>
    );
}
