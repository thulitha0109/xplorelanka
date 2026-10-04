import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { formatAmount, formatProductPrice, getPriceAmount } from '../lib/currency';
import SeoHead from '../Components/SeoHead';
import { 
    Compass, Calendar, Users, MapPin, CheckCircle2, 
    MessageCircle, Sparkles, Car, Building2, ChevronRight, Check, ArrowRight, Star
} from 'lucide-react';

export default function Planner({ tours = [], vehicles = [], accommodations = [] }) {
    const { flash, currency } = usePage().props;
    const currencyCode = currency?.code || 'USD';
    const [step, setStep] = useState(1); // 1: Route/Tour, 2: Vehicle, 3: Stay, 4: Summary/Contact

    // Selection states
    const [selectedTourId, setSelectedTourId] = useState(null);
    const [selectedPlaces, setSelectedPlaces] = useState(['Sigiriya & Dambulla', 'Ella & Nine Arch', 'Kandy Sacred City']);
    const [days, setDays] = useState(7);
    const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || null);
    const [selectedAccId, setSelectedAccId] = useState(accommodations[0]?.id || null);

    const destinations = [
        'Sigiriya & Dambulla', 'Kandy Sacred City', 'Ella & Nine Arch', 
        'Nuwara Eliya Tea Country', 'Yala Safari', 'Mirissa Coast', 
        'Galle Fort', 'Knuckles Wilderness', 'Arugam Bay Surf', 'Trincomalee Beaches'
    ];

    const togglePlace = (place) => {
        if (selectedPlaces.includes(place)) {
            setSelectedPlaces(selectedPlaces.filter(p => p !== place));
        } else {
            setSelectedPlaces([...selectedPlaces, place]);
        }
    };

    const selectedTour = tours.find(t => t.id === selectedTourId);
    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
    const selectedAccommodation = accommodations.find(a => a.id === selectedAccId) || accommodations[0];

    // Calculate dynamic estimate
    const tourCost = selectedTour ? (getPriceAmount(selectedTour, currencyCode, 'package') || 0) : 0;
    const vehicleEst = selectedTour ? 0 : (days * (getPriceAmount(selectedVehicle, currencyCode, 'day') || 0));
    const stayNights = Math.max(days - 1, 1);
    const stayEst = selectedTour ? 0 : (stayNights * (getPriceAmount(selectedAccommodation, currencyCode, 'night') || 0));
    
    const combinedEstimate = selectedTour ? tourCost : (vehicleEst + stayEst);

    const { data, setData, post, processing, reset } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        guests_count: 2,
        start_date: '',
        tour_id: selectedTourId,
        vehicle_id: selectedVehicleId,
        accommodation_id: selectedAccId,
        days: days,
        selected_places: selectedPlaces,
        estimated_total: combinedEstimate,
        special_requests: '',
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        data.tour_id = selectedTourId;
        data.vehicle_id = selectedVehicleId;
        data.accommodation_id = selectedAccId;
        data.days = days;
        data.selected_places = selectedPlaces;
        data.estimated_total = combinedEstimate;

        post('/planner', {
            onSuccess: (page) => {
                reset();
                if (page.props.flash?.whatsapp_url) {
                    window.open(page.props.flash.whatsapp_url, '_blank');
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans">
            <SeoHead
                title="Plan a Custom Sri Lanka Trip | Xplore Lanka"
                description="Build a tailored Sri Lanka itinerary by combining local tour packages, private vehicles, places to visit and accommodation options. Request a custom quote."
                schema={{ '@context': 'https://schema.org', '@type': 'Service', name: 'Custom Sri Lanka Trip Planning', provider: { '@id': 'https://xplorelanka.com/#organization' }, areaServed: { '@type': 'Country', name: 'Sri Lanka' } }}
            />
            <Navbar currentPath="/planner" />

            {flash?.success && (
                <div className="bg-emerald-600 text-white px-4 py-3 text-center text-sm font-semibold flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}

            <main className="flex-grow py-12 container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="text-center mb-10 space-y-3">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Connected Tours, Vehicles & Stays</span>
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Build Your Custom Sri Lanka Itinerary</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl mx-auto">
                        Choose an established tour circuit or design your own: pair with your preferred private vehicle and handpicked boutique accommodations.
                    </p>
                </div>

                {/* Stepper Wizard Bar */}
                <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 border-b border-slate-200 dark:border-slate-800 pb-4">
                    {[
                        { num: 1, label: 'Route / Tour' },
                        { num: 2, label: 'Vehicle Fleet' },
                        { num: 3, label: 'Accommodations' },
                        { num: 4, label: 'Estimate & Book' },
                    ].map((s) => (
                        <button
                            key={s.num}
                            type="button"
                            onClick={() => setStep(s.num)}
                            className="flex items-center space-x-2 text-xs font-bold transition-all"
                        >
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                                step === s.num
                                    ? 'bg-amber-500 text-slate-950 shadow-md scale-110'
                                    : step > s.num
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                            }`}>
                                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                            </span>
                            <span className={`hidden sm:inline ${step === s.num ? 'text-amber-500' : 'text-slate-400'}`}>{s.label}</span>
                        </button>
                    ))}
                </div>

                {/* STEP 1: ROUTE & TOUR SELECTION */}
                {step === 1 && (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
                        <div>
                            <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center space-x-2">
                                <Compass className="w-5 h-5 text-amber-500" />
                                <span>Step 1: Choose Tour Package or Custom Destinations</span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">Select a pre-designed tour package or pick individual destination highlights.</p>
                        </div>

                        {/* Pre-designed tours quick selection */}
                        {tours.length > 0 && (
                            <div className="space-y-3">
                                <span className="text-xs font-bold uppercase text-slate-400">Popular Tour Circuits (Optional)</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setSelectedTourId(null)}
                                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                            selectedTourId === null
                                                ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 ring-2 ring-amber-500/20'
                                                : 'border-slate-200 dark:border-slate-800'
                                        }`}
                                    >
                                        <div className="font-bold text-sm text-slate-900 dark:text-white">Custom Tailored Route</div>
                                        <p className="text-xs text-slate-500 mt-1">Select your own destinations, days, and hotels.</p>
                                    </div>

                                    {tours.slice(0, 3).map((t) => (
                                        <div
                                            key={t.id}
                                            onClick={() => setSelectedTourId(t.id)}
                                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                                selectedTourId === t.id
                                                    ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 ring-2 ring-amber-500/20'
                                                    : 'border-slate-200 dark:border-slate-800'
                                        }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="font-bold text-sm text-slate-900 dark:text-white truncate">{t.title}</div>
                                                <span className="text-xs font-black text-amber-500">{formatProductPrice(t, currencyCode, 'package')}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 truncate">{t.route}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Custom destinations */}
                        <div className="space-y-3">
                            <span className="text-xs font-bold uppercase text-slate-400">Select Destinations You Wish to Visit</span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                                {destinations.map((place) => {
                                    const isSelected = selectedPlaces.includes(place);
                                    return (
                                        <button
                                            key={place}
                                            type="button"
                                            onClick={() => togglePlace(place)}
                                            className={`p-3 rounded-xl text-xs font-bold text-center border transition-all ${
                                                isSelected
                                                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md scale-105'
                                                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                                            }`}
                                        >
                                            {place}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Duration slider */}
                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-slate-700 dark:text-slate-300">Trip Duration:</span>
                                <span className="font-black text-amber-500 text-sm">{days} Days / {days - 1} Nights</span>
                            </div>
                            <input
                                type="range"
                                min="3"
                                max="21"
                                value={days}
                                onChange={(e) => setDays(Number(e.target.value))}
                                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow flex items-center space-x-2"
                            >
                                <span>Continue to Vehicle Selection</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: VEHICLE FLEET SELECTION */}
                {step === 2 && (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
                        <div>
                            <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center space-x-2">
                                <Car className="w-5 h-5 text-amber-500" />
                                <span>Step 2: Choose Your Private Vehicle & Chauffeur</span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">Private air-conditioned fleet with licensed English-speaking tourist chauffeur.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {vehicles.map((v) => {
                                const isSelected = selectedVehicleId === v.id;
                                return (
                                    <div
                                        key={v.id}
                                        onClick={() => setSelectedVehicleId(v.id)}
                                        className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                                            isSelected
                                                ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 ring-2 ring-amber-500/20 shadow-lg'
                                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                        }`}
                                    >
                                        <div>
                                            <div className="text-3xl mb-2">{v.icon || '🚗'}</div>
                                            <h4 className="font-bold text-base text-slate-900 dark:text-white">{v.name}</h4>
                                            <div className="text-xs text-slate-500 mt-1">{v.seats} • {v.transmission || 'Automatic'}</div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{v.description}</p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            <div>
                                                <div className="text-[10px] text-slate-400">Rate per km</div>
                                                <div className="text-sm font-black text-amber-500">{formatProductPrice(v, currencyCode, 'per_km')} / km</div>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                                isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                            }`}>
                                                {isSelected ? 'Selected' : 'Select'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow flex items-center space-x-2"
                            >
                                <span>Continue to Accommodations</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: ACCOMMODATION SELECTION */}
                {step === 3 && (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
                        <div>
                            <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center space-x-2">
                                <Building2 className="w-5 h-5 text-amber-500" />
                                <span>Step 3: Select Handpicked Stays & Eco Lodges</span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">Connected with partner boutique hotels and hill country wooden cabins.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {accommodations.map((acc) => {
                                const isSelected = selectedAccId === acc.id;
                                return (
                                    <div
                                        key={acc.id}
                                        onClick={() => setSelectedAccId(acc.id)}
                                        className={`rounded-2xl overflow-hidden border cursor-pointer transition-all flex flex-col justify-between ${
                                            isSelected
                                                ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-lg bg-amber-50/10 dark:bg-amber-950/20'
                                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="h-36 overflow-hidden bg-slate-800 relative">
                                            <img src={acc.image || '/images/legacy/stay-default.jpg'} alt="" className="w-full h-full object-cover" />
                                            <span className="absolute top-2 left-2 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                                                {acc.category}
                                            </span>
                                        </div>
                                        <div className="p-4 space-y-2">
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{acc.name}</h4>
                                            <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                                                <MapPin className="w-3 h-3 text-amber-500" />
                                                <span>{acc.location}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                                                <Star className="w-3.5 h-3.5 fill-amber-500" />
                                                <span>{acc.rating}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            <div className="text-xs font-black text-amber-500">
                                                {formatProductPrice(acc, currencyCode, 'night')} / night
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                                isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                            }`}>
                                                {isSelected ? 'Selected' : 'Select'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(4)}
                                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow flex items-center space-x-2"
                            >
                                <span>Review Summary & Estimate</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4: SUMMARY & BOOKING INQUIRY */}
                {step === 4 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Summary Card */}
                        <div className="lg:col-span-1 bg-slate-900 text-white p-6 rounded-3xl space-y-6 shadow-xl border border-slate-800 self-start">
                            <div>
                                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Itinerary Breakdown</span>
                                <h3 className="text-xl font-black mt-1">Your Trip Plan</h3>
                            </div>

                            <div className="space-y-3 text-xs">
                                {selectedTour ? (
                                    <div className="p-3 bg-slate-800/80 rounded-xl">
                                        <div className="text-slate-400">Selected Tour Package:</div>
                                        <div className="font-bold text-amber-400 text-sm mt-0.5">{selectedTour.title}</div>
                                        <div className="text-slate-300 mt-1">{formatProductPrice(selectedTour, currencyCode, 'package')}</div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-3 bg-slate-800/80 rounded-xl">
                                            <div className="text-slate-400">Duration & Stops:</div>
                                            <div className="font-bold text-white mt-0.5">{days} Days ({selectedPlaces.length} Destinations)</div>
                                            <div className="text-slate-400 mt-1 text-[11px] truncate">{selectedPlaces.join(', ')}</div>
                                        </div>

                                        <div className="p-3 bg-slate-800/80 rounded-xl">
                                            <div className="text-slate-400">Vehicle & Chauffeur:</div>
                                            <div className="font-bold text-amber-400 mt-0.5">{selectedVehicle?.name || 'Private Van'}</div>
                                            <div className="text-slate-300 mt-0.5">{formatProductPrice(selectedVehicle, currencyCode, 'per_km')} / km</div>
                                        </div>

                                        <div className="p-3 bg-slate-800/80 rounded-xl">
                                            <div className="text-slate-400">Accommodation:</div>
                                            <div className="font-bold text-emerald-400 mt-0.5">{selectedAccommodation?.name || 'Boutique Stay'}</div>
                                            <div className="text-slate-300 mt-0.5">{formatProductPrice(selectedAccommodation, currencyCode, 'night')} / night</div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-slate-400">Estimated Total Quote</div>
                                    <div className="text-2xl font-black text-amber-400">{formatAmount(combinedEstimate, currencyCode)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Submit Custom Plan & Receive Official Quote</h3>
                                <p className="text-xs text-slate-500 mt-1">Our travel experts in Kandy will review your itinerary and send custom pricing via WhatsApp and email.</p>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.customer_name}
                                            onChange={(e) => setData('customer_name', e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">WhatsApp / Phone *</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.customer_phone}
                                            onChange={(e) => setData('customer_phone', e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                                        <input
                                            type="email"
                                            required
                                            value={data.customer_email}
                                            onChange={(e) => setData('customer_email', e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Anticipated Start Date</label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Number of Guests</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="30"
                                            value={data.guests_count}
                                            onChange={(e) => setData('guests_count', parseInt(e.target.value) || 2)}
                                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Special Requests & Notes</label>
                                    <textarea
                                        rows="3"
                                        value={data.special_requests}
                                        onChange={(e) => setData('special_requests', e.target.value)}
                                        placeholder="Add dietary restrictions, room preferences, child seats, or train ticket reservations..."
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setStep(3)}
                                        className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all disabled:opacity-50"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span>{processing ? 'Submitting...' : 'Submit & Open WhatsApp Inquiry'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
