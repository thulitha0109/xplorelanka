import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Car, ShieldCheck, CheckCircle2, MessageCircle } from 'lucide-react';

export default function Vehicles({ vehicles = [] }) {
    const { flash } = usePage().props;
    const [distance, setDistance] = useState(150);
    const [selectedVehicle, setSelectedVehicle] = useState('van');

    const { data, setData, post, processing, reset } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        pickup_location: 'BIA Colombo Airport',
        dropoff_location: 'Kandy / Ella',
        vehicle_type: 'van',
        start_date: '',
        notes: '',
    });

    const currentVehicleObj = vehicles.find(v => v.vehicle_key === selectedVehicle) || vehicles[0];
    const rateNumber = currentVehicleObj ? parseInt(currentVehicleObj.rate_per_km?.replace(/[^0-9]/g, '') || 115) : 115;
    const estimatedCost = distance * rateNumber;

    const handleFormSubmit = (e) => {
        e.preventDefault();
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
            <Head title="Vehicle Fleet & Airport Transfers - Xplor Lanka" />
            <Navbar currentPath="/vehicles" />

            {flash?.success && (
                <div className="bg-emerald-600 text-white px-4 py-3 text-center text-sm font-semibold flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}

            <main className="flex-grow py-12 container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
                    <span className="text-amber-500 font-bold text-sm tracking-wider uppercase">Airport Pickups & Islandwide Transfers</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Private Vehicle Fleet</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-base">
                        Book AC private sedans, luxury KDH vans, micro buses, or tour coaches with professional tourist drivers.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Fleet Grid */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {vehicles.map((v) => (
                                <div
                                    key={v.id}
                                    onClick={() => {
                                        setSelectedVehicle(v.vehicle_key);
                                        setData('vehicle_type', v.vehicle_key);
                                    }}
                                    className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border cursor-pointer transition-all ${
                                        selectedVehicle === v.vehicle_key
                                            ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-lg'
                                            : 'border-slate-200 dark:border-slate-800'
                                    }`}
                                >
                                    <div className="text-4xl mb-3">{v.icon}</div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{v.name}</h3>
                                    <div className="text-xs text-slate-500 mt-1">{v.seats}</div>
                                    <div className="text-amber-500 font-black text-xl mt-2">{v.rate_per_km}</div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">{v.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Cost Calculator Widget */}
                        <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4 shadow-xl">
                            <h4 className="font-bold text-lg text-amber-400">Transfer Cost Estimator</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-300">
                                    <span>Estimated Route Distance:</span>
                                    <span className="font-bold text-amber-400">{distance} km</span>
                                </div>
                                <input
                                    type="range"
                                    min="30"
                                    max="600"
                                    step="10"
                                    value={distance}
                                    onChange={(e) => setDistance(Number(e.target.value))}
                                    className="w-full accent-amber-500 cursor-pointer"
                                />
                            </div>
                            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                                <span className="text-xs text-slate-400">Estimated Total Rate:</span>
                                <span className="text-2xl font-black text-amber-400">LKR {estimatedCost.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white border-b pb-3 border-slate-200 dark:border-slate-800">
                                Book Transfer / Chauffeur
                            </h3>
                            <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">WhatsApp / Phone</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.customer_phone}
                                        onChange={(e) => setData('customer_phone', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Pickup Location</label>
                                    <input
                                        type="text"
                                        value={data.pickup_location}
                                        onChange={(e) => setData('pickup_location', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Dropoff Location</label>
                                    <input
                                        type="text"
                                        value={data.dropoff_location}
                                        onChange={(e) => setData('dropoff_location', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Travel Date</label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 font-bold text-white rounded-lg shadow-md flex items-center justify-center space-x-2"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Send Transfer Inquiry</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
