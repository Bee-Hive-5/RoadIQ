import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BrainCircuit, Car, Map, Settings, Play } from 'lucide-react';

import VoiceAssistant from './VoiceAssistant';

export default function Layout() {
    const location = useLocation();

    
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Service Admin', path: '/service', icon: Settings },
        { name: 'Manufacturer', path: '/manufacturer', icon: Car },
        { name: 'Agent Monitor', path: '/agents', icon: BrainCircuit },
        { name: 'Geo Map', path: '/map', icon: Map },
    ];

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-white/5 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                        P.M.S. AI
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Predictive Maintenance System</p>
                </div>
                
                <nav className="flex-1 px-4 space-y-2 mt-6">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Icon size={20} className="mr-3" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-blue-500 ring-2 ring-white/10" />
                        <div className="ml-3">
                            <p className="text-sm font-medium">Demo User</p>
                            <p className="text-xs text-green-400">Online</p>
                        </div>
                    </div>
                    
                    {/* HACKATHON DEMO CONTROL */}
                    <div className="bg-surface/50 p-2 rounded border border-white/5">
                        <p className="text-[10px] uppercase text-gray-500 font-bold mb-2">Demo Role Switcher</p>
                        <div className="flex flex-col gap-1">
                            <Link to="/dashboard" className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-left">View: Vehicle Owner</Link>
                            <Link to="/service" className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-left">View: Service Admin</Link>
                            <Link to="/manufacturer" className="text-xs px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-left">View: Manufacturer</Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-background p-8 relative">
                {/* Header for Mobile could go here */}
                <Outlet />
            </main>
            {/* Voice Assistant Overlay */}
            <VoiceAssistant />
        </div>
    );

}
