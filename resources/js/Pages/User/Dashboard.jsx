import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import { User, Calendar, MessageSquare, MapPin, Clock, Star, ExternalLink, Settings } from 'lucide-react';

export default function UserDashboard({ user, bookings = [], reviews = [] }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
            <Head title="My Account - Xplor Lanka" />
            <Navbar />

            <main className="flex-grow py-12 container mx-auto px-4 max-w-6xl space-y-8">
                
                {/* Header / Profile Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="w-24 h-24 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-4xl font-black shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow text-center sm:text-left space-y-2">
                        <h1 className="text-3xl font-black">{user.name}</h1>
                        <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
                        <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-3">
                            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                            </span>
                            {user.role === 'admin' && (
                                <Link href="/admin/dashboard" className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold hover:bg-amber-200 transition-colors">
                                    <Settings className="w-3.5 h-3.5" />
                                    <span>Admin Portal</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Main Content Area (Bookings) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center space-x-2">
                                <MapPin className="w-6 h-6 text-emerald-500" />
                                <span>My Inquiries & Bookings</span>
                            </h2>
                            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                                {bookings.length} Total
                            </span>
                        </div>

                        {bookings.length > 0 ? (
                            <div className="space-y-4">
                                {bookings.map(booking => (
                                    <div key={booking.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
                                        <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                                            {booking.tour ? (
                                                <img src={booking.tour.image} alt={booking.tour.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">Custom/Deleted</div>
                                            )}
                                        </div>
                                        <div className="flex-grow space-y-3">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-bold">
                                                    {booking.tour ? (
                                                        <Link href={`/tours/${booking.tour.id}`} className="hover:text-amber-500 transition-colors">
                                                            {booking.tour.title}
                                                        </Link>
                                                    ) : 'Custom Inquiry'}
                                                </h3>
                                                <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${
                                                    booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                                                <div className="flex items-center space-x-1.5">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{booking.start_date || 'TBD'}</span>
                                                </div>
                                                <div className="flex items-center space-x-1.5">
                                                    <User className="w-4 h-4" />
                                                    <span>{booking.guests_count} Guests</span>
                                                </div>
                                                {booking.tour && (
                                                    <div className="flex items-center space-x-1.5">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{booking.tour.duration}</span>
                                                    </div>
                                                )}
                                                <div className="text-slate-400 text-xs flex items-center">
                                                    ID: #{booking.id.toString().padStart(4, '0')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                                <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                <h3 className="text-lg font-bold mb-2">No bookings yet</h3>
                                <p className="text-slate-500 text-sm mb-6">You haven't inquired about any tours or services.</p>
                                <Link href="/tours" className="inline-flex items-center px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-colors">
                                    Explore Tours
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Sidebar (Reviews) */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center space-x-2">
                                <MessageSquare className="w-5 h-5 text-amber-500" />
                                <span>My Reviews</span>
                            </h2>
                        </div>

                        {reviews.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <div key={review.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
                                        {!review.is_approved && (
                                            <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-bl-xl rounded-tr-2xl">
                                                Pending Approval
                                            </div>
                                        )}
                                        {review.tour && (
                                            <Link href={`/tours/${review.tour.id}#reviews`} className="text-xs font-bold text-slate-900 dark:text-white hover:text-amber-500 transition-colors flex items-center space-x-1 mb-2 truncate">
                                                <ExternalLink className="w-3 h-3" />
                                                <span className="truncate">{review.tour.title}</span>
                                            </Link>
                                        )}
                                        <div className="flex space-x-0.5 mb-2">
                                            {[1,2,3,4,5].map(s => (
                                                <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200 dark:text-slate-700'}`} />
                                            ))}
                                        </div>
                                        {review.title && <h4 className="text-sm font-bold mb-1">{review.title}</h4>}
                                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">"{review.comment}"</p>
                                        <div className="mt-3 text-[10px] text-slate-400">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                                <p className="text-slate-500 text-sm">You haven't written any reviews yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
