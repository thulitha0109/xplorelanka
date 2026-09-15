import React, { useState } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import { 
    LayoutDashboard, Users, Calendar, MapPin, 
    Star, Settings, LogOut, CheckCircle2, 
    XCircle, Trash2, Edit, Check, X,
    PlusCircle, Eye, EyeOff
} from 'lucide-react';

export default function AdminDashboard({ 
    stats = {}, 
    bookings = [], 
    partners = [], 
    reviews = [], 
    users = [],
    tours = []
}) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'tours', label: 'Tours', icon: MapPin },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'partners', label: 'Partners', icon: Users },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'users', label: 'Users', icon: Settings },
    ];

    // Generic status updater
    const updateStatus = (type, id, statusData) => {
        router.put(`/admin/${type}/${id}/status`, statusData, {
            preserveScroll: true
        });
    };

    const updateRole = (id, role) => {
        router.put(`/admin/users/${id}/role`, { role }, {
            preserveScroll: true
        });
    };

    const deleteItem = (type, id) => {
        if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            router.delete(`/admin/${type}/${id}`, {
                preserveScroll: true
            });
        }
    };

    const statCards = [
        { title: 'Total Revenue', value: 'LKR 0', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
        { title: 'Active Bookings', value: bookings.filter(b => b.status !== 'cancelled').length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
        { title: 'Total Partners', value: partners.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { title: 'Pending Reviews', value: reviews.filter(r => !r.is_approved).length, icon: Star, color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/30' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
            <Head title="Admin Dashboard - Xplor Lanka" />
            <Navbar />

            <div className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 py-8 gap-8">
                
                {/* Sidebar */}
                <div className="md:w-64 shrink-0">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
                        <div className="text-center mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="w-16 h-16 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-3">
                                {auth.user.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="font-bold text-lg">{auth.user.name}</h2>
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-500 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full uppercase tracking-wider inline-block mt-2">
                                {auth.user.role}
                            </span>
                        </div>

                        <nav className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                            isActive 
                                                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                            
                            {/* Return to site */}
                            <Link
                                href="/"
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all mt-4"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Back to Site</span>
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow space-y-6">
                    
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black">Dashboard Overview</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {statCards.map((stat, idx) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase">{stat.title}</p>
                                                <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TOURS TAB */}
                    {activeTab === 'tours' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black">Manage Tours</h2>
                                <Link 
                                    href="/admin/tours/create" 
                                    className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 transition-all"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span>Create Tour</span>
                                </Link>
                            </div>
                            
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                                            <tr>
                                                <th className="px-6 py-4">Tour details</th>
                                                <th className="px-6 py-4">Category</th>
                                                <th className="px-6 py-4">Price / Duration</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {tours.map(tour => (
                                                <tr key={tour.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <img src={tour.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                                            <div>
                                                                <div className="font-bold text-slate-900 dark:text-white max-w-[200px] truncate">{tour.title}</div>
                                                                <div className="text-xs text-slate-500">{tour.route}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="uppercase text-xs font-bold text-slate-500">{tour.category}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold">LKR {Number(tour.price_lkr).toLocaleString()}</div>
                                                        <div className="text-xs text-slate-500">{tour.duration}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col space-y-1">
                                                            {tour.is_active ? (
                                                                <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                                                    <Eye className="w-3 h-3" /> <span>Active</span>
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center space-x-1 text-slate-500 text-xs font-bold">
                                                                    <EyeOff className="w-3 h-3" /> <span>Hidden</span>
                                                                </span>
                                                            )}
                                                            {tour.is_featured && (
                                                                <span className="text-amber-500 text-[10px] font-black uppercase tracking-wider">✦ Featured</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <Link href={`/admin/tours/${tour.id}/edit`} className="inline-block p-2 text-slate-400 hover:text-blue-500 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors">
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                        <button onClick={() => deleteItem('tours', tour.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {tours.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No tours found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BOOKINGS TAB */}
                    {activeTab === 'bookings' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black">Bookings & Inquiries</h2>
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                                            <tr>
                                                <th className="px-6 py-4">Customer</th>
                                                <th className="px-6 py-4">Tour / Service</th>
                                                <th className="px-6 py-4">Date & Guests</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {bookings.map(booking => (
                                                <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-900 dark:text-white">{booking.customer_name}</div>
                                                        <div className="text-xs text-slate-500">{booking.customer_email}</div>
                                                        <div className="text-xs text-slate-500">{booking.customer_phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-700 dark:text-slate-300">
                                                            {booking.tour ? booking.tour.title : (booking.service_type || 'Custom Inquiry')}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold">{booking.start_date || 'TBD'}</div>
                                                        <div className="text-xs text-slate-500">{booking.guests_count} Guests</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                                                            booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                        }`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        {booking.status !== 'confirmed' && (
                                                            <button onClick={() => updateStatus('bookings', booking.id, { status: 'confirmed' })} className="p-2 text-slate-400 hover:text-emerald-500 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors" title="Confirm">
                                                                <CheckCircle2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {booking.status !== 'cancelled' && (
                                                            <button onClick={() => updateStatus('bookings', booking.id, { status: 'cancelled' })} className="p-2 text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors" title="Cancel">
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <button onClick={() => deleteItem('bookings', booking.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors" title="Delete">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {bookings.length === 0 && (
                                                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No bookings found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* REVIEWS TAB */}
                    {activeTab === 'reviews' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black">Manage Reviews</h2>
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                                            <tr>
                                                <th className="px-6 py-4">Customer & Tour</th>
                                                <th className="px-6 py-4 max-w-xs">Review Content</th>
                                                <th className="px-6 py-4">Rating</th>
                                                <th className="px-6 py-4">Approval</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {reviews.map(review => (
                                                <tr key={review.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-900 dark:text-white">{review.customer_name}</div>
                                                        <div className="text-xs text-slate-500 max-w-[150px] truncate">{review.tour?.title || 'Unknown Tour'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 max-w-xs whitespace-normal">
                                                        {review.title && <div className="font-bold text-sm mb-1">{review.title}</div>}
                                                        <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{review.comment}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex space-x-0.5">
                                                            {[1,2,3,4,5].map(s => (
                                                                <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200 dark:text-slate-700'}`} />
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button 
                                                            onClick={() => updateStatus('reviews', review.id, { is_approved: !review.is_approved })}
                                                            className={`px-3 py-1 text-xs font-bold uppercase rounded-full border transition-colors ${
                                                                review.is_approved 
                                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
                                                                    : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600'
                                                            }`}
                                                        >
                                                            {review.is_approved ? 'Approved' : 'Pending'}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <button onClick={() => deleteItem('reviews', review.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {reviews.length === 0 && (
                                                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No reviews found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* USERS TAB (Admin only if we want to restrict, but middleware restricts this whole page anyway) */}
                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black">User Accounts</h2>
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                                            <tr>
                                                <th className="px-6 py-4">User</th>
                                                <th className="px-6 py-4">Email</th>
                                                <th className="px-6 py-4">Role</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {users.map(u => (
                                                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                                                    <td className="px-6 py-4 text-slate-500">{u.email}</td>
                                                    <td className="px-6 py-4">
                                                        <select 
                                                            value={u.role}
                                                            onChange={(e) => updateRole(u.id, e.target.value)}
                                                            disabled={u.id === auth.user.id}
                                                            className="text-xs font-bold uppercase rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-950 px-2 py-1"
                                                        >
                                                            <option value="customer">Customer</option>
                                                            <option value="staff">Staff</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {u.id !== auth.user.id && (
                                                            <button onClick={() => deleteItem('users', u.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            <Footer />
        </div>
    );
}
