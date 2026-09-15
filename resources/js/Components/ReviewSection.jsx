import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Star, MessageSquare, ChevronLeft, ChevronRight, PenLine, Play, X, ExternalLink } from 'lucide-react';

function GoogleIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
    );
}

function ReviewCard({ review, onOpenMedia }) {
    const countryFlag = (country) => {
        if (!country) return '🌍';
        const flags = {
            'United Kingdom': '🇬🇧', 'UK': '🇬🇧', 'Britain': '🇬🇧',
            'United States': '🇺🇸', 'USA': '🇺🇸', 'America': '🇺🇸',
            'Germany': '🇩🇪', 'France': '🇫🇷', 'Australia': '🇦🇺',
            'Canada': '🇨🇦', 'Netherlands': '🇳🇱', 'Switzerland': '🇨🇭',
            'Japan': '🇯🇵', 'South Korea': '🇰🇷', 'India': '🇮🇳',
            'China': '🇨🇳', 'Sri Lanka': '🇱🇰', 'Italy': '🇮🇹',
            'Spain': '🇪🇸', 'Denmark': '🇩🇰', 'Sweden': '🇸🇪',
            'Norway': '🇳🇴', 'Singapore': '🇸🇬', 'UAE': '🇦🇪',
        };
        for (const [key, val] of Object.entries(flags)) {
            if (country.toLowerCase().includes(key.toLowerCase())) return val;
        }
        return '🌍';
    };

    const initials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';

    const avatarColors = [
        'bg-amber-500', 'bg-emerald-500', 'bg-blue-500',
        'bg-purple-500', 'bg-rose-500', 'bg-teal-500',
    ];
    const colorIndex = review.id ? review.id % avatarColors.length : 0;

    const hasMedia = review.media_urls && Array.isArray(review.media_urls) && review.media_urls.length > 0;

    return (
        <div className="min-w-[320px] max-w-[360px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex-shrink-0 flex flex-col space-y-3 shadow-sm hover:shadow-md transition-all">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0 ${avatarColors[colorIndex]}`}>
                        {initials(review.customer_name)}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{review.customer_name}</div>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                            <span>{countryFlag(review.customer_country)}</span>
                            <span>{review.customer_country || 'International Traveler'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                    <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500">
                        <GoogleIcon className="w-2.5 h-2.5" />
                        <span>Google</span>
                    </span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {new Date(review.created_at || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Stars */}
            <div className="flex items-center space-x-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200 dark:text-slate-700'}`}
                    />
                ))}
            </div>

            {/* Review title */}
            {review.title && (
                <h4 className="font-bold text-slate-800 dark:text-white text-sm leading-snug">{review.title}</h4>
            )}

            {/* Comment */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex-grow line-clamp-4">
                "{review.comment}"
            </p>

            {/* Media thumbnails */}
            {hasMedia && (
                <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Guest Photos & Media</div>
                    <div className="flex space-x-2 overflow-x-auto pb-1">
                        {review.media_urls.map((url, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => onOpenMedia(url)}
                                className="flex-shrink-0 w-16 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 relative group cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-colors"
                            >
                                {url.match(/\.(mp4|webm|mov)$/i) ? (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-900 group-hover:scale-105 transition-transform">
                                        <Play className="w-5 h-5 text-amber-400 fill-amber-400" />
                                    </div>
                                ) : (
                                    <img 
                                        src={url} 
                                        alt="Guest review travel photo" 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Tour link */}
            {review.tour && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Link
                        href={`/tours/${review.tour.id}`}
                        className="text-[10px] text-amber-500 hover:text-amber-400 font-semibold transition-colors flex items-center space-x-1"
                    >
                        <span>Tour: {review.tour.title}</span>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function ReviewSection({ reviews = [], tourId = null, avgRating = 4.9 }) {
    const { auth } = usePage().props;
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [selectedMedia, setSelectedMedia] = useState(null);

    const scroll = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
        }
    };

    const checkScrollButtons = () => {
        if (scrollRef.current) {
            setCanScrollLeft(scrollRef.current.scrollLeft > 0);
            setCanScrollRight(
                scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 5
            );
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', checkScrollButtons);
            checkScrollButtons();
            return () => el.removeEventListener('scroll', checkScrollButtons);
        }
    }, [reviews]);

    const reviewUrl = tourId ? `/write-review/${tourId}` : '/write-review/1';

    return (
        <section id="reviews" className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center space-x-2.5">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
                            <MessageSquare className="w-6 h-6 text-amber-500" />
                            <span>Guest Reviews</span>
                        </h3>
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            <GoogleIcon className="w-3.5 h-3.5" />
                            <span>Google Verified</span>
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Verified traveler experiences and real journey photos from our guests</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        <span className="font-black text-lg text-amber-500">{avgRating}</span>
                        <span className="text-xs text-slate-400">({reviews.length} reviews)</span>
                    </div>
                    {auth?.user ? (
                        <Link
                            href={reviewUrl}
                            className="flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all"
                        >
                            <PenLine className="w-4 h-4" />
                            <span>Write a Review</span>
                        </Link>
                    ) : (
                        <Link
                            href={`/login?redirect=${reviewUrl}`}
                            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all"
                        >
                            <PenLine className="w-4 h-4" />
                            <span>Login to Review</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Swiper Carousel */}
            {reviews.length > 0 ? (
                <div className="relative">
                    {/* Scroll buttons */}
                    {canScrollLeft && (
                        <button
                            type="button"
                            onClick={() => scroll(-1)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-lg hover:bg-amber-500 hover:border-amber-500 hover:text-white transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    {canScrollRight && (
                        <button
                            type="button"
                            onClick={() => scroll(1)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-lg hover:bg-amber-500 hover:border-amber-500 hover:text-white transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}

                    <div
                        ref={scrollRef}
                        className="flex space-x-4 overflow-x-auto pb-4 scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {reviews.map((review) => (
                            <ReviewCard key={review.id} review={review} onOpenMedia={(url) => setSelectedMedia(url)} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No reviews yet — be the first to share your experience!</p>
                    {auth?.user ? (
                        <Link href={reviewUrl} className="mt-4 inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition-all">
                            <PenLine className="w-3.5 h-3.5" />
                            <span>Write First Review</span>
                        </Link>
                    ) : (
                        <Link href="/login" className="mt-4 inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-700 transition-all">
                            <span>Sign in to Review</span>
                        </Link>
                    )}
                </div>
            )}

            {/* Media Lightbox Modal */}
            {selectedMedia && (
                <div 
                    className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4" 
                    onClick={() => setSelectedMedia(null)}
                >
                    <div 
                        className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800" 
                        onClick={e => e.stopPropagation()}
                    >
                        <button 
                            type="button"
                            onClick={() => setSelectedMedia(null)}
                            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-colors shadow-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        {selectedMedia.match(/\.(mp4|webm|mov)$/i) ? (
                            <video src={selectedMedia} controls autoPlay className="max-w-full max-h-[85vh] rounded-2xl" />
                        ) : (
                            <img src={selectedMedia} alt="Guest travel memory" className="max-w-full max-h-[85vh] object-contain rounded-2xl" />
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
