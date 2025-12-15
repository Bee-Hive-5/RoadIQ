import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Make sure this is imported
import Toast from '../components/Toast';

// Fix Leaflet icons
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const center = [51.505, -0.09]; // London default

const hotspots = [
    { id: 1, pos: [51.505, -0.09], intensity: 0.8, name: "North-West Cluster" },
    { id: 2, pos: [51.51, -0.1], intensity: 0.4, name: "City Center" },
    { id: 3, pos: [51.49, -0.08], intensity: 0.9, name: "Industrial Zone A" },
];

export default function GeoMap() {
    const [toast, setToast] = useState(null);

    const handleDispatch = (name) => {
        setToast({ message: `Dispatching Rapid Response Team to: ${name}`, type: 'success' });
    };

    return (
        <div className="h-full flex flex-col space-y-4">
             <header>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600">Geo-AI Failure Hotspots</h2>
                <p className="text-gray-400">Regional component failure density analysis</p>
            </header>
            
            <div className="flex-1 glass-panel overflow-hidden rounded-xl border border-white/10 relative shadow-2xl">
                <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Dark mode map
                    />
                    
                    {hotspots.map(spot => (
                        <CircleMarker 
                            key={spot.id} 
                            center={spot.pos} 
                            radius={20 * spot.intensity}
                            pathOptions={{ 
                                color: spot.intensity > 0.7 ? '#ef4444' : '#f59e0b',
                                fillColor: spot.intensity > 0.7 ? '#ef4444' : '#f59e0b',
                                fillOpacity: 0.5 
                            }}
                        >
                            <Popup className="glass-popup">
                                <div className="text-black font-sans min-w-[150px]">
                                    <strong className="text-lg">{spot.name}</strong><br/>
                                    <div className="my-2 h-1 bg-gray-200 rounded overflow-hidden">
                                        <div className="h-full bg-red-500" style={{ width: `${spot.intensity * 100}%` }}></div>
                                    </div>
                                    <span className="text-xs text-gray-600">Failure Density: {(spot.intensity * 100).toFixed(0)}%</span><br/>
                                    <button 
                                        onClick={() => handleDispatch(spot.name)}
                                        className="mt-3 w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs transition-colors shadow-lg"
                                    >
                                        Dispatch Team
                                    </button>
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
                
                {/* Overlay Panel */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-xl shadow-2xl z-[1000] border border-white/20 w-72">
                    <h4 className="font-bold border-b border-white/10 pb-2 mb-3 text-neon-blue">Regional Insights</h4>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-1 rounded">
                            <span>Brake Failures</span>
                            <span className="text-red-400 font-bold bg-red-900/30 px-2 py-0.5 rounded border border-red-500/30">High (Ind. Zone)</span>
                        </div>
                        <div className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-1 rounded">
                            <span>Battery Issues</span>
                            <span className="text-yellow-400 font-bold bg-yellow-900/30 px-2 py-0.5 rounded border border-yellow-500/30">Med (City)</span>
                        </div>
                    </div>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
