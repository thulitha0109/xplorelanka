import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    MapPin, Star, Clock, Users, Zap, Filter, SlidersHorizontal, 
    CheckCircle2, ChevronDown, X, ArrowRight, Globe, Tag, Search,
    Mountain, Waves, TreePine, Camera, Sun, Car, Tent, Crown, Sparkles
} from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { formatProductPrice } from '../lib/currency';
import SeoHead from '../Components/SeoHead';

const CATEGORIES = [
    { key: 'all',       name: 'All Tours',          icon: Globe },
    { key: 'cultural',  name: 'Cultural Triangle',  icon: Camera },
    { key: 'nature',    name: 'Hill Country & Tea', icon: Mountain },
    { key: 'wildlife',  name: 'Wildlife Safaris',   icon: TreePine },
    { key: 'beach',     name: 'Coastal & Beaches',  icon: Waves },
    { key: 'adventure', name: 'Adventure & Camp',   icon: Zap },
    { key: 'day',       name: 'Day Excursions',     icon: Sun },
];

function TourCard({ tour, currency }) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tour.route || tour.title + ' Sri Lanka')}`;

    return (
        <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            {/* Image */}
            <Link href={`/tours/${tour.id}`} className="block relative h-52 overflow-hidden bg-slate-100">
                <img 
                    src={tour.image || '/images/legacy/tour-1.jpg'}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                        {tour.category}
                    </span>
                    {tour.is_featured && (
                        <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-xs">
                            Featured
                        </span>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow space-y-3">
                {/* Rating + Duration */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <span className="text-slate-900">{tour.rating}</span>
                        <span className="text-slate-400 font-normal">({tour.reviews_count || 0} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-500 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{tour.duration}</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    <Link href={`/tours/${tour.id}`} className="hover:text-amber-600 transition-colors">
                        {tour.title}
                    </Link>
                </h3>

                {/* Location */}
                <p className="flex items-center space-x-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{tour.route}</span>
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed flex-grow">
                    {tour.description}
                </p>

                {/* Tags */}
                {tour.tags && tour.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {tour.tags.slice(0, 3).map((tag, i) => (
                            <span
                                key={i}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer CTA & Price */}
            <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-3xl">
                <div>
                    <div className="text-[11px] font-medium text-slate-400">Starting from</div>
                    <div className="text-base font-black text-amber-600">
                        {formatProductPrice(tour, currency, 'package')}
                    </div>
                </div>
                <Link
                    href={`/tours/${tour.id}`}
                    className="px-4 py-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1"
                >
                    <span>View Tour</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    );
}

export default function Tours({ tours = [], currentCategory = 'all' }) {
    const { flash, currency } = usePage().props;
    const [selectedCategory, setSelectedCategory] = useState(currentCategory);
    const [search, setSearch] = useState('');

    const filteredTours = tours.filter(tour => {
        const matchCategory = selectedCategory === 'all' || tour.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchSearch = !search || (
            tour.title?.toLowerCase().includes(search.toLowerCase()) ||
            tour.route?.toLowerCase().includes(search.toLowerCase()) ||
            tour.description?.toLowerCase().includes(search.toLowerCase())
        );
        return matchCategory && matchSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
            <SeoHead
                title="Sri Lanka Tour Packages & Private Day Trips | Xplore Lanka"
                description="Browse custom Sri Lanka tour packages, Kandy day tours, cultural heritage visits, cycling adventures and private transfers from a Kandy-based local team."
                schema={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Sri Lanka Tours', description: 'Tour packages, day trips and cycling experiences across Sri Lanka.', mainEntity: { '@type': 'ItemList', itemListElement: tours.slice(0, 20).map((tour, index) => ({ '@type': 'ListItem', position: index + 1, name: tour.title, url: `https://xplorelanka.com/tours/${tour.id}` })) } }}
            />
            <Navbar currentPath="/tours" />

            {flash?.success && (
                <div className="bg-emerald-600 text-white px-4 py-3 text-center text-sm font-semibold flex items-center justify-center space-x-2 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}

            {/* Light Hero Header */}
            <section className="bg-gradient-to-b from-amber-50/60 via-white to-slate-50 border-b border-slate-200/80 py-14">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
                    <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider rounded-full">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>✦ {tours.length} Handcrafted Private Packages</span>
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900">Sri Lanka Tour Packages</h1>
                    <p className="text-slate-600 text-base max-w-2xl mx-auto">
                        Traverse UNESCO ancient capitals, climb mist-covered tea slopes in Ella, spot wild leopards in Yala, and unwind on southern gold sand beaches.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto relative pt-2">
                        <Search className="absolute left-4 top-1/2 translate-y-0.5 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by tour name, Sigiriya, Kandy, Safari..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm"
                        />
                    </div>
                </div>
            </section>

            <main className="flex-grow py-12 container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Category Chips */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = selectedCategory === cat.key;
                        return (
                            <button
                                key={cat.key}
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                                    isActive
                                        ? 'bg-amber-500 text-slate-950 shadow-md font-black scale-105'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400 hover:bg-slate-50'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{cat.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tours Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTours.map((tour) => (
                        <TourCard key={tour.id} tour={tour} currency={currency?.code || 'USD'} />
                    ))}
                </div>

                {filteredTours.length === 0 && (
                    <div className="text-center py-16 text-slate-500">
                        <p className="text-base font-bold">No tour packages match your filters.</p>
                        <button onClick={() => { setSearch(''); setSelectedCategory('all'); }} className="mt-2 text-xs font-bold text-amber-600 hover:underline">
                            Reset All Filters
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
