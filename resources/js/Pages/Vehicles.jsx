import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { formatAmount, formatProductPrice, getPriceAmount } from '../lib/currency';
import SeoHead from '../Components/SeoHead';
import { 
    Car, ShieldCheck, CheckCircle2, MessageCircle, Star, 
    Luggage, Users, Fuel, Gauge, PenLine, Sparkles, Navigation,
    Bus, Compass, Zap, ArrowRight, Shield, Clock, Award, ChevronRight
} from 'lucide-react';

export default function Vehicles({ vehicles = [], vehicleReviews = [], fleetPartners = [], currentCategory = 'all' }) {
    const { flash, currency } = usePage().props;
    const currencyCode = currency?.code || 'USD';
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
    const rateNumber = getPriceAmount(currentVehicleObj, currencyCode, 'per_km') || 0;
    const dailyRate = getPriceAmount(currentVehicleObj, currencyCode, 'day') || 0;

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
        data.notes = `Vehicle Booking: ${currentVehicleObj.name} (${calcMode === 'distance' ? distance + ' km route' : rentalDays + ' days hire'}). Estimate: ${formatAmount(estimatedCost, currencyCode)}. ${data.notes}`;

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
            <SeoHead
                title="Private Driver Sri Lanka & Chauffeur Fleet | Airport Transfers | Xplore Lanka"
                description="Hire licensed English-speaking drivers and tourist vehicles across Sri Lanka. Air-conditioned sedans, KDH vans, luxury SUVs and 4x4 safari jeeps with 24/7 support and 5.0★ Google rating."
                keywords="private driver Sri Lanka, airport transfers Sri Lanka, chauffeur hire Sri Lanka, Colombo to Sigiriya transfer, Kandy to Ella taxi, KDH van hire Sri Lanka, tourist driver Sri Lanka, safe driver Sri Lanka"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Vehicles & Transfers', url: '/vehicles' }
                ]}
                schema={{
                    '@context': 'https://schema.org',
                    '@type': ['TaxiService', 'AutoRental', 'Service'],
                    name: 'Sri Lanka Private Driver & Chauffeur Transfer Fleet',
                    serviceType: 'Private Chauffeur, Tourist Fleet Hire & Airport Transfers',
                    provider: { '@id': 'https://xplorelanka.com/#organization' },
                    areaServed: { '@type': 'Country', name: 'Sri Lanka' },
                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: '5.0',
                        reviewCount: 39,
                        bestRating: '5',
                        worstRating: '1'
                    }
                }}
            />
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
                                                src={v.image || '/images/legacy/vehicle-default.jpg'}
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
                                                    <div className="text-amber-600 font-black text-lg">{formatProductPrice(v, currencyCode, 'per_km')} / km</div>
                                                    {getPriceAmount(v, currencyCode, 'day') > 0 && (
                                                        <span className="text-[10px] text-slate-400">{formatProductPrice(v, currencyCode, 'day')} / day</span>
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
                                    <div className="text-3xl font-black text-amber-600">{formatAmount(estimatedCost, currencyCode)}</div>
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
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg sticky top-24 overflow-hidden">
                            <div className="overflow-hidden">
                                <img
                                    src={currentVehicleObj.image || '/images/legacy/vehicle-default.jpg'}
                                    alt={currentVehicleObj.name || 'Vehicle'}
                                    className="w-full h-52 object-cover"
                                />
                            </div>

                            <div className="p-6 sm:p-8 space-y-5">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Direct Booking</span>
                                    <h3 className="text-xl font-black text-slate-900 mt-1">Book Chauffeur Transfer</h3>
                                    <p className="text-xs text-slate-500">Contact our team to check vehicle availability and rates.</p>
                                </div>

                                {/* ── WhatsApp contact (No form needed) ── */}
                                <a
                                    href={`https://wa.me/94763762763?text=${encodeURIComponent(
                                        `Hi Xplore Lanka! I'd like to book a private vehicle transfer. Could you share availability and rates?`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group w-full flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-extrabold">Chat on WhatsApp</div>
                                            <div className="text-[10px] text-white/80 font-medium">Message our team directly</div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                                </a>

                                {/* ── Divider ── */}
                                <div className="flex items-center space-x-3">
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">or fill the form</span>
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                                </div>

                                {/* ── Booking Form ── */}
                                <form onSubmit={handleFormSubmit} className="space-y-3 text-xs sm:text-sm">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.customer_name}
                                            onChange={(e) => setData('customer_name', e.target.value)}
                                            placeholder="e.g. John Doe"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={data.customer_email}
                                                onChange={(e) => setData('customer_email', e.target.value)}
                                                placeholder="john@example.com"
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">WhatsApp</label>
                                            <input
                                                type="text"
                                                required
                                                value={data.customer_phone}
                                                onChange={(e) => setData('customer_phone', e.target.value)}
                                                placeholder="+94 77 123 4567"
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Pickup Location</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.pickup_location}
                                            onChange={(e) => setData('pickup_location', e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Dropoff / Destination</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.dropoff_location}
                                            onChange={(e) => setData('dropoff_location', e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wide">Travel Date</label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-black text-slate-950 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 hover:-translate-y-0.5"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span>{processing ? 'Sending...' : 'Submit Inquiry'}</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
