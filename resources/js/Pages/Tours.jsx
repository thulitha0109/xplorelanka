import React, { useState, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    MapPin, Star, Clock, Users, Zap, Filter, SlidersHorizontal, 
    CheckCircle2, ChevronDown, X, ArrowRight, Globe, Tag, Search,
    Mountain, Waves, TreePine, Camera, Sun, Car, Tent, Crown
} from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const CATEGORIES = [
    { key: 'all',       name: 'All Tours',          icon: Globe,    color: 'amber' },
    { key: 'cultural',  name: 'Cultural Triangle',  icon: Camera,   color: 'orange' },
    { key: 'nature',    name: 'Hill Country',        icon: Mountain, color: 'emerald' },
    { key: 'wildlife',  name: 'Wildlife Safaris',    icon: TreePine, color: 'green' },
    { key: 'beach',     name: 'Coastal & Beaches',   icon: Waves,    color: 'blue' },
    { key: 'adventure', name: 'Adventure',            icon: Zap,      color: 'yellow' },
    { key: 'day',       name: 'Day Trips',            icon: Sun,      color: 'amber' },
    { key: 'camping',   name: 'Wilderness Camping',   icon: Tent,     color: 'teal' },
    { key: 'private',   name: 'Private & Luxury',     icon: Crown,    color: 'purple' },
];

const SORT_OPTIONS = [
    { key: 'featured',   label: 'Featured' },
    { key: 'price_asc',  label: 'Price: Low → High' },
    { key: 'price_desc', label: 'Price: High → Low' },
    { key: 'rating',     label: 'Top Rated' },
    { key: 'newest',     label: 'Newest' },
];

