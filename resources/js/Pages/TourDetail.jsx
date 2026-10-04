import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { formatProductPrice } from '../lib/currency';
import SeoHead from '../Components/SeoHead';
import GoogleMap from '../Components/GoogleMap';
import ReviewSection from '../Components/ReviewSection';
import { MapPin, Star, Calendar, Clock, CheckCircle2, MessageCircle, ArrowLeft, Image as ImageIcon, Users, Zap, Tag, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';

export default function TourDetail({ tour, relatedTours = [], reviews = [] }) {
    const { flash, currency, site } = usePage().props;
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

    const mapWaypoints = Array.isArray(tour.waypoints) ? tour.waypoints : (typeof tour.waypoints === 'string' ? JSON.parse(tour.waypoints) : []);
    const displayWaypoints = mapWaypoints.length > 0 ? mapWaypoints : [
        { name: tour.title + ' Start', lat: tour.map_center_lat || 7.8731, lng: tour.map_center_lng || 80.7718 }
    ];

    const avgRating = reviews.length > 0 
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : (tour.rating || 4.9);
    const pageCurrency = currency?.code || 'USD';
    const tripPrice = tour.prices?.package?.[pageCurrency];
    const absoluteImage = tour.image?.startsWith('http') ? tour.image : `${site?.url || 'https://xplorelanka.com'}${tour.image || ''}`;
    const tripSchema = {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: tour.title,
        description: tour.description,
        image: absoluteImage,
        touristType: tour.tags || undefined,
        provider: { '@id': `${site?.url || 'https://xplorelanka.com'}/#organization` },
        itinerary: Array.isArray(tour.itinerary) && tour.itinerary.length > 0 ? {
            '@type': 'ItemList',
            itemListElement: tour.itinerary.map((day, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: day.title,
                description: day.desc,
            })),
        } : undefined,
        offers: tripPrice ? {
            '@type': 'Offer',
            price: tripPrice.amount,
            priceCurrency: pageCurrency,
            availability: 'https://schema.org/InStock',
            url: typeof window !== 'undefined' ? window.location.href : `${site?.url || 'https://xplorelanka.com'}/tours/${tour.id}`,
        } : undefined,
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
            <SeoHead title={`${tour.seo_title || tour.title} | Xplore Lanka`} description={tour.seo_description || tour.description?.substring(0, 160)} image={tour.image} type="product" schema={tripSchema} />
            
            <Navbar currentPath="/tours" />

            {flash?.success && (
                <div className="bg-emerald-600 text-white px-4 py-3 text-center text-sm font-semibold flex items-center justify-center space-x-2 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}

            <main className="flex-grow py-10 container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <Link href="/tours" className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-amber-600 font-bold transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to All Tours</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Content (Left, 8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Header Info */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {tour.category}
                                </span>
                                {tour.difficulty && (
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        tour.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-800' :
                                        tour.difficulty === 'moderate' ? 'bg-amber-100 text-amber-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {tour.difficulty}
                                    </span>
                                )}
                            </div>
                            
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                                {tour.title}
                            </h1>
                            
                            {/* Meta Tags */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-semibold border-b border-slate-200 pb-4">
                                <a href="#reviews" className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 transition-colors">
                                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                                    <span className="font-bold text-slate-900">{avgRating}</span>
                                    <span className="text-slate-400 font-normal">({reviews.length} reviews)</span>
                                </a>
                                <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    <span>{tour.duration}</span>
                                </div>
                                <a href="#route-map" className="flex items-center space-x-1 hover:text-amber-600 transition-colors">
                                    <MapPin className="w-4 h-4 text-amber-500" />
                                    <span>{tour.route}</span>
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
                            <div className="relative h-96 md:h-[480px] rounded-3xl overflow-hidden shadow-md border border-slate-200 group bg-slate-100">
                                <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                {tour.gallery && tour.gallery.length > 0 && (
                                    <button 
                                        onClick={() => setGalleryOpen(true)}
                                        className="absolute bottom-4 right-4 bg-slate-900/85 backdrop-blur-xs text-white px-4 py-2 rounded-2xl text-xs font-bold flex items-center space-x-2 hover:bg-amber-500 hover:text-slate-950 transition-colors shadow-lg"
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                        <span>View {tour.gallery.length + 1} Photos</span>
                                    </button>
                                )}
                            </div>
                            
                            {tour.tags && tour.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tour.tags.map((tag, i) => (
                                        <span key={i} className="inline-flex items-center space-x-1 text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                                            <Tag className="w-3 h-3 text-amber-600" />
                                            <span>{tag}</span>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Overview */}
                        <div className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 flex items-center space-x-2">
                                <Zap className="w-5 h-5 text-amber-500" />
                                <span>Tour Overview</span>
                            </h3>
                            <p className="text-slate-600 text-sm leading-loose">
                                {tour.description}
                            </p>
                        </div>

                        {/* Highlights */}
                        {tour.highlights && tour.highlights.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-slate-900">Key Highlights</h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    {tour.highlights.map((h, i) => (
                                        <li key={i} className="flex items-start space-x-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                            <span className="font-semibold text-slate-800">{h}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Itinerary */}
                        {tour.itinerary && tour.itinerary.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-slate-900">Day-by-Day Itinerary</h3>
                                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-6 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-amber-200 before:to-transparent">
                                    {tour.itinerary.map((day, idx) => (
                                        <div key={idx} className="relative flex items-start space-x-4">
                                            <div className="relative z-10 w-10 h-10 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center font-black text-xs shadow-md border-4 border-white shrink-0">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                                                <div className="text-xs font-bold text-amber-600 uppercase mb-1">{day.day}</div>
                                                <h4 className="font-bold text-base text-slate-900 mb-1">{day.title}</h4>
                                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{day.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Route Map */}
                        <div id="route-map" className="space-y-4 scroll-mt-24">
                            <h3 className="text-xl font-black text-slate-900">GPS Route Navigation</h3>
                            <div className="rounded-3xl overflow-hidden shadow-md border border-slate-200 p-2 bg-white">
                                <GoogleMap locations={displayWaypoints} title={`${tour.title} Route`} />
                            </div>
                        </div>

                        {/* Review Section */}
                        <ReviewSection reviews={reviews} tourId={tour.id} avgRating={avgRating} />
                    </div>

                    {/* Booking Sidebar (Right, 4 cols) */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl sticky top-24 space-y-6">
                            
                            {/* Price */}
                            <div className="border-b border-slate-100 pb-4">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Starting from</div>
                                <div className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight">
                                    {formatProductPrice(tour, currency?.code || 'USD', 'package')}
                                </div>
                            </div>

                            {/* Booking Form */}
                            <form onSubmit={handleBooking} className="space-y-4 text-xs sm:text-sm">
                                <div className="space-y-1">
                                    <label className="block font-bold text-slate-700">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:border-amber-500"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block font-bold text-slate-700">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={data.customer_email}
                                        onChange={(e) => setData('customer_email', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:border-amber-500"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block font-bold text-slate-700">WhatsApp / Phone</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.customer_phone}
                                        onChange={(e) => setData('customer_phone', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:border-amber-500"
                                        placeholder="+94 77 123 4567"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="block font-bold text-slate-700">Start Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:border-amber-500"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block font-bold text-slate-700">Guests</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={tour.max_group_size || 50}
                                            required
                                            value={data.guests_count}
                                            onChange={(e) => setData('guests_count', parseInt(e.target.value))}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:border-amber-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 font-black text-slate-950 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 mt-4"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Inquire via WhatsApp</span>
                                </button>
                                <p className="text-center text-[11px] text-slate-400">Instant confirmation & no advance fees required.</p>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Related Tours */}
                {relatedTours.length > 0 && (
                    <div className="pt-12 border-t border-slate-200 space-y-6">
                        <h2 className="text-2xl font-black text-slate-900">Similar Recommended Experiences</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedTours.map(related => (
                                <Link 
                                    key={related.id} 
                                    href={`/tours/${related.id}`} 
                                    className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="h-48 overflow-hidden bg-slate-100">
                                            <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors mb-2 line-clamp-1">{related.title}</h3>
                                            <div className="flex justify-between items-center text-xs text-slate-500">
                                                <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-amber-500"/> {related.duration}</span>
                                                <span className="font-black text-amber-600">{formatProductPrice(related, currency?.code || 'USD', 'package')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Gallery Lightbox */}
            {galleryOpen && tour.gallery && (
                <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col p-4 sm:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white font-bold text-lg">{tour.title} Photos</h3>
                        <button onClick={() => setGalleryOpen(false)} className="text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all font-bold text-xs">
                            Close ✕
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl mx-auto">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                                <img src={tour.image} className="w-full h-full object-cover" alt="Main" />
                            </div>
                            {tour.gallery.map((img, idx) => (
                                <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden">
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
