'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainerComponent = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayerComponent = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const MarkerComponent = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const PopupComponent = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

interface Station {
    id: number;
    name: string;
    provider: string;
    address: string;
    type: string;
    position: [number, number];
}

export default function ChargingStationsPage() {
    const [stations, setStations] = useState<Station[]>([]);
    const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // India Center
    const [map, setMap] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        import('leaflet').then((L) => {
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
        });

        const loadAllIndiaEVStations = async () => {
            try {
                setLoading(true);

                const query = `
          [out:json][timeout:50];
          area["ISO3166-1"="IN"] -> .india;
          (
            node["amenity"="charging_station"](area.india);
          );
          out body 80;
        `;

                // 🔑 Yahan humne dynamic base URL uthaya hai .env file se
                const baseUrl = process.env.NEXT_PUBLIC_OVERPASS_API_URL || 'https://overpass-api.de/api/interpreter';
                const apiEndpoint = `${baseUrl}?data=${encodeURIComponent(query)}`;

                const response = await fetch(apiEndpoint, { method: 'GET' });
                if (!response.ok) throw new Error("Global cluster network response issue");

                const jsonResponse = await response.json();

                if (jsonResponse.elements && jsonResponse.elements.length > 0) {
                    const indiaParsedData: Station[] = jsonResponse.elements.map((item: any, idx: number) => ({
                        id: item.id || idx,
                        name: item.tags?.name || item.tags?.operator || "EV Charging Station",
                        provider: item.tags?.brand || item.tags?.operator || "Public Network",
                        address: item.tags?.["addr:city"]
                            ? `${item.tags?.["addr:street"] || ''} ${item.tags?.["addr:city"]}, India`
                            : "Verified Indian Highway Node",
                        type: item.tags?.socket || "Fast Charger Configuration",
                        position: [item.lat, item.lon]
                    }));

                    setStations(indiaParsedData);
                }
            } catch (err) {
                console.error("India wide API streaming failed:", err);
            } finally {
                setLoading(false);
            }
        };

        loadAllIndiaEVStations();
    }, []);

    const handleViewOnMap = (station: Station) => {
        setMapCenter(station.position);
        if (map) {
            map.setView(station.position, 14);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white font-sans">
            {/* EV.BIKE Navbar */}
            <nav className="flex justify-between items-center px-8 py-4 border-b border-neutral-900 bg-[#0d0d0d]">
                <div className="flex items-center gap-2">
                    <span className="text-[#79b947] text-2xl font-black tracking-tighter">⚡ EV.BIKE</span>
                </div>
                <div className="hidden md:flex items-center gap-6 text-xs font-bold tracking-wider text-neutral-400 uppercase">
                    <a href="#" className="hover:text-white transition-colors">Home</a>
                    <a href="#" className="hover:text-white transition-colors">Comparison</a>
                    <a href="#" className="hover:text-white transition-colors">Brands</a>
                    <a href="#" className="hover:text-white transition-colors text-[#79b947]">EV Calculator</a>
                    <a href="#" className="hover:text-white transition-colors">Reviews</a>
                </div>
            </nav>

            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <span className="text-xs font-bold text-[#79b947] uppercase tracking-widest">// PAN INDIA LIVE STREAM (.ENV)</span>
                    <h1 className="text-3xl font-extrabold mt-1 text-neutral-100">National EV Infrastructure Map</h1>
                    <p className="text-neutral-400 text-xs mt-1">Data pipeline successfully route handled via isolated architecture variables.</p>
                </div>

                {/* Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[550px]">

                    {/* Map View */}
                    <div className="lg:col-span-8 bg-[#141414] border border-neutral-800/80 rounded-2xl overflow-hidden relative z-10">
                        {isClient && !loading ? (
                            <MapContainerComponent center={mapCenter} zoom={5} style={{ width: '100%', height: '100%' }} ref={setMap}>
                                <TileLayerComponent
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; OpenStreetMap contributors'
                                />
                                {stations.map((station) => (
                                    <MarkerComponent key={station.id} position={station.position}>
                                        <PopupComponent>
                                            <div className="text-neutral-900 p-1">
                                                <strong className="block text-sm font-bold">{station.name}</strong>
                                                <span className="text-xs text-neutral-500">{station.address}</span>
                                            </div>
                                        </PopupComponent>
                                    </MarkerComponent>
                                ))}
                            </MapContainerComponent>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 gap-2 bg-[#141414]">
                                <div className="w-6 h-6 border-2 border-[#79b947] border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-[10px] tracking-widest uppercase">Connecting via secure pipeline...</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 bg-[#141414] border border-neutral-800/80 rounded-2xl p-4 flex flex-col overflow-hidden">
                        <h2 className="text-sm font-bold text-neutral-400 tracking-wider mb-4 uppercase">// Active Live Nodes ({stations.length})</h2>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                            {stations.map((station) => (
                                <div key={station.id} className="bg-[#1a1a1a] border border-neutral-800 p-4 rounded-xl hover:border-neutral-700 transition-all">
                                    <h3 className="font-bold text-base text-neutral-200 line-clamp-1">{station.name}</h3>
                                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{station.address}</p>

                                    <div className="mt-3 text-xs bg-[#222222] p-2 rounded-lg text-neutral-300 flex items-center gap-1.5 border border-neutral-800/50">
                                        <span className="text-[#79b947] font-bold">⚡ Spec:</span> {station.type}
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => handleViewOnMap(station)}
                                            className="text-xs font-bold bg-[#262626] text-neutral-300 hover:text-white border border-neutral-700/60 px-4 py-2 rounded-lg hover:bg-neutral-800 transition-all"
                                        >
                                            Locate Node
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}