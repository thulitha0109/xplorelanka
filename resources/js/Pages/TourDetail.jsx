import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import GoogleMap from '../Components/GoogleMap';
import ReviewSection from '../Components/ReviewSection';
import { MapPin, Star, Calendar, Clock, CheckCircle2, MessageCircle, ArrowLeft, Image as ImageIcon, Users, Zap, Tag } from 'lucide-react';

export default function TourDetail({ tour, relatedTours = [], reviews = [] }) {
    const { flash } = usePage().props;
    const [galleryOpen, setGalleryOpen] = useState(false);
    
    const { data, setData, post, processing, reset } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        guests_count: 2,
        start_date: '',
        tour_id: tour.id,
        notes: '',
    });

    const handleBooking = (e) => {
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

    // Parse waypoints from JSON if it's a string, or use as is
    const mapWaypoints = Array.isArray(tour.waypoints) ? tour.waypoints : (typeof tour.waypoints === 'string' ? JSON.parse(tour.waypoints) : []);
    
    // Default waypoints if none provided
    const displayWaypoints = mapWaypoints.length > 0 ? mapWaypoints : [
        { name: tour.title + ' Start', lat: tour.map_center_lat || 7.8731, lng: tour.map_center_lng || 80.7718 }
    ];

    const avgRating = reviews.length > 0 
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : tour.rating;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans">
            <Head>
                <title>{`${tour.seo_title || tour.title} - Xplor Lanka`}</title>
                <meta name="description" content={tour.seo_description || tour.description?.substring(0, 160)} />
            </Head>
            
            <Navbar currentPath="/tours" />

            {flash?.success && (
                <div className="bg-emerald-600 text-white px-4 py-3 text-center text-sm font-semibold flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}

            <main className="flex-grow py-12 container mx-auto px-4 space-y-12">
                <Link href="/tours" className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-amber-500 font-semibold transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to All Tours</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content (Left, 2 cols) */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Header Info */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Link href={`/tours?category=${tour.category}`} className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-md text-xs font-bold uppercase tracking-wider hover:bg-amber-500 hover:text-slate-950 transition-colors">
                                    {tour.category}
                                </Link>
                                {tour.difficulty && (
                                    <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                                        tour.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' :
                                        tour.difficulty === 'moderate' ? 'bg-amber-100 text-amber-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {tour.difficulty}
                                    </span>
                                )}
                            </div>
                            
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                                {tour.title}
                            </h1>
                            
                            {/* Meta Tags */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800 pb-4">
                                <a href="#reviews" className="flex items-center space-x-1 text-amber-500 hover:text-amber-400 transition-colors">
                                    <Star className="w-4 h-4 fill-amber-500" />
                                    <span>{avgRating}</span>
                                    <span className="text-slate-400 underline decoration-slate-400/30 underline-offset-2">({reviews.length} reviews)</span>
                                </a>
                                <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    <span>{tour.duration}</span>
                                </div>
                                <a href="#route-map" className="flex items-center space-x-1 hover:text-amber-500 transition-colors">
                                    <MapPin className="w-4 h-4 text-amber-500" />
                                    <span className="underline decoration-slate-400/30 underline-offset-2">{tour.route}</span>
                                </a>
                                {tour.max_group_size && (
                                    <div className="flex items-center space-x-1">
                                        <Users className="w-4 h-4 text-amber-500" />
                                        <span>Max {tour.max_group_size} people</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Main Image / Gallery */}
                        <div className="space-y-4">
                            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 group">
                                <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                {tour.gallery && tour.gallery.length > 0 && (
                                    <button 
                                        onClick={() => setGalleryOpen(true)}
                                        className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                        <span>View {tour.gallery.length + 1} Photos</span>
                                    </button>
                                )}
                            </div>
                            
                            {/* Tags */}
                            {tour.tags && tour.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tour.tags.map((tag, i) => (
                                        <Link key={i} href={`/tours?category=${tag}`} className="inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-100 hover:text-amber-700 transition-colors">
                                            <Tag className="w-3 h-3" />
                                            <span>{tag}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Overview */}
                        <div className="space-y-3 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                                <Zap className="w-6 h-6 text-amber-500" />
                                <span>Tour Overview</span>
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-loose">
                                {tour.description}
                            </p>
                        </div>

                        {/* Highlights */}
                        {tour.highlights && tour.highlights.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Key Highlights</h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    {tour.highlights.map((h, i) => (
                                        <li key={i} className="flex items-start space-x-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                            <span className="font-medium text-slate-700 dark:text-slate-300">{h}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Itinerary */}
                        {tour.itinerary && tour.itinerary.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Day-by-Day Itinerary</h3>
                                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-6 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
                                    {tour.itinerary.map((day, idx) => (
                                        <div key={idx} className="relative flex items-start space-x-4">
                                            <div className="relative z-10 w-10 h-10 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center font-black shadow-md border-4 border-slate-50 dark:border-slate-950 shrink-0">
                                                {day.day}
                                            </div>
                                            <div className="flex-1 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{day.title}</h4>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{day.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Video */}
                        {tour.video_url && (
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Experience it</h3>
                                <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
                                    <iframe 
                                        src={tour.video_url.replace('watch?v=', 'embed/')} 
                                        className="w-full h-full"
                                        allowFullScreen 
                                        title={`${tour.title} Video`}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Route Map */}
                        <div id="route-map" className="space-y-4 scroll-mt-24">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Route Map</h3>
                            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
                                <GoogleMap locations={displayWaypoints} title={`${tour.title} Route`} />
                            </div>
                        </div>

                        {/* Review Section */}
                        <ReviewSection reviews={reviews} tourId={tour.id} avgRating={avgRating} />
                    </div>

                    {/* Booking Sidebar (Right) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl sticky top-24 space-y-8">
                            
                            {/* Price */}
                            <div>
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Total Price from</div>
                                <div className="text-4xl font-black text-amber-500 tracking-tight">LKR {Number(tour.price_lkr).toLocaleString()}</div>
                                {tour.price_usd && (
                                    <div className="text-sm font-semibold text-slate-400 mt-1">Approx. USD ${tour.price_usd}</div>
                                )}
                            </div>

                            {/* Booking Form */}
                            <form onSubmit={handleBooking} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={data.customer_email}
                                        onChange={(e) => setData('customer_email', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">WhatsApp / Phone</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.customer_phone}
                                        onChange={(e) => setData('customer_phone', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Start Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Guests</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={tour.max_group_size || 50}
                                            required
                                            value={data.guests_count}
                                            onChange={(e) => setData('guests_count', parseInt(e.target.value))}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 font-black text-slate-950 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all flex items-center justify-center space-x-2 mt-4"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span>Inquire via WhatsApp</span>
                                </button>
                                <p className="text-center text-xs text-slate-500">No payment required now. We'll finalize details via chat.</p>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Related Tours */}
                {relatedTours.length > 0 && (
                    <div className="pt-12 border-t border-slate-200 dark:border-slate-800">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Similar Experiences</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Simple render of related tours for now, ideally reuse TourCard component */}
                            {relatedTours.map(related => (
                                <Link key={related.id} href={`/tours/${related.id}`} className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all block">
                                    <div className="h-48 overflow-hidden">
                                        <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors mb-2">{related.title}</h3>
                                        <div className="flex justify-between items-center text-xs text-slate-500">
                                            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1"/> {related.duration}</span>
                                            <span className="font-bold text-amber-500">LKR {Number(related.price_lkr).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Simple Gallery Lightbox */}
            {galleryOpen && tour.gallery && (
                <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 sm:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white font-bold text-lg">{tour.title} Gallery</h3>
                        <button onClick={() => setGalleryOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-full bg-slate-800/50 hover:bg-slate-800 transition-all">
                            Close (Esc)
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl mx-auto">
                            <div className="aspect-[4/3] rounded-xl overflow-hidden">
                                <img src={tour.image} className="w-full h-full object-cover" alt="Main" />
                            </div>
                            {tour.gallery.map((img, idx) => (
                                <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden">
                                    <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx+1}`} loading="lazy" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
