import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import SeoHead from '../Components/SeoHead';
import { formatProductPrice } from '../lib/currency';
import GoogleMap from '../Components/GoogleMap';
import ReviewSection from '../Components/ReviewSection';
import ElfsightReviews from '../Components/ElfsightReviews';
import { 
    MapPin, Calendar, Users, Search, Compass, Star, ChevronRight, ChevronLeft,
    MessageCircle, Phone, CheckCircle2, Shield, Heart, ArrowRight, X, Sparkles, Navigation,
    Car, Bus, ShieldCheck, Zap, Bed, BookOpen, Quote, Award, Camera
} from 'lucide-react';

export default function Home({ featuredTours = [], accommodations = [], vehicles = [], reviews = [], blogPosts = [] }) {
    const { flash, currency } = usePage().props;
    const [cardSelectedPhotoIndex, setCardSelectedPhotoIndex] = useState({});
    
    // Top 3 featured Google reviews with several optimized photos for the interactive Hero Card Deck
    const defaultHeroReviews = [
        {
            id: 101,
            customer_name: 'Charlene Coudreau',
            customer_country: 'France',
            badge: 'Local Guide · 14 photos',
            avatar_img: '/images/reviews/avatar-charlene.webp',
            photos: [
                '/images/reviews/charlene-1.webp',
                '/images/reviews/charlene-2.webp',
                '/images/reviews/charlene-3.webp',
                '/images/reviews/charlene-4.webp',
            ],
            title: 'Adjustable & Flexible Private Itinerary with Vije',
            rating: 5,
            comment: 'We had an amazing time traveling with Vije. Thank you so much for organizing everything! What we really appreciated is that we could adjust the program according to what we wanted to do, so we were sure to have exactly the trip we had in mind.',
            tour_name: 'Sigiriya to Hiriketiya Custom Route',
            avatar_color: 'bg-amber-500'
        },
        {
            id: 102,
            customer_name: 'Anja Riegel',
            customer_country: 'Germany',
            badge: 'Verified Google Review',
            avatar_img: '/images/reviews/avatar-anja.webp',
            photos: [
                '/images/reviews/anja-1.webp',
                '/images/reviews/anja-2.webp',
                '/images/reviews/anja-3.webp',
                '/images/reviews/anja-4.webp',
            ],
            title: '2 Weeks Driving with Nelka Across Sri Lanka',
            rating: 5,
            comment: 'We spent 2 weeks in February driving with Nelka from Xplore Lanka Tours in Sri Lanka. We had such a great time! Nelka planned the trip together with us and he was always helpful and we could rely on him. Highly recommended!',
            tour_name: '14-Day Grand Island Exploration',
            avatar_color: 'bg-emerald-600'
        },
        {
            id: 103,
            customer_name: 'Sergey Antonov',
            customer_country: 'International Traveler',
            badge: 'Local Guide · 4 photos',
            avatar_img: '/images/reviews/avatar-sergey.webp',
            photos: [
                '/images/reviews/sergey-1.webp',
                '/images/reviews/sergey-2.webp',
                '/images/reviews/sergey-3.webp',
                '/images/reviews/sergey-4.webp',
            ],
            title: 'Waterfalls, Tea Plantations & Spice Gardens',
            rating: 5,
            comment: "We were spending with Nelka few days and all of them were full of amazing experiences and beautiful places! Nelka is so polite and helpful. Thanks to him we've visited waterfalls, tea plantations, herbal and spice gardens, and a meditation center.",
            tour_name: 'Hill Country & Nature Exploration',
            avatar_color: 'bg-blue-600'
        }
    ];

    const heroReviews = defaultHeroReviews;

    const [activeReviewIndex, setActiveReviewIndex] = useState(0);
    const [previewPhoto, setPreviewPhoto] = useState(null);
    const [swipeStartX, setSwipeStartX] = useState(null);
    const [swipeCurrentX, setSwipeCurrentX] = useState(null);
    const [isSwiping, setIsSwiping] = useState(false);

    // Swipe handlers for both touch and mouse drag
    const onSwipeStart = (clientX) => {
        setSwipeStartX(clientX);
        setSwipeCurrentX(clientX);
        setIsSwiping(true);
    };

    const onSwipeMove = (clientX) => {
        if (!isSwiping || swipeStartX === null) return;
        setSwipeCurrentX(clientX);
    };

    const onSwipeEnd = () => {
        if (!isSwiping || swipeStartX === null || swipeCurrentX === null) {
            setIsSwiping(false);
            setSwipeStartX(null);
            setSwipeCurrentX(null);
            return;
        }
        const diff = swipeCurrentX - swipeStartX;
        const threshold = 40;
        if (diff < -threshold) {
            // Swiped left -> Next review
            setActiveReviewIndex((prev) => (prev + 1) % heroReviews.length);
        } else if (diff > threshold) {
            // Swiped right -> Previous review
            setActiveReviewIndex((prev) => (prev - 1 + heroReviews.length) % heroReviews.length);
        }
        setIsSwiping(false);
        setSwipeStartX(null);
        setSwipeCurrentX(null);
    };

    // Auto cycle hero reviews deck every 7s unless interacted
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveReviewIndex((prev) => (prev + 1) % heroReviews.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [heroReviews.length]);

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
            <SeoHead
                title="Sri Lanka Tours, Private Driver & Chauffeur Guides | Xplore Lanka"
                description="Explore Sri Lanka with Xplore Lanka Tours (5.0★ on Google). Tailor-made private itineraries, licensed English-speaking chauffeur drivers, safe transfers, tea trail cycling, and authentic eco stays from Kandy."
                keywords="Sri Lanka tours, Sri Lanka tour packages, private driver Sri Lanka, chauffeur guide Sri Lanka, Kandy tour operator, airport transfers Sri Lanka, Colombo to Sigiriya transfer, safe driving Sri Lanka tours, Sri Lanka itinerary planner"
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'TravelAgency',
                    '@id': 'https://xplorelanka.com/#organization',
                    name: 'Xplore Lanka Tours',
                    alternateName: 'Xplore Lanka',
                    url: 'https://xplorelanka.com',
                    image: 'https://xplorelanka.com/images/legacy/tour-1.jpg',
                    description: 'Top-rated Kandy tour operator offering custom Sri Lanka private tours, licensed English-speaking chauffeur drivers, airport transfers, tea country cycling and eco retreats.',
                    telephone: '+94763762763',
                    priceRange: '$$',
                    hasMap: 'https://www.google.com/maps/place/xplorelanka+tours/@7.2637111,80.6067725,17z/data=!3m1!4b1!4m6!3m5!1s0x3ae36975dd48dfe3:0x68b69b1b39ba02b3!8m2!3d7.2637058!4d80.6116434!16s%2Fg%2F11yg0j0l_n',
                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: '5.0',
                        reviewCount: 39,
                        bestRating: '5',
                        worstRating: '1'
                    },
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: '99 Augustawatta',
                        addressLocality: 'Kandy',
                        addressRegion: 'Central Province',
                        postalCode: '20000',
                        addressCountry: 'LK'
                    },
                    geo: {
                        '@type': 'GeoCoordinates',
                        latitude: 7.2637058,
                        longitude: 80.6116434
                    }
                }}
            />
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
                                    <span>Locally owned in Kandy since 2016</span>
                                </div>

                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
                                    Discover Sri Lanka in <br className="hidden sm:inline" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700">
                                        Tailored Luxury & Comfort
                                    </span>
                                </h1>

                                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                                    Custom Sri Lankan itineraries, knowledgeable English-speaking local guides, private transfers, cycling routes and camping experiences.
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
                                        <div className="text-2xl font-black text-amber-600">2,500+</div>
                                        <div className="text-xs font-semibold text-slate-500">Happy Travelers</div>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200/60 shadow-xs text-center lg:text-left">
                                        <div className="text-2xl font-black text-amber-600">5.0 ★</div>
                                        <div className="text-xs font-semibold text-slate-500">39 Google reviews</div>
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

                                    {/* The Stacked 3D Card Deck Container with Touch & Drag Swipe */}
                                    <div 
                                        className="relative h-[490px] sm:h-[460px] w-full select-none flex items-center justify-center my-2 touch-pan-y cursor-grab active:cursor-grabbing"
                                        onTouchStart={(e) => e.touches && e.touches[0] && onSwipeStart(e.touches[0].clientX)}
                                        onTouchMove={(e) => e.touches && e.touches[0] && onSwipeMove(e.touches[0].clientX)}
                                        onTouchEnd={onSwipeEnd}
                                        onMouseDown={(e) => onSwipeStart(e.clientX)}
                                        onMouseMove={(e) => onSwipeMove(e.clientX)}
                                        onMouseUp={onSwipeEnd}
                                        onMouseLeave={onSwipeEnd}
                                    >
                                        {heroReviews.map((rev, idx) => {
                                            const offset = (idx - activeReviewIndex + heroReviews.length) % heroReviews.length;
                                            
                                            let cardTransform = '';
                                            let zIndex = 10;
                                            let opacity = 'opacity-70 hover:opacity-100';
                                            let cursor = 'cursor-pointer';

                                            if (offset === 0) {
                                                cardTransform = 'translate-x-0 translate-y-0 rotate-0 scale-100 shadow-2xl ring-2 ring-amber-400/50 bg-white';
                                                zIndex = 30;
                                                opacity = 'opacity-100';
                                                cursor = 'cursor-default';
                                            } else if (offset === 1) {
                                                cardTransform = 'translate-x-6 sm:translate-x-10 translate-y-3 rotate-6 hover:rotate-3 scale-[0.93] shadow-xl bg-white/95';
                                                zIndex = 20;
                                            } else {
                                                cardTransform = '-translate-x-6 sm:-translate-x-10 translate-y-3 -rotate-6 hover:-rotate-3 scale-[0.93] shadow-xl bg-white/95';
                                                zIndex = 10;
                                            }

                                            return (
                                                <div
                                                    key={rev.id || idx}
                                                    onClick={() => offset !== 0 && setActiveReviewIndex(idx)}
                                                    className={`absolute inset-x-2 sm:inset-x-4 top-0 bottom-0 rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-lg transition-all duration-500 ease-out flex flex-col justify-between ${cardTransform} ${opacity} ${cursor}`}
                                                    style={{ zIndex }}
                                                >
                                                    {/* Card Body: Header & Full Space for Review Text */}
                                                    <div className="flex-1 flex flex-col">
                                                        {/* Top Row: Reviewer Avatar, Country Flag, Rating */}
                                                        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-xs shrink-0 bg-slate-100">
                                                                    {rev.avatar_img ? (
                                                                        <img src={rev.avatar_img} alt={rev.customer_name} className="w-full h-full object-cover" loading="lazy" />
                                                                    ) : (
                                                                        <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black text-sm flex items-center justify-center">
                                                                            {rev.customer_name ? rev.customer_name.charAt(0).toUpperCase() : 'G'}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">{rev.customer_name}</div>
                                                                    <div className="flex items-center gap-2 text-lg" title={rev.customer_country} aria-label={`Reviewer country: ${rev.customer_country}`}>
                                                                        <span>{countryFlag(rev.customer_country)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl shrink-0">
                                                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                                                <span className="text-xs font-black text-amber-900">5.0</span>
                                                            </div>
                                                        </div>

                                                        {/* Full Space for Review Story */}
                                                        <div className="flex-1 flex flex-col justify-center py-3 sm:py-4">
                                                            <Quote className="w-7 h-7 text-amber-400/50 mb-1.5 shrink-0" />
                                                            {rev.title && (
                                                                <h4 className="font-black text-slate-900 text-sm sm:text-base mb-2 leading-snug">
                                                                    "{rev.title}"
                                                                </h4>
                                                            )}
                                                            <p className="text-xs sm:text-sm md:text-[15px] text-slate-700 leading-relaxed font-normal">
                                                                {rev.comment}
                                                            </p>
                                                        </div>

                                                        {/* Compact Journey Photo Preview Strip */}
                                                        {rev.photos && rev.photos.length > 0 && (
                                                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                                                                <span className="text-[11px] font-bold text-slate-500 flex items-center space-x-1 shrink-0">
                                                                    <Camera className="w-3.5 h-3.5 text-amber-500" />
                                                                    <span className="hidden sm:inline">Guest Photos:</span>
                                                                </span>
                                                                <div className="flex items-center space-x-2">
                                                                    {rev.photos.map((pUrl, pIdx) => (
                                                                        <button
                                                                            key={pIdx}
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setPreviewPhoto({
                                                                                    url: pUrl,
                                                                                    name: rev.customer_name,
                                                                                    tour: rev.tour_name
                                                                                });
                                                                            }}
                                                                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border-2 border-slate-200 hover:border-amber-500 hover:scale-105 transition-all shadow-xs cursor-pointer group shrink-0 relative"
                                                                            aria-label={`View photo ${pIdx + 1} by ${rev.customer_name}`}
                                                                        >
                                                                            <img src={pUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                                                                            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Card Deck Bottom Footer */}
                                                    <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                                        <span className="inline-flex items-center" aria-label="Google review">
                                                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48" role="img" aria-label="Google">
                                                                <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-2 4.6-4.2 6v5h6.8c4-3.7 6-9 6-14.7z" />
                                                                <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.8-5c-1.8 1.2-4 1.9-6.7 1.9-5.2 0-9.6-3.5-11.2-8.2H5.8v5.2C9.2 39.6 16 44 24 44z" />
                                                                <path fill="#FBBC05" d="M12.8 27.8a12 12 0 0 1 0-7.6V15H5.8a20 20 0 0 0 0 18z" />
                                                                <path fill="#EA4335" d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.9 29.5 4 24 4 16 4 9.2 8.4 5.8 15l7 5.2c1.6-4.7 6-8.1 11.2-8.1z" />
                                                            </svg>
                                                        </span>
                                                        <span className="inline-flex items-center text-emerald-700" title="Verified review" aria-label="Verified review">
                                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Lightbox Modal for Full Travel Photo Preview */}
                                    {previewPhoto && (
                                        <div 
                                            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
                                            onClick={() => setPreviewPhoto(null)}
                                        >
                                            <div 
                                                className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="relative aspect-4/3 w-full bg-slate-900">
                                                    <img 
                                                        src={previewPhoto.url} 
                                                        alt="Travel Photo" 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                    <button
                                                        onClick={() => setPreviewPhoto(null)}
                                                        className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white transition-colors"
                                                        aria-label="Close photo preview"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="p-4 bg-white flex items-center justify-between">
                                                    <div>
                                                        <div className="font-extrabold text-slate-900 text-sm">{previewPhoto.name}</div>
                                                        <div className="text-xs text-slate-500">{previewPhoto.tour}</div>
                                                    </div>
                                                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                                                        Authentic Google Review Photo
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Deck Interactive Step Navigator & Dots */}
                                    <div className="flex flex-col items-center space-y-2 mt-4">
                                        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-xs p-1.5 rounded-full border border-slate-200 shadow-xs">
                                            {heroReviews.map((rev, dotIdx) => (
                                                <button
                                                    key={dotIdx}
                                                    onClick={() => setActiveReviewIndex(dotIdx)}
                                                    className={`w-7 h-7 rounded-full text-xs font-bold transition-all duration-300 flex items-center justify-center ${
                                                        activeReviewIndex === dotIdx 
                                                            ? 'bg-amber-500 text-slate-950 shadow-xs scale-105' 
                                                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                                    }`}
                                                    aria-label={`Go to review ${dotIdx + 1}`}
                                                >
                                                    <span className={`rounded-full bg-current transition-all ${activeReviewIndex === dotIdx ? 'w-2 h-2' : 'w-1.5 h-1.5'}`} />
                                                </button>
                                            ))}
                                        </div>
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
                                            src={tour.image || '/images/legacy/tour-1.jpg'}
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
                                            <span className="text-slate-400 font-normal">({tour.reviews_count ?? 0} reviews)</span>
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
                                            {formatProductPrice(tour, currency?.code || 'USD', 'package')}
                                        </div>
                                    </div>
                                    <Link
                                        href={`/tours/${tour.id}`}
                                        className="px-4 py-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                                    >
                                        Book Now
                                    </Link>
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
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                            <div className="lg:col-span-5 min-w-0 h-full">
                                <GoogleMap title="Xplor Lanka Major Tour Destinations Map" />
                            </div>
                            <aside className="lg:col-span-7 flex flex-col h-full rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-md">
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <div>
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">Travel Journal</span>
                                        <h3 className="text-lg font-black text-slate-900">Latest from the blog</h3>
                                    </div>
                                    <Link href="/blog" className="shrink-0 text-xs font-bold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1">
                                        All articles <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                                <div className="flex flex-col lg:flex-1 lg:justify-between divide-y divide-slate-100">
                                    {blogPosts.slice(0, 4).map((post) => (
                                        <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-3 py-3 first:pt-0 last:pb-0 lg:flex-1 lg:items-center">
                                            <img
                                                src={post.image || '/images/legacy/blog-default.jpg'}
                                                alt=""
                                                className="w-20 h-20 sm:w-[5.5rem] sm:h-[5.5rem] rounded-xl object-cover shrink-0 bg-slate-100"
                                                loading="lazy"
                                            />
                                            <span className="min-w-0 flex flex-col justify-center">
                                                <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700 truncate">{post.category || 'Travel guide'}</span>
                                                <span className="mt-1 text-sm font-extrabold leading-snug text-slate-900 line-clamp-2 group-hover:text-amber-700 transition-colors">{post.title}</span>
                                                <span className="mt-1 text-[11px] text-slate-500 line-clamp-2">{post.excerpt}</span>
                                            </span>
                                        </Link>
                                    ))}
                                    {blogPosts.length === 0 && (
                                        <p className="py-4 text-sm text-slate-500">Travel stories are coming soon.</p>
                                    )}
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>

                {/* ── TESTIMONIALS / ELFSIGHT ALL-IN-ONE REVIEWS SECTION ── */}
                <section className="py-20 container mx-auto px-4 sm:px-6 lg:px-8" id="testimonials">
                    <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
                        <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider">
                            <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                            <span>5.0 Star Guest Experiences</span>
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900">What Our Travelers Say</h2>
                        <p className="text-slate-600 text-sm max-w-xl mx-auto">
                            Verified guest reviews and real journey stories from international travelers touring Sri Lanka with Xplore Lanka.
                        </p>
                    </div>
                    <ElfsightReviews />
                </section>
            </main>

            <Footer />
        </div>
    );
}
