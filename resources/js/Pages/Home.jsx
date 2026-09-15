import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import GoogleMap from '../Components/GoogleMap';
import ReviewSection from '../Components/ReviewSection';
import { 
    MapPin, Calendar, Users, Search, Compass, Star, ChevronRight, 
    MessageCircle, Phone, CheckCircle2, Shield, Heart, ArrowRight, X, Sparkles, Navigation
} from 'lucide-react';

export default function Home({ featuredTours = [], campingLocations = [], accommodations = [], vehicles = [], reviews = [] }) {
    const { flash } = usePage().props;
    const [selectedTour, setSelectedTour] = useState(null);
    const [bookingModalOpen, setBookingModalOpen] = useState(false);
    const [heroSlide, setHeroSlide] = useState(0);

    const { data, setData, post, processing, reset } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        guests_count: 2,
        start_date: '',
        tour_id: '',
        notes: '',
    });

    const heroImages = [
        { url: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1920&auto=format&fit=crop', title: 'Discover ancient wonders & Sigiriya Fortress', tag: '🌟 Sri Lanka’s #1 Tour Experience' },
        { url: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1920&auto=format&fit=crop', title: 'Scenic Ceylon Blue Train & Ella Nine Arch', tag: '🚂 Hill Country & Tea Trails' },
        { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop', title: 'Wild Leopard Safaris in Yala National Park', tag: '🐆 Wildlife & Nature Safaris' },
        { url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=1920&auto=format&fit=crop', title: 'Wilderness Camping in Knuckles Mountains', tag: '🏕️ Wilderness & Mountain Camping' }
    ];

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

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans">
            <Head title="Xplor Lanka - Your Ultimate Sri Lankan Travel Experience" />
            <Navbar currentPath="/" />

            {/* Flash Banner */}
            {flash?.success && (
                <div className="bg-emerald-600 text-white px-4 py-3 text-center text-sm font-semibold flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={heroImages[heroSlide].url} 
                            alt="Sri Lanka Tour" 
                            className="w-full h-full object-cover transition-all duration-1000 brightness-75 scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
                    </div>

                    <div className="container relative z-10 mx-auto px-4 py-20">
                        <div className="max-w-3xl space-y-6">
                            <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold backdrop-blur-md">
                                <Sparkles className="w-4 h-4" />
                                <span>{heroImages[heroSlide].tag}</span>
                            </span>

                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                                Discover the <br />
                                <span className="text-amber-400">Pearl of the Indian Ocean</span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-light">
                                Personalized private tours, authentic wilderness camping, comfortable vehicle rentals, and boutique eco stays across Sri Lanka.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link
                                    href="/tours"
                                    className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:ring-amber-500/50 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center space-x-2"
                                >
                                    <span>Explore All Tours</span>
                                    <ChevronRight className="w-5 h-5" />
                                </Link>

                                <a
                                    href="https://wa.me/94763762763"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/50 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center space-x-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span>Chat on WhatsApp</span>
                                </a>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-white/10 text-white">
                                <div>
                                    <div className="text-2xl font-black text-amber-400">1,000+</div>
                                    <div className="text-xs text-slate-300">Happy Travelers</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-amber-400">50+</div>
                                    <div className="text-xs text-slate-300">Tour Packages</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-amber-400">5+ Years</div>
                                    <div className="text-xs text-slate-300">Local Expertise</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-amber-400">4.9 ★</div>
                                    <div className="text-xs text-slate-300">Guest Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-6 right-6 z-20 flex space-x-2">
                        {heroImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setHeroSlide(idx)}
                                aria-label={`Slide ${idx + 1}`}
                                className={`w-3 h-3 rounded-full transition-all ${heroSlide === idx ? 'bg-amber-400 w-8' : 'bg-white/40'}`}
                            />
                        ))}
                    </div>
                </section>

                {/* Featured Clickable Tour Cards */}
                <section className="py-20 container mx-auto px-4 space-y-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                        <div>
                            <span className="text-amber-500 font-bold text-sm tracking-wider uppercase">Unforgettable Journeys</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                                Featured Tour Packages
                            </h2>
                        </div>
                        <Link href="/tours" className="mt-4 md:mt-0 text-amber-500 hover:text-amber-600 font-semibold flex items-center space-x-1">
                            <span>View All Tours</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredTours.map((tour) => (
                            <div 
                                key={tour.id} 
                                onClick={() => openBookingForTour(tour)}
                                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-amber-500 transition-all cursor-pointer flex flex-col justify-between group focus-within:ring-2 focus-within:ring-amber-500"
                            >
                                <div>
                                    <div className="relative h-48 overflow-hidden">
                                        <img 
                                            src={tour.image || 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=800&auto=format&fit=crop'} 
                                            alt={tour.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                        />
                                        <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-md capitalize">
                                            {tour.category}
                                        </span>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                                            <Star className="w-4 h-4 fill-amber-500" />
                                            <span>{tour.rating}</span>
                                            <span className="text-slate-400">({tour.reviews_count} reviews)</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-1">{tour.title}</h3>
                                        <p className="text-xs text-slate-500 flex items-center space-x-1">
                                            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                            <span className="truncate">{tour.route}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
                                    <div>
                                        <div className="text-xs text-slate-400">Starting from</div>
                                        <div className="text-base font-black text-amber-500">LKR {Number(tour.price_lkr).toLocaleString()}</div>
                                    </div>
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-slate-900 group-hover:bg-amber-500 group-hover:text-slate-950 text-white font-semibold text-xs rounded-lg transition-all"
                                    >
                                        Inquire Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Google Maps Route Section */}
                <section className="py-12 bg-slate-100 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4 space-y-6">
                        <div className="max-w-2xl mx-auto text-center space-y-2">
                            <span className="text-amber-500 font-bold text-xs uppercase tracking-wider">Live Route & Navigation</span>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Explore Sri Lanka Major Tour Circuits</h2>
                            <p className="text-xs text-slate-500">Interactive GPS waypoints mapped across Cultural Triangle, Hill Country, and Wildlife Safaris.</p>
                        </div>
                        <GoogleMap title="Xplor Lanka Major Tour Destinations Map" />
                    </div>
                </section>

                {/* Customer Reviews Section */}
                <section className="py-20 container mx-auto px-4">
                    <ReviewSection reviews={reviews} />
                </section>
            </main>

            {/* Quick Booking Modal */}
            {bookingModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Inquire for Tour</h3>
                                <p className="text-xs text-slate-500">{selectedTour ? selectedTour.title : 'Direct Inquiry'}</p>
                            </div>
                            <button onClick={() => setBookingModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleBookingSubmit} className="space-y-4 text-sm">
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={data.customer_email}
                                        onChange={(e) => setData('customer_email', e.target.value)}
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
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 rounded-lg shadow-md transition-all flex items-center justify-center space-x-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>Submit & Open WhatsApp</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
