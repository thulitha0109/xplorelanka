import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Star, MessageSquare, ImagePlus, CheckCircle2, ArrowLeft, Send } from 'lucide-react';

export default function WriteReview({ tour }) {
    const { auth, flash } = usePage().props;
    const [rating, setRating] = useState(5);
    const [mediaLinks, setMediaLinks] = useState(['']);

    const { data, setData, post, processing, errors } = useForm({
        tour_id: tour.id,
        customer_name: auth.user.name || '',
        customer_country: '',
        title: '',
        rating: 5,
        comment: '',
        media_urls: [],
    });

    const handleMediaChange = (index, value) => {
        const newLinks = [...mediaLinks];
        newLinks[index] = value;
        setMediaLinks(newLinks);
        setData('media_urls', newLinks.filter(url => url.trim() !== ''));
    };

    const addMediaField = () => {
        if (mediaLinks.length < 4) {
            setMediaLinks([...mediaLinks, '']);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        data.rating = rating;
        post('/reviews');
    };

    if (flash?.success) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
                <Navbar />
                <div className="flex-grow flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl text-center max-w-lg shadow-xl border border-slate-200 dark:border-slate-800">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Review Submitted!</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">Thank you for sharing your experience. Your review helps other travelers discover the magic of Sri Lanka.</p>
                        <div className="flex flex-col space-y-3">
                            <Link href={`/tours/${tour.id}`} className="px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-colors">
                                Back to Tour
                            </Link>
                            <Link href="/my-account" className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                Go to My Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
            <Head title={`Write a Review - ${tour.title}`} />
            <Navbar />

            <main className="flex-grow py-12 container mx-auto px-4 max-w-3xl">
                
                <Link href={`/tours/${tour.id}`} className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-amber-500 font-semibold mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to {tour.title}</span>
                </Link>

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {/* Header */}
                    <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <img src={tour.image} alt="" className="w-full h-full object-cover blur-sm" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
                        <div className="relative z-10 flex items-start space-x-4">
                            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                                <MessageSquare className="w-8 h-8 text-slate-950" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black mb-1">Write a Review</h1>
                                <p className="text-slate-300 text-sm">Share your experience about <span className="font-bold text-amber-400">{tour.title}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
                        
                        {/* Rating */}
                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Overall Rating <span className="text-red-500">*</span></label>
                            <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="p-1 transition-transform hover:scale-110 focus:outline-none group"
                                    >
                                        <Star className={`w-10 h-10 transition-colors ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200 dark:text-slate-800 group-hover:text-amber-300'}`} />
                                    </button>
                                ))}
                                <span className="ml-4 font-bold text-lg text-slate-500 dark:text-slate-400">
                                    {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Terrible'}
                                </span>
                            </div>
                            {errors.rating && <p className="text-red-500 text-xs">{errors.rating}</p>}
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Review Title</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="Sum up your experience in one line"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow"
                            />
                            {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                        </div>

                        {/* Comment */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Your Review <span className="text-red-500">*</span></label>
                            <textarea
                                required
                                rows="5"
                                value={data.comment}
                                onChange={e => setData('comment', e.target.value)}
                                placeholder="What did you enjoy? What could be improved? Help others make the right choice."
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow"
                            ></textarea>
                            {errors.comment && <p className="text-red-500 text-xs">{errors.comment}</p>}
                        </div>

                        {/* Personal Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Name to display <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={data.customer_name}
                                    onChange={e => setData('customer_name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow"
                                />
                                {errors.customer_name && <p className="text-red-500 text-xs">{errors.customer_name}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Country</label>
                                <input
                                    type="text"
                                    value={data.customer_country}
                                    onChange={e => setData('customer_country', e.target.value)}
                                    placeholder="e.g. United Kingdom"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow"
                                />
                                {errors.customer_country && <p className="text-red-500 text-xs">{errors.customer_country}</p>}
                            </div>
                        </div>

                        {/* Media Links */}
                        <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center space-x-2 mb-2">
                                <ImagePlus className="w-5 h-5 text-slate-500" />
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Add Photos/Videos (URLs)</label>
                            </div>
                            <p className="text-xs text-slate-500 mb-4">Paste links to your public photos or videos (Instagram, Google Photos, Imgur, etc.)</p>
                            
                            <div className="space-y-3">
                                {mediaLinks.map((link, idx) => (
                                    <input
                                        key={idx}
                                        type="url"
                                        value={link}
                                        onChange={e => handleMediaChange(idx, e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                ))}
                            </div>
                            
                            {mediaLinks.length < 4 && (
                                <button type="button" onClick={addMediaField} className="text-sm text-amber-600 dark:text-amber-500 font-bold hover:underline">
                                    + Add another link
                                </button>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
                            >
                                <Send className="w-5 h-5" />
                                <span>{processing ? 'Submitting...' : 'Submit Review'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
