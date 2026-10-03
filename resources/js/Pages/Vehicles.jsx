import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { 
    Car, ShieldCheck, CheckCircle2, MessageCircle, Star, 
    Luggage, Users, Fuel, Gauge, PenLine, Sparkles, Navigation,
    Bus, Compass, Zap, ArrowRight, Shield, Clock, Award
} from 'lucide-react';

export default function Vehicles({ vehicles = [], vehicleReviews = [], fleetPartners = [], currentCategory = 'all' }) {
    const { flash } = usePage().props;
    const [selectedCategory, setSelectedCategory] = useState(currentCategory);
    const [calcMode, setCalcMode] = useState('distance'); // 'distance' or 'days'
    const [distance, setDistance] = useState(150);
    const [rentalDays, setRentalDays] = useState(3);
    const [selectedVehicleKey, setSelectedVehicleKey] = useState(vehicles[0]?.vehicle_key || 'sedan_car');

    const categories = [
        { key: 'all', label: 'All Fleet', icon: Car },
        { key: 'sedan', label: 'Sedans / Cars', icon: Car },
        { key: 'suv', label: 'Luxury SUVs', icon: ShieldCheck },
        { key: 'van', label: 'Passenger Vans (KDH)', icon: Users },
        { key: 'jeep', label: 'Safari 4x4 Jeeps', icon: Compass },
        { key: 'bus', label: 'Mini-Buses & Coaches', icon: Bus },
        { key: 'tuk', label: 'Tuk-Tuk Safari', icon: Zap },
    ];

    const getVehicleIcon = (category, key) => {
        const str = ((category || '') + ' ' + (key || '')).toLowerCase();
        if (str.includes('suv')) return ShieldCheck;
        if (str.includes('van')) return Users;
        if (str.includes('safari') || str.includes('jeep')) return Compass;
        if (str.includes('bus') || str.includes('coach')) return Bus;
        if (str.includes('tuk')) return Zap;
        return Car;
    };

    const filteredVehicles = selectedCategory === 'all'
        ? vehicles
        : vehicles.filter(v => 
            v.vehicle_category?.toLowerCase().includes(selectedCategory.toLowerCase()) || 
            v.vehicle_key?.toLowerCase().includes(selectedCategory.toLowerCase())
        );

    const currentVehicleObj = vehicles.find(v => v.vehicle_key === selectedVehicleKey) || vehicles[0] || {};
    const rateNumber = currentVehicleObj.rate_per_km ? parseInt(currentVehicleObj.rate_per_km.replace(/[^0-9]/g, '')) || 120 : 120;
    const dailyRate = currentVehicleObj.daily_rate_lkr ? Number(currentVehicleObj.daily_rate_lkr) : (rateNumber * 100);

    const estimatedCost = calcMode === 'distance'
        ? distance * rateNumber
        : rentalDays * dailyRate;

    const { data, setData, post, processing, reset } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        pickup_location: 'Bandaranaike Colombo Airport (BIA)',
        dropoff_location: 'Kandy / Cultural Triangle',
        vehicle_type: selectedVehicleKey,
        start_date: '',
        notes: '',
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        data.vehicle_type = selectedVehicleKey;
        data.notes = `Vehicle Booking: ${currentVehicleObj.name} (${calcMode === 'distance' ? distance + ' km route' : rentalDays + ' days hire'}). Est: LKR ${estimatedCost.toLocaleString()}. ${data.notes}`;

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
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
            <Head title="Private Vehicle Fleet, Airport Transfers & Chauffeur Services - Xplor Lanka" />
            <Navbar currentPath="/vehicles" />

            {flash?.success && (
                <div className="bg-emerald-600 text-white px-4 py-3 text-center text-sm font-semibold flex items-center justify-center space-x-2 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}

            <main className="flex-grow py-12 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
                    <span className="inline-flex items-center space-x-1 px-3.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Licensed Tourist Fleet & Certified Chauffeurs</span>
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900">Private Vehicle Fleet & Transfers</h1>
                    <p className="text-slate-600 text-base max-w-2xl mx-auto">
                        Air-conditioned sedans, high-roof KDH passenger vans, luxury Prado SUVs, and 4x4 safari jeeps. English-fluent chauffeurs with 24/7 road assistance.
                    </p>
                </div>

                {/* Category Chips with Icons */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                    {categories.map(cat => {
                        const IconComp = cat.icon;
                        const isSelected = selectedCategory === cat.key;
                        return (
                            <button
                                key={cat.key}
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
                                    isSelected
                                        ? 'bg-amber-500 text-slate-950 shadow-md font-black scale-105'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400 hover:bg-slate-50'
                                }`}
                            >
                                <IconComp className="w-4 h-4" />
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Fleet Grid */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {filteredVehicles.map((v) => {
                                const isSelected = selectedVehicleKey === v.vehicle_key;
                                const VehicleIcon = getVehicleIcon(v.vehicle_category, v.vehicle_key);
                                return (
                                    <div
                                        key={v.id}
                                        onClick={() => setSelectedVehicleKey(v.vehicle_key)}
                                        className={`bg-white rounded-3xl border cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                                            isSelected
                                                ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-xl bg-amber-50/20'
                                                : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                                        }`}
                                    >
                                        <div className="relative h-48 overflow-hidden bg-slate-100">
                                            <img
                                                src={v.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'}
                                                alt={v.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                                            <div className="absolute top-4 left-4 flex items-center justify-between w-[calc(100%-2rem)]">
                                                <div className="w-11 h-11 rounded-2xl bg-white/90 text-amber-700 flex items-center justify-center shadow-sm">
                                                    <VehicleIcon className="w-5 h-5" />
                                                </div>
                                                {v.partner ? (
                                                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                                                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                                        <span className="truncate max-w-[120px]">{v.partner.name}</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                                                        <span>Official Fleet</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="font-extrabold text-lg text-slate-900 leading-tight">{v.name}</h3>
                                            
                                            {/* Specs */}
                                            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                                                <div className="flex items-center space-x-1.5">
                                                    <Users className="w-3.5 h-3.5 text-amber-600" />
                                                    <span>{v.seats}</span>
                                                </div>
                                                <div className="flex items-center space-x-1.5">
                                                    <Luggage className="w-3.5 h-3.5 text-amber-600" />
                                                    <span>{v.luggage_capacity || 4} Luggage Bags</span>
                                                </div>
                                                <div className="flex items-center space-x-1.5">
                                                    <Gauge className="w-3.5 h-3.5 text-amber-600" />
                                                    <span>{v.transmission || 'Automatic'}</span>
                                                </div>
                                                <div className="flex items-center space-x-1.5">
                                                    <Fuel className="w-3.5 h-3.5 text-amber-600" />
                                                    <span>{v.fuel_type || 'Diesel'}</span>
                                                </div>
                                            </div>

                                            <p className="text-xs text-slate-500 mt-4 leading-relaxed line-clamp-2">{v.description}</p>

                                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                                <div>
                                                    <span className="text-[10px] uppercase font-bold text-slate-400">Rate per km</span>
                                                    <div className="text-amber-600 font-black text-lg">{v.rate_per_km}</div>
                                                    {v.daily_rate_lkr > 0 && (
                                                        <span className="text-[10px] text-slate-400">LKR {Number(v.daily_rate_lkr).toLocaleString()} / day</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={`/write-review?vehicle_id=${v.id}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="p-2 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 transition-colors"
                                                        title="Review Vehicle"
                                                    >
                                                        <PenLine className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                                            isSelected
                                                                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                        }`}
                                                    >
                                                        {isSelected ? 'Selected' : 'Select'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Interactive Cost Estimator (Light Luxury Card) */}
                        <div className="bg-white p-8 rounded-3xl space-y-6 shadow-md border border-slate-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Instant Online Calculator</span>
                                    <h4 className="font-black text-xl text-slate-900">Transfer & Chauffeur Quote Estimator</h4>
                                </div>
                                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
                                    <button
                                        type="button"
                                        onClick={() => setCalcMode('distance')}
                                        className={`px-3 py-1.5 rounded-lg transition-all ${calcMode === 'distance' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600'}`}
                                    >
                                        By Distance (km)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCalcMode('days')}
                                        className={`px-3 py-1.5 rounded-lg transition-all ${calcMode === 'days' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600'}`}
                                    >
                                        By Rental Days
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                {calcMode === 'distance' ? (
                                    <>
                                        <div className="flex justify-between text-xs text-slate-700">
                                            <span>Estimated Route Distance:</span>
                                            <span className="font-black text-amber-600 text-sm">{distance} km</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="30"
                                            max="800"
                                            step="10"
                                            value={distance}
                                            onChange={(e) => setDistance(Number(e.target.value))}
                                            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                                        />
                                        <div className="flex justify-between text-[11px] text-slate-500">
                                            <span>Airport to Colombo (35km)</span>
                                            <span>Colombo to Kandy (120km)</span>
                                            <span>Full Tour Circuit (500km+)</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between text-xs text-slate-700">
                                            <span>Private Driver & Vehicle Hire Duration:</span>
                                            <span className="font-black text-amber-600 text-sm">{rentalDays} Days</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="21"
                                            step="1"
                                            value={rentalDays}
                                            onChange={(e) => setRentalDays(Number(e.target.value))}
                                            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                                        />
                                    </>
                                )}
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs text-slate-600">Selected Vehicle: <strong className="text-slate-900">{currentVehicleObj.name || 'Passenger Van'}</strong></p>
                                    <p className="text-[11px] text-slate-500">Includes private chauffeur, fuel, highway tolls & passenger insurance</p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <div className="text-xs text-slate-400">Estimated Total</div>
                                    <div className="text-3xl font-black text-amber-600">LKR {estimatedCost.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        {/* Verified Vehicle Fleet Reviews */}
                        {vehicleReviews.length > 0 && (
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-extrabold text-lg text-slate-900 flex items-center space-x-2">
                                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                        <span>Verified Fleet & Chauffeur Reviews</span>
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {vehicleReviews.map(r => (
                                        <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="font-bold text-slate-900 text-sm">{r.customer_name}</div>
                                                <div className="flex items-center text-amber-500 text-xs">
                                                    {[...Array(r.rating || 5)].map((_, i) => (
                                                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                                                    ))}
                                                </div>
                                            </div>
                                            {r.title && <div className="font-bold text-xs text-slate-800">"{r.title}"</div>}
                                            <p className="text-xs text-slate-600 line-clamp-3">{r.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Booking / Inquiry Sidebar Form */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg sticky top-24 space-y-5">
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                                <img
                                    src={currentVehicleObj.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'}
                                    alt={currentVehicleObj.name || 'Vehicle'}
                                    className="w-full h-52 object-cover"
                                />
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Fast Confirmation</span>
                                <h3 className="text-xl font-black text-slate-900 mt-1">Book Chauffeur Transfer</h3>
                                <p className="text-xs text-slate-500">We confirm within 15 minutes via WhatsApp.</p>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        placeholder="e.g. John Doe"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={data.customer_email}
                                            onChange={(e) => setData('customer_email', e.target.value)}
                                            placeholder="john@example.com"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">WhatsApp</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.customer_phone}
                                            onChange={(e) => setData('customer_phone', e.target.value)}
                                            placeholder="+94 77 123 4567"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Pickup Location</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.pickup_location}
                                        onChange={(e) => setData('pickup_location', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Dropoff / Destination</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.dropoff_location}
                                        onChange={(e) => setData('dropoff_location', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Travel Date</label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 font-black text-slate-950 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Inquire on WhatsApp</span>
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
