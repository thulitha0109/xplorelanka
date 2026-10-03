import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { MapPin, Star, Bed, Wifi, Coffee, MessageCircle, ShieldCheck, PenLine, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

export default function Accommodations({ accommodations = [], partners = [], currentCategory = 'all' }) {
    const [selectedCategory, setSelectedCategory] = useState(currentCategory);

    const categories = [
        { key: 'all', label: 'All Accommodations' },
        { key: 'Eco Lodge', label: 'Eco Lodges' },
        { key: 'Boutique Villa', label: 'Boutique Villas' },
        { key: 'Safari Glamping', label: 'Safari Glamping' },
        { key: 'Heritage Bungalow', label: 'Heritage Tea Bungalows' },
        { key: 'Beach Resort', label: 'Beachfront Resorts' },
    ];

    const filtered = selectedCategory === 'all'
        ? accommodations
        : accommodations.filter(a => a.category?.toLowerCase() === selectedCategory.toLowerCase());

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
            <Head title="Handpicked Eco Lodges, Boutique Villas & Tea Bungalows - Xplor Lanka" />
            <Navbar currentPath="/accommodations" />

            <main className="flex-grow py-12 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
                    <span className="inline-flex items-center space-x-1 px-3.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Curated Boutique Hospitality</span>
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900">Eco Lodges & Boutique Stays</h1>
                    <p className="text-slate-600 text-base max-w-2xl mx-auto">
                        Connected to verified local boutique hoteliers and eco-retreats. Experience misty mountain mornings, fresh Ceylon tea, and warm authentic hospitality.
                    </p>
                </div>

                {/* Category Filter Chips */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                    {categories.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => setSelectedCategory(cat.key)}
                            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                                selectedCategory === cat.key
                                    ? 'bg-amber-500 text-slate-950 shadow-md font-black scale-105'
                                    : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400 hover:bg-slate-50'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((acc) => (
                        <div key={acc.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                            <div>
                                <div className="h-56 relative overflow-hidden bg-slate-100">
                                    <img
                                        src={acc.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                                        alt={acc.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                                        {acc.category}
                                    </span>
                                    {acc.partner && (
                                        <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center space-x-1 shadow-sm">
                                            <ShieldCheck className="w-3 h-3" />
                                            <span>Partner: {acc.partner.name}</span>
                                        </span>
                                    )}
                                </div>
                                <div className="p-6 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                                            <Star className="w-4 h-4 fill-amber-500" />
                                            <span className="text-slate-900">{acc.rating}</span>
                                            <span className="text-slate-400 font-normal">({acc.reviews_count || 0} reviews)</span>
                                        </div>
                                        <Link
                                            href={`/write-review?accommodation_id=${acc.id}`}
                                            className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center space-x-1"
                                        >
                                            <PenLine className="w-3 h-3" />
                                            <span>Review Stay</span>
                                        </Link>
                                    </div>

                                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">{acc.name}</h3>
                                    
                                    <p className="text-xs text-slate-500 flex items-center space-x-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                        <span>{acc.location}</span>
                                    </p>

                                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{acc.description}</p>

                                    {/* Amenities Badges */}
                                    {acc.amenities && Array.isArray(acc.amenities) && acc.amenities.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-2">
                                            {acc.amenities.slice(0, 4).map((am, i) => (
                                                <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                                    {am}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-3xl">
                                <div>
                                    <span className="text-[10px] font-medium text-slate-400">Starting from</span>
                                    <div className="text-lg font-black text-amber-600">
                                        LKR {Number(acc.price_lkr).toLocaleString()}
                                        <span className="text-xs font-normal text-slate-400"> / {acc.period || 'night'}</span>
                                    </div>
                                </div>
                                <a
                                    href={`https://wa.me/94763762763?text=Hi%20Xplor%20Lanka,%20I'm%20inquiring%20about%20staying%20at%20${encodeURIComponent(acc.name)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
                                >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>Book Stay</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
