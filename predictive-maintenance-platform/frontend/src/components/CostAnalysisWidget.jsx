import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CostAnalysisWidget() {
    const [saved, setSaved] = useState(1250);

    useEffect(() => {
        // Simulated live data update
        const interval = setInterval(() => {
            setSaved(prev => prev + Math.floor(Math.random() * 5));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Initialize Google Charts
        if (window.google) {
            window.google.charts.load('current', { packages: ['corechart'] });
            window.google.charts.setOnLoadCallback(drawChart);
        }

        function drawChart() {
            if (!window.google || !window.google.visualization) return;

            // Data: [Task, Hours per Day]
            const data = window.google.visualization.arrayToDataTable([
                ['Category', 'Cost'],
                ['Preventive Cost', 150],
                ['Net Savings', saved]
            ]);

            const options = {
                pieHole: 0.6,
                backgroundColor: 'transparent',
                legend: { position: 'none' },
                slices: {
                    0: { color: '#ef4444' }, // predictive (red/cost)
                    1: { color: '#00f3ff' }  // savings (cyan/neon)
                },
                pieSliceBorderColor: 'transparent',
                chartArea: { width: '90%', height: '90%' },
                tooltip: {
                    textStyle: { color: '#000' },
                    showColorCode: true
                }
            };

            const chart = new window.google.visualization.PieChart(document.getElementById('google_cost_chart'));
            chart.draw(data, options);
        }

        // Redraw when 'saved' changes
        if (window.google && window.google.visualization) {
            drawChart();
        }
    }, [saved]);

    return (
        <div className="glass-panel p-6 relative overflow-hidden group min-h-[220px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <DollarSign size={100} />
            </div>

            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2 font-mono">Google Charts: ROI</h3>

            <div className="flex items-center gap-4">
                {/* Chart Container */}
                <div id="google_cost_chart" className="w-32 h-32" style={{ marginLeft: '-10px' }}></div>

                <div className="flex flex-col">
                    <div className="flex items-end gap-2 mb-1">
                        <span className="text-4xl font-bold text-white font-mono">${saved.toLocaleString()}</span>
                    </div>
                    <span className="text-neon-blue text-xs font-bold bg-neon-blue/10 px-2 py-1 rounded w-fit">+12% vs Reactive</span>

                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-gray-500">Cost</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-neon-blue"></div>
                            <span className="text-gray-500">Saved</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Google Footer Badge */}
            <div className="absolute bottom-2 right-2 text-[10px] text-gray-600 font-mono opacity-50">
                Powered by Google Charts
            </div>
        </div>
    );
}