function TourCard({ tour }) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tour.route || tour.title + ' Sri Lanka')}`;

    return (
        <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            {/* Image */}
            <Link href={`/tours/${tour.id}`} className="block relative h-52 overflow-hidden">
                <img 
                    src={tour.image || 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=800&auto=format&fit=crop'} 
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay badges */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <Link
                        href={`/tours?category=${tour.category}`}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-slate-950/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider hover:bg-amber-500 hover:text-slate-950 transition-all"
                    >
                        {tour.category}
                    </Link>
                    {tour.is_featured && (
                        <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                            ✦ Featured
                        </span>
                    )}
                </div>
                <div className="absolute bottom-3 right-3">
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                        <div className="text-xs text-slate-400">from</div>
                        <div className="text-base font-black text-amber-500 leading-tight">
                            LKR {Number(tour.price_lkr).toLocaleString()}
                        </div>
                    </div>
                </div>
            </Link>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow space-y-3">
                {/* Rating + Duration row */}
                <div className="flex items-center justify-between">
                    <Link
                        href={`/tours/${tour.id}#reviews`}
                        className="flex items-center space-x-1.5 text-amber-500 hover:text-amber-400 transition-colors group/rating"
                    >
                        <Star className="w-4 h-4 fill-amber-500 group-hover/rating:scale-110 transition-transform" />
                        <span className="font-black text-sm">{tour.rating}</span>
                        <span className="text-slate-400 text-xs">({tour.reviews_count} reviews)</span>
                    </Link>
                    <div className="flex items-center space-x-1 text-slate-500 text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{tour.duration}</span>
                    </div>
                </div>

                {/* Title */}
                <Link href={`/tours/${tour.id}`}>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-400 transition-colors leading-snug">
                        {tour.title}
                    </h3>
                </Link>

                {/* Location */}
                <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-amber-500 transition-colors group/loc"
                >
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 group-hover/loc:scale-110 transition-transform" />
                    <span className="truncate">{tour.route}</span>
                </a>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed flex-grow">
                    {tour.description}
                </p>

                {/* Tags */}
                {tour.tags && tour.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {tour.tags.slice(0, 3).map((tag, i) => (
                            <Link
                                key={i}
                                href={`/tours?category=${tag}`}
                                className="inline-flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
                            >
                                <Tag className="w-2.5 h-2.5" />
                                <span>{tag}</span>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Difficulty + group */}
                <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                    {tour.difficulty && (
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${
                            tour.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            tour.difficulty === 'moderate' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                            {tour.difficulty}
                        </span>
                    )}
                    {tour.max_group_size && (
                        <span className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>Max {tour.max_group_size}</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="px-5 pb-5">
                <Link
                    href={`/tours/${tour.id}`}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-900 dark:bg-amber-500 hover:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs rounded-xl transition-all group/btn"
                >
                    <span>View Tour Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}

export default function Tours({ tours = [], currentCategory = 'all', currentSort = 'featured', filters = {} }) {
    const { flash } = usePage().props;
    const [selectedCategory, setSelectedCategory] = useState(currentCategory);
    const [selectedSort, setSelectedSort] = useState(currentSort);
    const [showFilters, setShowFilters] = useState(false);
    const [search, setSearch] = useState('');

    // Client-side filter by search
    const filteredTours = tours.filter(tour => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            tour.title?.toLowerCase().includes(q) ||
            tour.description?.toLowerCase().includes(q) ||
            tour.route?.toLowerCase().includes(q) ||
            tour.category?.toLowerCase().includes(q)
        );
    });

    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        const params = new URLSearchParams();
        if (cat !== 'all') params.set('category', cat);
        if (selectedSort !== 'featured') params.set('sort', selectedSort);
        window.location.href = `/tours${params.toString() ? '?' + params.toString() : ''}`;
    };

    const handleSortChange = (sort) => {
        setSelectedSort(sort);
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        if (sort !== 'featured') params.set('sort', sort);
        window.location.href = `/tours${params.toString() ? '?' + params.toString() : ''}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
            <Head title="Sri Lanka Tour Packages — Xplor Lanka" />
            <Navbar currentPath="/tours" />

            {flash?.success && (
                <div className="bg-emerald-600 text-white px-4 py-3 text-center text-sm font-semibold flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}

            {/* Hero Header */}
            <section className="relative bg-slate-900 py-16 overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <img src="https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1920&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
                <div className="relative container mx-auto px-4 text-center">
                    <span className="inline-block px-4 py-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                        ✦ {filteredTours.length} Tours Available
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Sri Lanka Tour Packages</h1>
                    <p className="text-slate-300 text-base max-w-2xl mx-auto">
                        Handpicked itineraries spanning ancient kingdoms, misty hill country tea gardens, pristine coastlines & thrilling wildlife safaris.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-8 max-w-md mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tours, locations..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 backdrop-blur-sm text-sm"
                        />
                    </div>
                </div>
            </section>

            <main className="flex-grow py-10 container mx-auto px-4">
                {/* Category Filter Chips */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = selectedCategory === cat.key;
                        return (
                            <button
                                key={cat.key}
                                onClick={() => handleCategoryChange(cat.key)}
                                className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                    isActive
                                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105'
                                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-400 hover:text-amber-500'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{cat.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Sort Bar */}
                <div className="flex items-center justify-between mb-8">
                    <p className="text-sm text-slate-500">
                        Showing <span className="font-bold text-slate-800 dark:text-white">{filteredTours.length}</span> tours
                        {selectedCategory !== 'all' && <span> in <span className="text-amber-500 capitalize">{selectedCategory}</span></span>}
                    </p>
                    <div className="flex items-center space-x-2">
                        <label className="text-xs text-slate-500 font-semibold">Sort by:</label>
                        <select
                            value={selectedSort}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.key} value={opt.key}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tour Grid */}
                {filteredTours.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTours.map((tour) => (
                            <TourCard key={tour.id} tour={tour} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 space-y-4">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto">
                            <Globe className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No tours found</h3>
                        <p className="text-sm text-slate-500">Try a different category or clear your search.</p>
                        <button
                            onClick={() => { setSearch(''); handleCategoryChange('all'); }}
                            className="inline-flex items-center px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-sm rounded-xl hover:bg-amber-400 transition-all"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Clear Filters
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
