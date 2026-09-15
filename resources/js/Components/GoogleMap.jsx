import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { MapPin, Navigation } from 'lucide-react';

export default function GoogleMap({ 
    locations = [
        { name: 'Colombo (BIA)', lat: 7.1808, lng: 79.8841 },
        { name: 'Sigiriya Rock', lat: 7.9570, lng: 80.7603 },
        { name: 'Kandy Sacred City', lat: 7.2906, lng: 80.6337 },
        { name: 'Ella Nine Arch', lat: 6.8667, lng: 81.0467 },
        { name: 'Yala Safari', lat: 6.3725, lng: 81.5168 }
    ],
    zoom = 8,
    title = 'Sri Lanka Tour Route & Navigation Map' 
}) {
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
        
        if (!apiKey) {
            setMapLoaded(false);
            return;
        }

        let isCancelled = false;

        async function initGoogleMap() {
            try {
                try {
                    setOptions({
                        key: apiKey,
                        v: 'weekly',
                    });
                } catch {
                    // Ignore if setOptions was already called
                }

                await importLibrary('maps');
                await importLibrary('marker');

                if (isCancelled || !mapRef.current || !window.google?.maps) return;

                const map = new window.google.maps.Map(mapRef.current, {
                    center: { lat: locations[0]?.lat || 7.8731, lng: locations[0]?.lng || 80.7718 },
                    zoom: zoom,
                    mapTypeId: 'terrain',
                    disableDefaultUI: false,
                    zoomControl: true,
                });

                const pathCoordinates = [];

                locations.forEach((loc, index) => {
                    const position = { lat: loc.lat, lng: loc.lng };
                    pathCoordinates.push(position);

                    const marker = new window.google.maps.Marker({
                        position: position,
                        map: map,
                        title: loc.name,
                        label: {
                            text: `${index + 1}`,
                            color: '#ffffff',
                            fontWeight: 'bold'
                        }
                    });

                    const infoWindow = new window.google.maps.InfoWindow({
                        content: `<div style="padding:4px; font-family:sans-serif; color:#0f172a;">
                            <strong style="font-size:13px;">Stop ${index + 1}: ${loc.name}</strong>
                        </div>`
                    });

                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });
                });

                // Draw route polyline
                const tourPolyline = new window.google.maps.Polyline({
                    path: pathCoordinates,
                    geodesic: true,
                    strokeColor: '#f59e0b',
                    strokeOpacity: 0.9,
                    strokeWeight: 4,
                });

                tourPolyline.setMap(map);
                if (!isCancelled) {
                    setMapLoaded(true);
                }
            } catch (err) {
                console.warn('Google Maps JS API load notice:', err);
                if (!isCancelled) {
                    setMapLoaded(false);
                }
            }
        }

        initGoogleMap();

        return () => {
            isCancelled = true;
        };
    }, [locations, zoom]);

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md">
            <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white">
                    <Navigation className="w-4 h-4 text-amber-500" />
                    <span>{title}</span>
                </div>
                <span className="text-slate-500 text-[10px]">Google Maps Platform</span>
            </div>

            {/* Container Map View */}
            <div className="relative h-80 w-full bg-slate-950">
                <div ref={mapRef} className="w-full h-full" />

                {/* Visual Fallback / Interactive Waypoint Overlay */}
                {!mapLoaded && (
                    <div className="absolute inset-0 bg-slate-900 text-white flex flex-col justify-between p-6 overflow-y-auto">
                        <div className="space-y-2">
                            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Interactive Route Preview</span>
                            <h4 className="text-xl font-black">Sri Lanka Waypoints & Destinations</h4>
                            <p className="text-xs text-slate-400">
                                Exact GPS waypoints mapped across Sri Lanka’s cultural, mountain, and coastal circuits.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                            {locations.map((loc, idx) => (
                                <div key={idx} className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center space-x-3 text-xs">
                                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                                        {idx + 1}
                                    </span>
                                    <div>
                                        <div className="font-bold text-white">{loc.name}</div>
                                        <div className="text-[10px] text-slate-400">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between items-center">
                            <span>* To activate live Google Maps canvas, set VITE_GOOGLE_MAPS_API_KEY in .env</span>
                            <a 
                                href="https://mapsplatform.google.com/maps-demo-key" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-amber-400 hover:underline font-bold"
                            >
                                Get Maps API Key
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
