import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Compass, Calendar, Users, MapPin, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';

export default function Planner({ tours = [], vehicles = [] }) {
    const { flash } = usePage().props;
    const [selectedPlaces, setSelectedPlaces] = useState(['Sigiriya', 'Ella']);
    const [days, setDays] = useState(7);
    const [travelStyle, setTravelStyle] = useState('comfort');

    const { data, setData, post, processing, reset } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        guests_count: 2,
        start_date: '',
        notes: '',
    });

    const destinations = [
        'Sigiriya & Dambulla', 'Kandy Sacred City', 'Ella & Nine Arch', 
        'Nuwara Eliya Tea Country', 'Yala Safari', 'Mirissa Coast', 
        'Galle Fort', 'Knuckles Wilderness'
    ];

    const togglePlace = (place) => {
        if (selectedPlaces.includes(place)) {
            setSelectedPlaces(selectedPlaces.filter(p => p !== place));
        } else {
            setSelectedPlaces([...selectedPlaces, place]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        data.notes = `Custom Trip Plan: ${days} Days, Style: ${travelStyle}, Selected Places: ${selectedPlaces.join(', ')}. ${data.notes}`;
        post('/bookings', {
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
            <Head title="Custom Sri Lanka Trip Planner - Xplor Lanka" />
            <Navbar currentPath="/planner" />

            {flash?.success && (
                <div className="bg-emerald-600 text-white px-4 py-3 text-center text-sm font-semibold flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}

            <main className="flex-grow py-12 container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
                    <span className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Interactive Itinerary Builder</span>
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Build Your Dream Sri Lanka Tour</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-base">
                        Select your favorite places, preferred duration, and travel style to generate a tailored private tour quote.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
                    {/* Step 1: Select Destinations */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center space-x-2">
                            <MapPin className="w-5 h-5 text-amber-500" />
                            <span>1. Select Destinations You Wish to Visit</span>
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {destinations.map((place) => {
                                const isSelected = selectedPlaces.includes(place);
                                return (
                                    <button
                                        key={place}
                                        type="button"
                                        onClick={() => togglePlace(place)}
                                        className={`p-3 rounded-xl text-xs font-bold text-center border transition-all ${
                                            isSelected
                                                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                        }`}
                                    >
                                        {place}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 2: Trip Duration & Style */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="font-bold text-slate-900 dark:text-white flex items-center space-x-2 text-sm">
                                <Calendar className="w-4 h-4 text-amber-500" />
                                <span>Trip Duration ({days} Days)</span>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="21"
                                value={days}
                                onChange={(e) => setDays(Number(e.target.value))}
                                className="w-full accent-amber-500 cursor-pointer"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="font-bold text-slate-900 dark:text-white flex items-center space-x-2 text-sm">
                                <Compass className="w-4 h-4 text-amber-500" />
                                <span>Travel Style</span>
                            </label>
                            <select
                                value={travelStyle}
                                onChange={(e) => setTravelStyle(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm font-medium"
                            >
                                <option value="budget">Budget / Backpacker Eco</option>
                                <option value="comfort">Standard Comfort (3-Star & Cabins)</option>
                                <option value="luxury">Luxury & Boutique Heritage</option>
                            </select>
                        </div>
                    </div>

                    {/* Contact details */}
                    <form onSubmit={handleSubmit} className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">Your Contact Details for Proposal</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <input
                                type="text"
                                required
                                placeholder="Your Name"
                                value={data.customer_name}
                                onChange={(e) => setData('customer_name', e.target.value)}
                                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                            />
                            <input
                                type="email"
                                required
                                placeholder="Your Email"
                                value={data.customer_email}
                                onChange={(e) => setData('customer_email', e.target.value)}
                                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                            />
                            <input
                                type="text"
                                required
                                placeholder="WhatsApp Number"
                                value={data.customer_phone}
                                onChange={(e) => setData('customer_phone', e.target.value)}
                                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-amber-500 hover:bg-amber-600 font-extrabold text-slate-950 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-base"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span>Generate & Request Custom Tour Quote</span>
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
