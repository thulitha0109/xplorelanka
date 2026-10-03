import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import MediaUploader from '../Components/MediaUploader';
import { Star, MessageSquare, CheckCircle2, ArrowLeft, Send, Sparkles, Building2, Car, MapPin } from 'lucide-react';

export default function WriteReview({ tour = null, accommodation = null, vehicle = null, review = null, isEdit = false }) {
    const { auth, flash } = usePage().props;
    const [rating, setRating] = useState(review?.rating || 5);

    const targetTitle = tour?.title || accommodation?.name || vehicle?.name || 'Xplor Lanka Experience';
    const targetImage = tour?.image || accommodation?.image || vehicle?.image || 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=800&auto=format&fit=crop';
    
    let backUrl = '/';
    if (tour) backUrl = `/tours/${tour.id}`;
    else if (accommodation) backUrl = `/accommodations`;
    else if (vehicle) backUrl = `/vehicles`;

    const { data, setData, post, put, processing, errors } = useForm({
        tour_id: tour?.id || review?.tour_id || null,
        accommodation_id: accommodation?.id || review?.accommodation_id || null,
        vehicle_id: vehicle?.id || review?.vehicle_id || null,
        customer_name: review?.customer_name || auth?.user?.name || '',
        customer_country: review?.customer_country || 'International Traveler',
        title: review?.title || '',
        rating: review?.rating || 5,
        comment: review?.comment || '',
        media_urls: review?.media_urls || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        data.rating = rating;
        if (isEdit && review?.id) {
            put(`/reviews/${review.id}`);
        } else {
            post('/reviews');
        }
    };

    if (flash?.success) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
                <Navbar />
                <div className="flex-grow flex items-center justify-center p-4">
                    <div className="bg-white p-8 md:p-12 rounded-3xl text-center max-w-lg shadow-xl border border-slate-200">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-4">
                            {isEdit ? 'Review Updated!' : 'Review Submitted!'}
                        </h2>
                        <p className="text-slate-600 mb-8">
                            {flash.success || 'Thank you for sharing your experience. Your verified feedback helps travelers worldwide.'}
                        </p>
                        <div className="flex flex-col space-y-3">
                            <Link href={backUrl} className="px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-colors shadow-xs">
                                Return to {tour ? 'Tour' : accommodation ? 'Stay' : 'Vehicles'}
                            </Link>
                            <Link href="/my-account" className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                Go to My Account
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
            <Head title={`${isEdit ? 'Edit Review' : 'Write a Review'} - ${targetTitle}`} />
            <Navbar />

            <main className="flex-grow py-12 container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <Link href={backUrl} className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-amber-600 font-bold mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to {targetTitle}</span>
                </Link>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-50 via-white to-slate-50 p-8 border-b border-slate-200 relative overflow-hidden">
                        <div className="flex items-start space-x-4">
                            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shrink-0 shadow-md text-slate-950">
                                {tour ? <MessageSquare className="w-7 h-7" /> : accommodation ? <Building2 className="w-7 h-7" /> : <Car className="w-7 h-7" />}
                            </div>
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                                    {isEdit ? 'Edit Verified Review' : 'Verified Experience Feedback'}
                                </span>
                                <h1 className="text-2xl font-black text-slate-900">{isEdit ? 'Update Your Review' : 'Write a Review'}</h1>
                                <p className="text-slate-600 text-sm">Reviewing: <span className="font-bold text-slate-900">{targetTitle}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6 text-sm">
                        {/* Rating Stars */}
                        <div className="space-y-2">
                            <label className="block font-bold text-slate-700">Overall Rating</label>
                            <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="p-1 text-slate-300 hover:text-amber-500 focus:outline-none transition-colors"
                                    >
                                        <Star className={`w-8 h-8 ${star <= rating ? 'text-amber-500 fill-amber-500' : ''}`} />
                                    </button>
                                ))}
                                <span className="text-sm font-bold text-amber-600 ml-2">{rating} of 5 Stars</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Your Country</label>
                                <input
                                    type="text"
                                    required
                                    value={data.customer_country}
                                    onChange={(e) => setData('customer_country', e.target.value)}
                                    placeholder="e.g. Germany, UK, Australia"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Review Title / Headline</label>
                            <input
                                type="text"
                                required
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g. Unforgettable 14-day holiday in Sri Lanka!"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Your Detailed Experience & Feedback</label>
                            <textarea
                                rows="5"
                                required
                                value={data.comment}
                                onChange={(e) => setData('comment', e.target.value)}
                                placeholder="Describe your experience with the driver, accommodations, scenery, or tour highlights..."
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 leading-relaxed"
                            />
                        </div>

                        {/* Trip & Experience Photo Upload to Object Storage */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <MediaUploader
                                value={data.media_urls}
                                onChange={(urls) => setData('media_urls', urls)}
                                folder="reviews"
                                multiple={true}
                                label="Upload Vacation Photos (Optional)"
                                helpText="Add your vacation photos from Sri Lanka (JPG, PNG, WEBP up to 12MB each)."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-amber-500 hover:bg-amber-600 font-black text-slate-950 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-base"
                        >
                            <Send className="w-4 h-4" />
                            <span>{isEdit ? 'Update Review' : 'Submit Review'}</span>
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
