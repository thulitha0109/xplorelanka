import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import GoogleMap from '../Components/GoogleMap';
import ReviewSection from '../Components/ReviewSection';
import { 
    MapPin, Calendar, Users, Search, Compass, Star, ChevronRight, ChevronLeft,
    MessageCircle, Phone, CheckCircle2, Shield, Heart, ArrowRight, X, Sparkles, Navigation,
    Car, Bus, ShieldCheck, Zap, Bed, BookOpen, Quote, Award
} from 'lucide-react';

export default function Home({ featuredTours = [], accommodations = [], vehicles = [], reviews = [] }) {
    const { flash } = usePage().props;
    const [selectedTour, setSelectedTour] = useState(null);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    
    // Top 3 featured reviews for the interactive Hero Card Deck
    const defaultHeroReviews = [
        {
            id: 101,
            customer_name: 'Marcus & Elena Rost',
            customer_country: 'Germany',
            avatar_img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            trip_img: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=600&q=80', // Sigiriya Lion Rock
            title: 'Exceptional 14-day journey — our guide Nuwan was world-class!',
            rating: 5,
            comment: 'We booked the 14-day ultimate tour through Xplor Lanka and it exceeded every expectation. Our private driver and guide Nuwan was attentive, safe, punctual, and shared incredible knowledge of Sri Lankan history. The sunrise climb at Sigiriya and spotting leopards in Yala will stay in our memories forever!',
            tour_name: '14-Day Ultimate Sri Lanka Explorer',
            avatar_color: 'bg-amber-500'
        },
        {
            id: 102,
            customer_name: 'Charlotte & James Davies',
            customer_country: 'United Kingdom',
            avatar_img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            trip_img: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=600&q=80', // Ella Train & Tea
            title: 'Dream honeymoon in the Hill Country & Ceylon Tea Trails',
            rating: 5,
            comment: 'From the moment we were picked up at Bandaranaike Airport, Xplor Lanka took care of every detail. The heritage planters bungalow in Nuwara Eliya felt like stepping back in time, and the scenic train ride to Ella had reserved first-class seats arranged flawlessly.',
            tour_name: '5-Day Hill Country Romantic Getaway',
            avatar_color: 'bg-emerald-600'
        },
        {
            id: 103,
            customer_name: 'David & Liam Nguyen',
            customer_country: 'Australia',
            avatar_img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
            trip_img: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80', // Safari Elephants
            title: 'Wild Ceylon Safari was the highlight for our family',
            rating: 5,
            comment: 'Traveling with two teenagers, we wanted nature, excitement, and wildlife. The private 4x4 safari jeeps in Udawalawe got us up-close with majestic elephant herds, and our naturalist in Yala was extraordinary. Spotless AC van and 5-star service throughout.',
            tour_name: '6-Day Wild Safari & Udawalawe Wildlife',
            avatar_color: 'bg-blue-600'
        }
    ];

    const heroReviews = (reviews && reviews.length >= 3)
        ? reviews.slice(0, 3).map((r, i) => ({
            ...r,
            avatar_img: r.user?.avatar || defaultHeroReviews[i]?.avatar_img,
            trip_img: (Array.isArray(r.media_urls) && r.media_urls[0]) || r.tour?.image || defaultHeroReviews[i]?.trip_img,
        }))
        : defaultHeroReviews;

    const [activeReviewIndex, setActiveReviewIndex] = useState(0);

    // Auto cycle hero reviews deck every 6s unless interacted
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveReviewIndex((prev) => (prev + 1) % heroReviews.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [heroReviews.length]);

    const { data, setData, post, processing, reset } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        guests_count: 2,
        start_date: '',
        tour_id: '',
        notes: '',
    });

    const openBookingForTour = (tour) => {
        setSelectedTour(tour);
        setData('tour_id', tour ? tour.id : '');
        setBookingModalOpen(true);
    };

    const handleBookingSubmit = (e) => {
        e.preventDefault();
        post('/bookings', {
            onSuccess: (page) => {
                reset();
                setBookingModalOpen(false);
                if (page.props.flash?.whatsapp_url) {
                    window.open(page.props.flash.whatsapp_url, '_blank');
                }
            }
        });
    };

    const countryFlag = (country) => {
        if (!country) return '🌍';
        const flags = {
            'Germany': '🇩🇪', 'United Kingdom': '🇬🇧', 'UK': '🇬🇧', 'Australia': '🇦🇺',
            'France': '🇫🇷', 'United States': '🇺🇸', 'USA': '🇺🇸', 'Sweden': '🇸🇪',
            'Canada': '🇨🇦', 'Netherlands': '🇳🇱', 'Switzerland': '🇨🇭', 'India': '🇮🇳'
        };
        for (const [key, val] of Object.entries(flags)) {
            if (country.toLowerCase().includes(key.toLowerCase())) return val;
        }
        return '🌍';
    };

    const getVehicleIcon = (category) => {
        const cat = (category || '').toLowerCase();
        if (cat.includes('sedan') || cat.includes('car')) return Car;
        if (cat.includes('suv')) return ShieldCheck;
        if (cat.includes('van')) return Users;
        if (cat.includes('safari') || cat.includes('jeep')) return Compass;
        if (cat.includes('coach') || cat.includes('bus')) return Bus;
        if (cat.includes('tuk')) return Zap;
        return Car;
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
            <Head title="Xplor Lanka - Premium Sri Lanka Tours, Stays & Private Transfers" />
            <Navbar currentPath="/" />

            {/* Flash Banner */}
            {flash?.success && (
                <div className="bg-emerald-600 text-white px-4 py-3 text-center text-sm font-semibold flex items-center justify-center space-x-2 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}

            <main className="flex-grow">
                {/* ── REDESIGNED LIGHT-THEME HERO SECTION WITH 3-REVIEW CARD DECK ── */}
                <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-white to-slate-50 border-b border-slate-200/80 pt-12 pb-20 lg:pt-16 lg:pb-28">
                    {/* Subtle warm background accents */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                            
                            {/* Left Column: Hero Content */}
                            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300/80 text-amber-900 text-xs font-bold tracking-wide shadow-xs">
                                    <Sparkles className="w-4 h-4 text-amber-600" />
                                    <span>Sri Lanka’s #1 Rated Private Tour Specialists</span>
                                </div>

                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
                                    Discover Sri Lanka in <br className="hidden sm:inline" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700">
                                        Tailored Luxury & Comfort
                                    </span>
                                </h1>

                                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                                    Bespoke private tours, certified English-speaking chauffeurs, handpicked boutique tea estate bungalows, and thrilling leopard safaris across the island.
                                </p>

                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                                    <Link
                                        href="/tours"
                                        className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl transition-all flex items-center space-x-2 transform hover:-translate-y-0.5"
                                    >
                                        <span>Explore Tour Packages</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>

                                    <a
                                        href="https://wa.me/94763762763"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        <span>WhatsApp Concierge</span>
                                    </a>

                                    <Link
                                        href="/planner"
                                        className="px-6 py-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-sm sm:text-base rounded-xl shadow-xs transition-all flex items-center space-x-2"
                                    >
                                        <span>Custom Trip Planner</span>
                                    </Link>
                                </div>

                                {/* Trust Metrics Strip */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80">
                                    <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200/60 shadow-xs text-center lg:text-left">
                                        <div className="text-2xl font-black text-amber-600">1,000+</div>
                                        <div className="text-xs font-semibold text-slate-500">Happy Travelers</div>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200/60 shadow-xs text-center lg:text-left">
                                        <div className="text-2xl font-black text-amber-600">4.9 ★</div>
                                        <div className="text-xs font-semibold text-slate-500">Verified Ratings</div>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200/60 shadow-xs text-center lg:text-left">
                                        <div className="text-2xl font-black text-amber-600">100%</div>
                                        <div className="text-xs font-semibold text-slate-500">Customizable</div>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200/60 shadow-xs text-center lg:text-left">
                                        <div className="text-2xl font-black text-amber-600">24/7</div>
                                        <div className="text-xs font-semibold text-slate-500">Local Support</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: RESPONSIVE 3-REVIEW CARD DECK */}
                            <div className="lg:col-span-5 flex flex-col items-center">
                                <div className="w-full max-w-md">
                                    
                                    {/* Deck Header Title */}
                                    <div className="flex items-center justify-between mb-4 px-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-600">
                                                <Award className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Featured Traveler Reviews</h3>
                                                <p className="text-sm font-bold text-slate-900">Real Experiences from Global Guests</p>
                                            </div>
                                        </div>
                                        
                                        {/* Deck Nav Arrows */}
                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={() => setActiveReviewIndex((prev) => (prev - 1 + heroReviews.length) % heroReviews.length)}
                                                className="p-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-xs transition-colors"
                                                aria-label="Previous Review"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setActiveReviewIndex((prev) => (prev + 1) % heroReviews.length)}
                                                className="p-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-xs transition-colors"
                                                aria-label="Next Review"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* The Stacked 3D Card Deck Container */}
                                    <div className="relative h-[430px] sm:h-[400px] w-full select-none flex items-center justify-center my-2">
                                        {heroReviews.map((rev, idx) => {
                                            // Determine position relative to activeReviewIndex
                                            // offset 0: Center active, offset 1: Right card tilted right, offset 2: Left card tilted left
                                            const offset = (idx - activeReviewIndex + heroReviews.length) % heroReviews.length;
                                            
                                            let cardTransform = '';
                                            let zIndex = 10;
                                            let opacity = 'opacity-80 hover:opacity-100';
                                            let cursor = 'cursor-pointer';

                                            if (offset === 0) {
                                                // Active / Center Card (Straight, high elevation)
                                                cardTransform = 'translate-x-0 translate-y-0 rotate-0 scale-100 shadow-2xl ring-2 ring-amber-400/50 bg-white';
                                                zIndex = 30;
                                                opacity = 'opacity-100';
                                                cursor = 'cursor-default';
                                            } else if (offset === 1) {
                                                // Right Card (Tilted right)
                                                cardTransform = 'translate-x-6 sm:translate-x-10 translate-y-3 rotate-6 hover:rotate-3 scale-[0.93] shadow-xl bg-white/95';
                                                zIndex = 20;
                                            } else {
                                                // Left Card (Tilted left)
                                                cardTransform = '-translate-x-6 sm:-translate-x-10 translate-y-3 -rotate-6 hover:-rotate-3 scale-[0.93] shadow-xl bg-white/95';
                                                zIndex = 10;
                                            }

                                            return (
                                                <div
                                                    key={rev.id || idx}
                                                    onClick={() => offset !== 0 && setActiveReviewIndex(idx)}
                                                    className={`absolute inset-x-2 sm:inset-x-4 top-0 bottom-0 rounded-3xl p-5 border border-slate-200 shadow-lg transition-all duration-500 ease-out flex flex-col justify-between ${cardTransform} ${opacity} ${cursor}`}
                                                    style={{ zIndex }}
                                                >
                                                    <div>
                                                        {/* Top row: Avatar Photo, Name, Country, Stars */}
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-xs shrink-0 bg-slate-100">
                                                                    {rev.avatar_img ? (
                                                                        <img src={rev.avatar_img} alt={rev.customer_name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black text-sm flex items-center justify-center">
                                                                            {rev.customer_name ? rev.customer_name.charAt(0).toUpperCase() : 'G'}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">{rev.customer_name}</div>
                                                                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-0.5">
                                                                        <span>{countryFlag(rev.customer_country)}</span>
                                                                        <span className="truncate max-w-[110px] sm:max-w-none">{rev.customer_country || 'Global Traveler'}</span>
                                                                        <span className="text-emerald-600 font-semibold hidden sm:inline">• Verified</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200/80 px-2 py-1 rounded-xl shrink-0">
                                                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                                                <span className="text-xs font-black text-amber-900">5.0</span>
                                                            </div>
                                                        </div>

                                                        {/* Trip Photo Preview & Tour Badge */}
                                                        {rev.trip_img && (
                                                            <div className="mt-3 relative h-28 sm:h-24 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-inner">
                                                                <img src={rev.trip_img} alt="" className="w-full h-full object-cover" />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-2.5">
                                                                    <span className="text-[11px] font-bold text-white truncate drop-shadow-sm flex items-center space-x-1">
                                                                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                                                                        <span>{rev.tour?.title || rev.tour_name || 'Sri Lanka Highlights Tour'}</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Review Headline & Quote */}
                                                        <div className="mt-3">
                                                            {rev.title && (
                                                                <h4 className="font-black text-slate-900 text-xs sm:text-sm mb-1 leading-snug line-clamp-1">
                                                                    "{rev.title}"
                                                                </h4>
                                                            )}
                                                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                                                                {rev.comment}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Card Deck Bottom Footer */}
                                                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                                                        <span className="text-slate-500 flex items-center space-x-1 text-[11px]">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                            <span>Verified Google Guest Review</span>
                                                        </span>
                                                        {offset !== 0 ? (
                                                            <span className="text-[11px] font-bold text-amber-600 hover:underline">
                                                                Tap to view
                                                            </span>
                                                        ) : (
                                                            <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Deck Interactive Step Navigator & Dots */}
                                    <div className="flex flex-col items-center space-y-2 mt-4">
                                        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-xs p-1.5 rounded-full border border-slate-200 shadow-xs">
                                            {heroReviews.map((rev, dotIdx) => (
                                                <button
                                                    key={dotIdx}
                                                    onClick={() => setActiveReviewIndex(dotIdx)}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 flex items-center space-x-1.5 ${
                                                        activeReviewIndex === dotIdx 
                                                            ? 'bg-amber-500 text-slate-950 shadow-xs scale-105' 
                                                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                                    }`}
                                                    aria-label={`Go to review ${dotIdx + 1}`}
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                    <span className="hidden sm:inline">{rev.customer_name ? rev.customer_name.split(' ')[0] : `Guest ${dotIdx + 1}`}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <span className="text-[11px] text-slate-400 font-medium">Click tilted cards or buttons to browse reviews</span>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ── FEATURED TOURS SECTION (CLICK TITLE LINKS TO SINGLE TOUR PAGE) ── */}
                <section className="py-20 container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                        <div>
                            <span className="text-amber-600 font-extrabold text-xs tracking-wider uppercase bg-amber-100 px-3 py-1 rounded-full">
                                Handcrafted Itineraries
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">
                                Featured Tour Packages
                            </h2>
                            <p className="text-sm text-slate-600 mt-1 max-w-xl">
                                Click any tour package to view day-by-day itineraries, highlights, route maps, and guest reviews.
                            </p>
                        </div>
                        <Link 
                            href="/tours" 
                            className="mt-4 md:mt-0 px-5 py-2.5 bg-white border border-slate-300 hover:border-amber-500 text-slate-800 hover:text-amber-600 font-bold text-sm rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
                        >
                            <span>View All Tours</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredTours.map((tour) => (
                            <div 
                                key={tour.id} 
                                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    {/* Tour Image with Direct Single Page Link */}
                                    <Link href={`/tours/${tour.id}`} className="block relative h-52 overflow-hidden">
                                        <img 
                                            src={tour.image || 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=800&auto=format&fit=crop'} 
                                            alt={tour.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                        <span className="absolute top-3 left-3 bg-slate-900/85 text-white text-xs font-bold px-3 py-1 rounded-lg capitalize backdrop-blur-xs">
                                            {tour.category}
                                        </span>
                                        {tour.is_featured && (
                                            <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-xs">
                                                Featured
                                            </span>
                                        )}
                                    </Link>

                                    {/* Tour Content */}
                                    <div className="p-5 space-y-3">
                                        <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                                            <Star className="w-4 h-4 fill-amber-500" />
                                            <span className="text-slate-900">{tour.rating || '4.9'}</span>
                                            <span className="text-slate-400 font-normal">({tour.reviews_count || 32} reviews)</span>
                                        </div>

                                        {/* CLICKABLE TITLE TO SINGLE TOUR PAGE */}
                                        <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">
                                            <Link 
                                                href={`/tours/${tour.id}`} 
                                                className="hover:text-amber-600 transition-colors"
                                                title={`View ${tour.title}`}
                                            >
                                                {tour.title}
                                            </Link>
                                        </h3>

                                        <p className="text-xs text-slate-500 flex items-center space-x-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                            <span className="truncate">{tour.route}</span>
                                        </p>

                                        <div className="flex items-center space-x-3 text-xs text-slate-600 pt-1">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">{tour.duration}</span>
                                            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium capitalize">{tour.difficulty}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tour Card Footer */}
                                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-3xl">
                                    <div>
                                        <div className="text-[11px] font-medium text-slate-400">Starting from</div>
                                        <div className="text-base font-black text-amber-600">
                                            LKR {Number(tour.price_lkr).toLocaleString()}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => openBookingForTour(tour)}
                                        className="px-4 py-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                                    >
                                        Inquire Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── FLEET & PRIVATE VEHICLE TRANSFERS PREVIEW WITH ICONS ── */}
                <section className="py-16 bg-gradient-to-b from-slate-100 to-white border-y border-slate-200">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                            <div>
                                <span className="text-emerald-700 font-extrabold text-xs tracking-wider uppercase bg-emerald-100 px-3 py-1 rounded-full">
                                    Private Chauffeur Fleets
                                </span>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">
                                    Comfortable Islandwide Vehicles & Transfers
                                </h2>
                                <p className="text-sm text-slate-600 mt-1 max-w-xl">
                                    Air-conditioned modern fleet with licensed tourist chauffeurs, fuel, and comprehensive tourist insurance included.
                                </p>
                            </div>
                            <Link 
                                href="/vehicles" 
                                className="mt-4 md:mt-0 px-5 py-2.5 bg-white border border-slate-300 hover:border-emerald-600 text-slate-800 hover:text-emerald-700 font-bold text-sm rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
                            >
                                <span>Browse All Vehicles & Quote Calculator</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[
                                { name: 'AC Sedan Car', icon: Car, desc: '1-3 Passengers', rate: 'From Rs. 110/km', badge: 'Couples & Solos', image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80' },
                                { name: 'Luxury 4x4 SUV', icon: ShieldCheck, desc: '1-4 Passengers', rate: 'From Rs. 185/km', badge: 'Hill Country & VIP', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80' },
                                { name: 'Passenger Van', icon: Users, desc: '4-9 Passengers', rate: 'From Rs. 140/km', badge: 'Families & Groups', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80' },
                                { name: 'Safari 4x4 Jeep', icon: Compass, desc: '1-6 Passengers', rate: 'Fixed Safari Day Rates', badge: 'Yala & Udawalawe', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80' },
                                { name: 'Mini Coach Bus', icon: Bus, desc: '10-22 Passengers', rate: 'From Rs. 240/km', badge: 'Delegations', image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=900&q=80' },
                                { name: 'Tuk-Tuk Safari', icon: Zap, desc: '1-2 Passengers', rate: 'From Rs. 80/km', badge: 'Iconic Local Tour', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80' },
                            ].map((v, i) => {
                                const IconComponent = v.icon;
                                return (
                                    <Link
                                        key={i}
                                        href="/vehicles"
                                        className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all group flex flex-col justify-between overflow-hidden"
                                    >
                                        <div className="relative h-28 overflow-hidden border-b border-slate-100">
                                            <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
                                            <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/90 text-emerald-700 shadow-sm flex items-center justify-center">
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <div className="p-5 flex flex-col justify-between space-y-4 h-full">
                                            <div>
                                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md inline-block mb-2">
                                                    {v.badge}
                                                </span>
                                                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">{v.name}</h4>
                                                <p className="text-xs text-slate-500 mt-1">{v.desc}</p>
                                            </div>
                                            <div className="pt-2 border-t border-slate-100 text-xs font-bold text-slate-800">
                                                {v.rate}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ── GOOGLE MAPS ROUTE SECTION ── */}
                <section className="py-16 bg-slate-50 border-b border-slate-200">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                        <div className="max-w-2xl mx-auto text-center space-y-2">
                            <span className="text-amber-600 font-extrabold text-xs uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full">
                                Live Interactive GPS
                            </span>
                            <h2 className="text-3xl font-black text-slate-900">Explore Sri Lanka Major Tour Circuits</h2>
                            <p className="text-xs sm:text-sm text-slate-600">Interactive GPS waypoints mapped across Cultural Triangle, Hill Country, and Wildlife Safaris.</p>
                        </div>
                        <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-md">
                            <GoogleMap title="Xplor Lanka Major Tour Destinations Map" />
                        </div>
                    </div>
                </section>

                {/* ── CUSTOMER REVIEWS SECTION ── */}
                <section className="py-20 container mx-auto px-4 sm:px-6 lg:px-8">
                    <ReviewSection reviews={reviews} />
                </section>
            </main>

            {/* Quick Booking Modal */}
            {bookingModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
                        <div className="flex justify-between items-center border-b pb-4 border-slate-100">
                            <div>
                                <h3 className="font-extrabold text-xl text-slate-900">Inquire for Tour Package</h3>
                                <p className="text-xs text-amber-600 font-bold mt-0.5">{selectedTour ? selectedTour.title : 'Direct Tour Inquiry'}</p>
                            </div>
                            <button 
                                onClick={() => setBookingModalOpen(false)} 
                                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleBookingSubmit} className="space-y-4 text-sm">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    placeholder="e.g. Marcus Rost"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-slate-50/50"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={data.customer_email}
                                        onChange={(e) => setData('customer_email', e.target.value)}
                                        placeholder="marcus@example.com"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-slate-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">WhatsApp / Phone</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.customer_phone}
                                        onChange={(e) => setData('customer_phone', e.target.value)}
                                        placeholder="+49 170 1234567"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-slate-50/50"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Estimated Start Date</label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-slate-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Number of Guests</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={data.guests_count}
                                        onChange={(e) => setData('guests_count', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-slate-50/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Special Requests or Notes</label>
                                <textarea
                                    rows="2"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Hotel preferences, dietary needs, specific places you want to visit..."
                                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-slate-50/50"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 font-extrabold text-slate-950 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>Submit & Connect with Concierge</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
