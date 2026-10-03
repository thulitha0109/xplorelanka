import React, { useState, useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { MapPin, Search, Check, X, Compass, Crosshair } from 'lucide-react';

const SRI_LANKA_PRESETS = [
    { name: 'Colombo (BIA Airport)', lat: 7.1808, lng: 79.8841 },
    { name: 'Sigiriya Lion Rock', lat: 7.9570, lng: 80.7603 },
    { name: 'Kandy Sacred Temple', lat: 7.2906, lng: 80.6337 },
    { name: 'Nuwara Eliya Tea Town', lat: 6.9497, lng: 80.7828 },
    { name: 'Ella Nine Arch Bridge', lat: 6.8711, lng: 81.0478 },
    { name: 'Yala National Park Safari', lat: 6.3770, lng: 81.3323 },
    { name: 'Mirissa Coastal Beach', lat: 5.9483, lng: 80.4578 },
    { name: 'Galle UNESCO Dutch Fort', lat: 6.0535, lng: 80.2210 },
    { name: 'Arugam Bay Surfing Point', lat: 6.8436, lng: 81.8248 },
    { name: 'Trincomalee Pigeon Island', lat: 8.5874, lng: 81.2152 },
    { name: 'Dambulla Golden Cave Temple', lat: 7.8567, lng: 80.6486 },
    { name: 'Udawalawe Elephant Reserve', lat: 6.4745, lng: 80.8987 },
    { name: 'Sinharaja Tropical Rainforest', lat: 6.4000, lng: 80.4500 },
    { name: 'Bentota Golden Beach', lat: 6.4256, lng: 79.9961 },
    { name: 'Polonnaruwa Ancient City', lat: 7.9403, lng: 81.0188 },
    { name: 'Jaffna Nallur Temple', lat: 9.6743, lng: 80.0296 },
];

export default function MapLocationPicker({
    initialLat = 7.8731,
    initialLng = 80.7718,
    initialName = '',
    onSelectLocation,
    onClose,
    title = 'Select Location with Map Marker',
}) {
    const mapRef = useRef(null);
    const [lat, setLat] = useState(parseFloat(initialLat) || 7.8731);
    const [lng, setLng] = useState(parseFloat(initialLng) || 80.7718);
    const [locationName, setLocationName] = useState(initialName || '');
    const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const markerRef = useRef(null);

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

    useEffect(() => {
        if (!apiKey || !mapRef.current) return;

        let isCancelled = false;

        async function loadGoogleMap() {
            try {
                try {
                    setOptions({ key: apiKey, v: 'weekly' });
                } catch {}

                await importLibrary('maps');
                await importLibrary('marker');

                if (isCancelled || !mapRef.current || !window.google?.maps) return;

                const center = { lat, lng };
                const map = new window.google.maps.Map(mapRef.current, {
                    center,
                    zoom: 9,
                    mapTypeId: 'roadmap',
                    disableDefaultUI: false,
                    zoomControl: true,
                });

                const marker = new window.google.maps.Marker({
                    position: center,
                    map,
                    draggable: true,
                    animation: window.google.maps.Animation.DROP,
                    title: locationName || 'Selected Location',
                });
                markerRef.current = marker;

                // Click on map to place/move marker
                map.addListener('click', (e) => {
                    const newLat = e.latLng.lat();
                    const newLng = e.latLng.lng();
                    setLat(newLat);
                    setLng(newLng);
                    marker.setPosition(e.latLng);
                });

                // Drag marker
                marker.addListener('dragend', (e) => {
                    setLat(e.latLng.lat());
                    setLng(e.latLng.lng());
                });

                setGoogleMapsLoaded(true);
            } catch (err) {
                console.warn('Google maps load notice in picker:', err);
                setGoogleMapsLoaded(false);
            }
        }

        loadGoogleMap();

        return () => {
            isCancelled = true;
        };
    }, [apiKey]);

    const handlePresetSelect = (preset) => {
        setLat(preset.lat);
        setLng(preset.lng);
        setLocationName(preset.name);
        if (markerRef.current && window.google?.maps) {
            const pos = new window.google.maps.LatLng(preset.lat, preset.lng);
            markerRef.current.setPosition(pos);
            markerRef.current.getMap()?.panTo(pos);
        }
    };

    const handleConfirm = () => {
        onSelectLocation({
            lat: parseFloat(lat.toFixed(7)),
            lng: parseFloat(lng.toFixed(7)),
            name: locationName.trim() || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        });
        if (onClose) onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
                            <p className="text-xs text-slate-500">Pick waypoint or tour center on the interactive map</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Coordinates & Name Input */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500">Location Name / Label</label>
                        <input
                            type="text"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            placeholder="e.g. Sigiriya Lion Rock"
                            className="w-full px-3 py-2 border rounded-xl text-sm dark:bg-slate-950 dark:border-slate-700"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500">Latitude (Lat)</label>
                        <input
                            type="number"
                            step="any"
                            value={lat}
                            onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border rounded-xl text-sm font-mono dark:bg-slate-950 dark:border-slate-700"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500">Longitude (Lng)</label>
                        <input
                            type="number"
                            step="any"
                            value={lng}
                            onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border rounded-xl text-sm font-mono dark:bg-slate-950 dark:border-slate-700"
                        />
                    </div>
                </div>

                {/* Map View Canvas or Fallback */}
                <div className="relative flex-grow min-h-[300px] h-[340px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                    <div ref={mapRef} className="w-full h-full" />

                    {!googleMapsLoaded && (
                        <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                            <Compass className="w-10 h-10 text-amber-500 animate-pulse" />
                            <h4 className="font-bold text-sm">Interactive Sri Lanka Waypoint Selector</h4>
                            <p className="text-xs text-slate-400 max-w-md">
                                {apiKey
                                    ? 'Connecting to Google Maps API...'
                                    : 'Google Maps API key can be set in .env (VITE_GOOGLE_MAPS_API_KEY). You can also click any of the Sri Lankan presets below to automatically assign exact GPS coordinates.'}
                            </p>
                            <div className="flex items-center space-x-2 text-xs font-mono bg-white/10 px-3 py-1.5 rounded-lg text-amber-400">
                                <Crosshair className="w-3.5 h-3.5" />
                                <span>Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Presets for Sri Lanka */}
                <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Popular Destinations (Click to auto-fill)</span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                        {SRI_LANKA_PRESETS.map((preset) => (
                            <button
                                key={preset.name}
                                type="button"
                                onClick={() => handlePresetSelect(preset)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                                    Math.abs(lat - preset.lat) < 0.01 && Math.abs(lng - preset.lng) < 0.01
                                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow'
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                                }`}
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-1.5"
                    >
                        <Check className="w-4 h-4" />
                        <span>Apply Selected Marker</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
