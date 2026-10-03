import React, { useState } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import MediaUploader from '../../Components/MediaUploader';
import { 
    LayoutDashboard, Users, Calendar, MapPin, 
    Star, Settings, LogOut, CheckCircle2, 
    XCircle, Trash2, Edit, Check, X,
    PlusCircle, Eye, EyeOff, FileText, Bed, Car,
    ShieldCheck, Sparkles, MessageSquare, ExternalLink,
    Search, Filter, Globe, ArrowUpRight, UserCheck, RefreshCw
} from 'lucide-react';

export default function AdminDashboard({ 
    stats = {}, 
    recentBookings = [], 
    tours = [], 
    accommodations = [], 
    vehicles = [], 
    partners = [], 
    users = [], 
    reviews = [], 
    blogs = [],
    categorizedPartners = {}
}) {
    const { auth, flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [partnerModalOpen, setPartnerModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState(null);

    const [convertUserModalOpen, setConvertUserModalOpen] = useState(false);
    const [selectedUserForPartner, setSelectedUserForPartner] = useState(null);

    const [blogModalOpen, setBlogModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState(null);

    const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);

    const [accommodationModalOpen, setAccommodationModalOpen] = useState(false);
    const [editingAccommodation, setEditingAccommodation] = useState(null);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, count: null },
        { id: 'tours', label: 'Tours', icon: MapPin, count: tours.length },
        { id: 'accommodations', label: 'Accommodations', icon: Bed, count: accommodations.length },
        { id: 'vehicles', label: 'Vehicles', icon: Car, count: vehicles.length },
        { id: 'blogs', label: 'Blogs & SEO', icon: FileText, count: blogs.length },
        { id: 'reviews', label: 'Reviews', icon: Star, count: reviews.length },
        { id: 'partners', label: 'Partners', icon: Users, count: partners.length },
        { id: 'bookings', label: 'Bookings', icon: Calendar, count: recentBookings.length },
        { id: 'users', label: 'Users', icon: Settings, count: users.length },
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

    // ── PARTNER FORM (CREATE & EDIT) ──
    const partnerForm = useForm({
        name: '',
        email: '',
        phone: '',
        partner_type: 'vehicle_owner',
        location: '',
        vehicle_or_property_details: '',
        rate_lkr: '',
        rating: 5.0,
        status: 'approved',
        message: '',
    });

    const openCreatePartner = () => {
        setEditingPartner(null);
        partnerForm.reset();
        partnerForm.setData({
            name: '',
            email: '',
            phone: '',
            partner_type: 'vehicle_owner',
            location: 'Colombo, Sri Lanka',
            vehicle_or_property_details: '',
            rate_lkr: '',
            rating: 5.0,
            status: 'approved',
            message: '',
        });
        setPartnerModalOpen(true);
    };

    const openEditPartner = (p) => {
        setEditingPartner(p);
        partnerForm.setData({
            name: p.name || '',
            email: p.email || '',
            phone: p.phone || '',
            partner_type: p.partner_type || 'vehicle_owner',
            location: p.location || '',
            vehicle_or_property_details: p.vehicle_or_property_details || '',
            rate_lkr: p.rate_lkr || '',
            rating: p.rating || 5.0,
            status: p.status || 'approved',
            message: p.message || '',
        });
        setPartnerModalOpen(true);
    };

    const handlePartnerSubmit = (e) => {
        e.preventDefault();
        if (editingPartner) {
            partnerForm.put(`/admin/partners/${editingPartner.id}`, {
                onSuccess: () => setPartnerModalOpen(false),
            });
        } else {
            partnerForm.post('/admin/partners', {
                onSuccess: () => setPartnerModalOpen(false),
            });
        }
    };

    // Convert user to partner form
    const convertUserForm = useForm({
        partner_type: 'vehicle_owner',
        location: 'Colombo / Kandy',
        vehicle_or_property_details: '',
        rate_lkr: '',
        status: 'approved',
    });

    const openConvertUser = (u) => {
        setSelectedUserForPartner(u);
        convertUserForm.reset();
        setConvertUserModalOpen(true);
    };

    const handleConvertUserSubmit = (e) => {
        e.preventDefault();
        convertUserForm.post(`/admin/partners/from-user/${selectedUserForPartner.id}`, {
            onSuccess: () => {
                setConvertUserModalOpen(false);
                setSelectedUserForPartner(null);
            }
        });
    };

    // ── BLOG FORM (CREATE & EDIT WITH SEO) ──
    const blogForm = useForm({
        title: '',
        slug: '',
        category: 'Travel Guides',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        canonical_url: '',
        excerpt: '',
        content: '',
        author: auth?.user?.name || 'Xplor Lanka Expert',
        reading_time_min: 5,
        tags_input: '',
        image: '',
        is_published: true,
    });

    const generateSlugFromTitle = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const openCreateBlog = () => {
        setEditingBlog(null);
        blogForm.reset();
        blogForm.setData({
            title: '',
            slug: '',
            category: 'Travel Guides',
            meta_title: '',
            meta_description: '',
            meta_keywords: '',
            canonical_url: '',
            excerpt: '',
            content: '',
            author: auth?.user?.name || 'Xplor Lanka Expert',
            reading_time_min: 5,
            tags_input: 'Sri Lanka, Travel, Tours, 2026',
            image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
            is_published: true,
        });
        setBlogModalOpen(true);
    };

    const openEditBlog = (b) => {
        setEditingBlog(b);
        blogForm.setData({
            title: b.title || '',
            slug: b.slug || '',
            category: b.category || 'Travel Guides',
            meta_title: b.meta_title || '',
            meta_description: b.meta_description || '',
            meta_keywords: b.meta_keywords || '',
            canonical_url: b.canonical_url || '',
            excerpt: b.excerpt || '',
            content: b.content || '',
            author: b.author || 'Xplor Lanka Expert',
            reading_time_min: b.reading_time_min || 5,
            tags_input: Array.isArray(b.tags) ? b.tags.join(', ') : '',
            image: b.image || '',
            is_published: b.is_published ?? true,
        });
        setBlogModalOpen(true);
    };

    const handleBlogSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...blogForm.data,
            tags: blogForm.data.tags_input.split(',').map(t => t.trim()).filter(Boolean),
        };
        if (editingBlog) {
            router.put(`/admin/blogs/${editingBlog.id}`, payload, {
                onSuccess: () => setBlogModalOpen(false)
            });
        } else {
            router.post('/admin/blogs', payload, {
                onSuccess: () => setBlogModalOpen(false)
            });
        }
    };

    // ── REVIEW FORM (CREATE & EDIT) ──
    const reviewForm = useForm({
        tour_id: '',
        accommodation_id: '',
        vehicle_id: '',
        customer_name: '',
        customer_country: 'United Kingdom',
        title: '',
        rating: 5,
        comment: '',
        media_urls_input: '',
        is_approved: true,
        source_platform: 'google',
    });

    const openCreateReview = () => {
        setEditingReview(null);
        reviewForm.reset();
        reviewForm.setData({
            tour_id: tours[0]?.id || '',
            accommodation_id: '',
            vehicle_id: '',
            customer_name: '',
            customer_country: 'United Kingdom',
            title: '',
            rating: 5,
            comment: '',
            media_urls_input: '',
            is_approved: true,
            source_platform: 'google',
        });
        setReviewModalOpen(true);
    };

    const openEditReview = (r) => {
        setEditingReview(r);
        reviewForm.setData({
            tour_id: r.tour_id || '',
            accommodation_id: r.accommodation_id || '',
            vehicle_id: r.vehicle_id || '',
            customer_name: r.customer_name || '',
            customer_country: r.customer_country || 'United Kingdom',
            title: r.title || '',
            rating: r.rating || 5,
            comment: r.comment || '',
            media_urls_input: Array.isArray(r.media_urls) ? r.media_urls.join('\n') : '',
            is_approved: r.is_approved ?? true,
            source_platform: r.source_platform || 'google',
        });
        setReviewModalOpen(true);
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...reviewForm.data,
            tour_id: reviewForm.data.tour_id || null,
            accommodation_id: reviewForm.data.accommodation_id || null,
            vehicle_id: reviewForm.data.vehicle_id || null,
            media_urls: reviewForm.data.media_urls_input.split('\n').map(u => u.trim()).filter(Boolean),
            source_platform: reviewForm.data.source_platform || 'google',
        };
        if (editingReview) {
            router.put(`/admin/reviews/${editingReview.id}`, payload, {
                onSuccess: () => setReviewModalOpen(false)
            });
        } else {
            router.post('/admin/reviews', payload, {
                onSuccess: () => setReviewModalOpen(false)
            });
        }
    };

    // ── VEHICLE FORM (CREATE & EDIT) ──
    const vehicleForm = useForm({
        vehicle_key: '',
        vehicle_category: 'Passenger Van',
        partner_id: '',
        name: '',
        seats: '4 - 9 Passengers',
        luggage_capacity: 6,
        transmission: 'Automatic',
        fuel_type: 'Diesel',
        rate_per_km: 'Rs. 140 / km',
        base_rate_lkr: 18000,
        daily_rate_lkr: 22000,
        icon: 'Users',
        image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
        description: '',
        driver_included: true,
        ac_available: true,
        is_available: true,
        fleet_count: 5,
    });

    const openCreateVehicle = () => {
        setEditingVehicle(null);
        vehicleForm.reset();
        vehicleForm.setData({
            vehicle_key: `vehicle_${Date.now()}`,
            vehicle_category: 'Passenger Van',
            partner_id: partners[0]?.id || '',
            name: 'Toyota KDH Luxury High-Roof Van',
            seats: '4 - 9 Passengers',
            luggage_capacity: 8,
            transmission: 'Automatic',
            fuel_type: 'Diesel',
            rate_per_km: 'Rs. 140 / km',
            base_rate_lkr: 18000,
            daily_rate_lkr: 22000,
            icon: 'Users',
            image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
            description: 'Spacious high-roof air conditioned passenger van with experienced tourist chauffeur.',
            driver_included: true,
            ac_available: true,
            is_available: true,
            fleet_count: 6,
        });
        setVehicleModalOpen(true);
    };

    const openEditVehicle = (v) => {
        setEditingVehicle(v);
        vehicleForm.setData({
            vehicle_key: v.vehicle_key || '',
            vehicle_category: v.vehicle_category || 'Passenger Van',
            partner_id: v.partner_id || '',
            name: v.name || '',
            seats: v.seats || '',
            luggage_capacity: v.luggage_capacity || 4,
            transmission: v.transmission || 'Automatic',
            fuel_type: v.fuel_type || 'Diesel',
            rate_per_km: v.rate_per_km || '',
            base_rate_lkr: v.base_rate_lkr || 0,
            daily_rate_lkr: v.daily_rate_lkr || 0,
            icon: v.icon || 'Car',
            image: v.image || '',
            description: v.description || '',
            driver_included: v.driver_included ?? true,
            ac_available: v.ac_available ?? true,
            is_available: v.is_available ?? true,
            fleet_count: v.fleet_count || 1,
        });
        setVehicleModalOpen(true);
    };

    const handleVehicleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...vehicleForm.data,
            partner_id: vehicleForm.data.partner_id || null,
        };
        if (editingVehicle) {
            router.put(`/admin/vehicles/${editingVehicle.id}`, payload, {
                onSuccess: () => setVehicleModalOpen(false)
            });
        } else {
            router.post('/admin/vehicles', payload, {
                onSuccess: () => setVehicleModalOpen(false)
            });
        }
    };

    // ── ACCOMMODATION FORM (CREATE & EDIT) ──
    const accommodationForm = useForm({
        name: '',
        category: 'Eco Lodge',
        partner_id: '',
        location: 'Ella, Hill Country',
        price_lkr: 28000,
        period: 'night',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
        amenities_input: 'Mountain View, Infinity Pool, Breakfast, Wi-Fi, AC',
        description: '',
        contact_phone: '+94 57 223 4567',
        contact_email: 'stay@xplorelanka.com',
        is_available: true,
        is_featured: true,
    });

    const openCreateAccommodation = () => {
        setEditingAccommodation(null);
        accommodationForm.reset();
        accommodationForm.setData({
            name: '',
            category: 'Eco Lodge',
            partner_id: partners[0]?.id || '',
            location: 'Ella, Hill Country',
            price_lkr: 28000,
            period: 'night',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
            amenities_input: 'Mountain View, Infinity Pool, Breakfast, Wi-Fi, AC',
            description: 'Handcrafted luxury eco sanctuary nestled in the misty mountain slopes.',
            contact_phone: '+94 57 223 4567',
            contact_email: 'stay@xplorelanka.com',
            is_available: true,
            is_featured: true,
        });
        setAccommodationModalOpen(true);
    };

    const openEditAccommodation = (acc) => {
        setEditingAccommodation(acc);
        accommodationForm.setData({
            name: acc.name || '',
            category: acc.category || 'Eco Lodge',
            partner_id: acc.partner_id || '',
            location: acc.location || '',
            price_lkr: acc.price_lkr || 0,
            period: acc.period || 'night',
            rating: acc.rating || 5.0,
            image: acc.image || '',
            amenities_input: Array.isArray(acc.amenities) ? acc.amenities.join(', ') : '',
            description: acc.description || '',
            contact_phone: acc.contact_phone || '',
            contact_email: acc.contact_email || '',
            is_available: acc.is_available ?? true,
            is_featured: acc.is_featured ?? false,
        });
        setAccommodationModalOpen(true);
    };

    const handleAccommodationSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...accommodationForm.data,
            partner_id: accommodationForm.data.partner_id || null,
            amenities: accommodationForm.data.amenities_input.split(',').map(a => a.trim()).filter(Boolean),
        };
        if (editingAccommodation) {
            router.put(`/admin/accommodations/${editingAccommodation.id}`, payload, {
                onSuccess: () => setAccommodationModalOpen(false)
            });
        } else {
            router.post('/admin/accommodations', payload, {
                onSuccess: () => setAccommodationModalOpen(false)
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
            <Head title="Admin Management Portal - Xplor Lanka" />
            <Navbar currentPath="/admin/dashboard" />

            {/* Flash notifications */}
            {flash?.success && (
                <div className="bg-emerald-600 text-white px-4 py-3 text-center text-sm font-bold flex items-center justify-center space-x-2 shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{flash.success}</span>
                </div>
            )}
            {flash?.error && (
                <div className="bg-red-600 text-white px-4 py-3 text-center text-sm font-bold flex items-center justify-center space-x-2 shadow-sm">
                    <XCircle className="w-5 h-5" />
                    <span>{flash.error}</span>
                </div>
            )}

            <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-md">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h1 className="text-2xl font-black text-slate-900">Admin Control Center</h1>
                                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                                    {auth.user.role}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Manage Tours, Accommodations, Vehicles, Blogs, Partners & Verified Reviews</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Link 
                            href="/" 
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View Public Site</span>
                        </Link>
                    </div>
                </div>

                {/* Main Tabs Navigation Bar */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                                    isActive 
                                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black scale-105' 
                                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                                {tab.count !== null && (
                                    <span className={`px-2 py-0.5 text-[10px] rounded-full ${isActive ? 'bg-slate-950 text-amber-400 font-black' : 'bg-slate-100 text-slate-600'}`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ── TAB 1: OVERVIEW ── */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[
                                { title: 'Active Tours', count: tours.length, icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50', tab: 'tours' },
                                { title: 'Accommodations', count: accommodations.length, icon: Bed, color: 'text-indigo-600', bg: 'bg-indigo-50', tab: 'accommodations' },
                                { title: 'Vehicle Fleet', count: vehicles.length, icon: Car, color: 'text-emerald-600', bg: 'bg-emerald-50', tab: 'vehicles' },
                                { title: 'Published Blogs', count: blogs.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', tab: 'blogs' },
                                { title: 'Verified Reviews', count: reviews.length, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50', tab: 'reviews' },
                                { title: 'Partners', count: partners.length, icon: Users, color: 'text-rose-600', bg: 'bg-rose-50', tab: 'partners' },
                            ].map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <div 
                                        key={i} 
                                        onClick={() => setActiveTab(stat.tab)}
                                        className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer space-y-2"
                                    >
                                        <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-black text-slate-900">{stat.count}</div>
                                            <div className="text-xs font-bold text-slate-500">{stat.title}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Quick Action Shortcuts */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">Quick Actions</h3>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/admin/tours/create" className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5">
                                    <PlusCircle className="w-4 h-4" /> <span>Add New Tour</span>
                                </Link>
                                <button onClick={openCreateAccommodation} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5">
                                    <PlusCircle className="w-4 h-4" /> <span>Add Accommodation</span>
                                </button>
                                <button onClick={openCreateVehicle} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5">
                                    <PlusCircle className="w-4 h-4" /> <span>Add Vehicle Fleet</span>
                                </button>
                                <button onClick={openCreateBlog} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5">
                                    <PlusCircle className="w-4 h-4" /> <span>Write SEO Blog Post</span>
                                </button>
                                <button onClick={openCreatePartner} className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5">
                                    <PlusCircle className="w-4 h-4" /> <span>Register New Partner</span>
                                </button>
                                <button onClick={openCreateReview} className="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5">
                                    <PlusCircle className="w-4 h-4" /> <span>Add Verified Review</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Bookings Snapshot */}
                        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-extrabold text-lg text-slate-900">Recent Customer Bookings & Inquiries</h3>
                                    <p className="text-xs text-slate-500">Real-time incoming trip inquiries</p>
                                </div>
                                <button onClick={() => setActiveTab('bookings')} className="text-xs font-bold text-amber-600 hover:text-amber-700">
                                    View All Bookings →
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-3">Customer</th>
                                            <th className="px-6 py-3">Contact</th>
                                            <th className="px-6 py-3">Tour / Request</th>
                                            <th className="px-6 py-3">Start Date</th>
                                            <th className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {recentBookings.slice(0, 5).map(b => (
                                            <tr key={b.id} className="hover:bg-slate-50/60">
                                                <td className="px-6 py-3 font-bold text-slate-900">{b.customer_name}</td>
                                                <td className="px-6 py-3 text-slate-500">{b.customer_phone || b.customer_email}</td>
                                                <td className="px-6 py-3 font-medium text-slate-700">{b.tour?.title || b.service_type || 'Custom Tour'}</td>
                                                <td className="px-6 py-3">{b.start_date || 'TBD'} ({b.guests_count} Guests)</td>
                                                <td className="px-6 py-3">
                                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                                                        b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                                        b.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-amber-100 text-amber-800'
                                                    }`}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 2: TOURS ── */}
                {activeTab === 'tours' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Manage Tour Packages</h2>
                                <p className="text-xs text-slate-500">Create, edit day-by-day itineraries, waypoints, and pricing</p>
                            </div>
                            <Link 
                                href="/admin/tours/create" 
                                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
                            >
                                <PlusCircle className="w-4 h-4" /> <span>Add New Tour</span>
                            </Link>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4">Tour Title & Route</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Price (LKR)</th>
                                            <th className="px-6 py-4">Duration</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {tours.map(tour => (
                                            <tr key={tour.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <img src={tour.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                                                        <div>
                                                            <div className="font-bold text-slate-900 max-w-[240px] truncate">{tour.title}</div>
                                                            <div className="text-xs text-slate-500 max-w-[240px] truncate">{tour.route}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="uppercase text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">{tour.category}</span>
                                                </td>
                                                <td className="px-6 py-4 font-black text-amber-600">
                                                    LKR {Number(tour.price_lkr).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-xs font-medium text-slate-600">{tour.duration}</td>
                                                <td className="px-6 py-4">
                                                    {tour.is_active ? (
                                                        <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold">
                                                            <Eye className="w-3 h-3" /> <span>Active</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center space-x-1 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-bold">
                                                            <EyeOff className="w-3 h-3" /> <span>Hidden</span>
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <Link href={`/admin/tours/${tour.id}/edit`} className="inline-block p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit Tour">
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button onClick={() => deleteItem('tours', tour.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 3: ACCOMMODATIONS CRUD ── */}
                {activeTab === 'accommodations' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Manage Accommodations & Eco Stays</h2>
                                <p className="text-xs text-slate-500">Hotels, boutique villas, tea estate bungalows, and safari glamping</p>
                            </div>
                            <button 
                                onClick={openCreateAccommodation} 
                                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
                            >
                                <PlusCircle className="w-4 h-4" /> <span>Add Accommodation</span>
                            </button>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4">Property & Location</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Partner</th>
                                            <th className="px-6 py-4">Price / Night</th>
                                            <th className="px-6 py-4">Rating</th>
                                            <th className="px-6 py-4">Availability</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {accommodations.map(acc => (
                                            <tr key={acc.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <img src={acc.image || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80'} alt="" className="w-12 h-12 rounded-xl object-cover" />
                                                        <div>
                                                            <div className="font-bold text-slate-900 max-w-[220px] truncate">{acc.name}</div>
                                                            <div className="text-xs text-slate-500 flex items-center space-x-1">
                                                                <MapPin className="w-3 h-3 text-amber-500" />
                                                                <span>{acc.location}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">{acc.category}</span>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                                                    {acc.partner ? acc.partner.name : <span className="text-slate-400">Direct</span>}
                                                </td>
                                                <td className="px-6 py-4 font-black text-amber-600">
                                                    LKR {Number(acc.price_lkr).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-1 text-xs font-bold text-amber-500">
                                                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                                                        <span>{acc.rating}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => updateStatus('accommodations', acc.id, { is_available: !acc.is_available })}
                                                        className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                                                            acc.is_available ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                                        }`}
                                                    >
                                                        {acc.is_available ? 'Available' : 'Unavailable'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button onClick={() => openEditAccommodation(acc)} className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => deleteItem('accommodations', acc.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 4: VEHICLES CRUD ── */}
                {activeTab === 'vehicles' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Manage Vehicle Fleets & Transfers</h2>
                                <p className="text-xs text-slate-500">Cars, KDH vans, luxury SUVs, 4x4 safari jeeps, and coaches</p>
                            </div>
                            <button 
                                onClick={openCreateVehicle} 
                                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
                            >
                                <PlusCircle className="w-4 h-4" /> <span>Add Vehicle</span>
                            </button>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4">Vehicle Name & Key</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Capacity</th>
                                            <th className="px-6 py-4">Rate / KM</th>
                                            <th className="px-6 py-4">Daily Rate</th>
                                            <th className="px-6 py-4">Partner</th>
                                            <th className="px-6 py-4">Availability</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {vehicles.map(v => (
                                            <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                                                            <Car className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900">{v.name}</div>
                                                            <div className="text-xs text-slate-400">{v.vehicle_key}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">{v.vehicle_category}</span>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-medium text-slate-600">
                                                    {v.seats} ({v.luggage_capacity || 4} bags)
                                                </td>
                                                <td className="px-6 py-4 font-black text-amber-600">{v.rate_per_km}</td>
                                                <td className="px-6 py-4 font-semibold text-slate-700">
                                                    {v.daily_rate_lkr ? `LKR ${Number(v.daily_rate_lkr).toLocaleString()}` : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-500">
                                                    {v.partner?.name || 'Direct Fleet'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => updateStatus('vehicles', v.id, { is_available: !v.is_available })}
                                                        className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                                                            v.is_available ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                                        }`}
                                                    >
                                                        {v.is_available ? 'Active' : 'Disabled'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button onClick={() => openEditVehicle(v)} className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => deleteItem('vehicles', v.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 5: BLOGS CRUD (SEO FRIENDLY) ── */}
                {activeTab === 'blogs' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Manage SEO Travel Blog Articles</h2>
                                <p className="text-xs text-slate-500">Publish search-engine optimized guides with meta tags, keywords, and canonical URLs</p>
                            </div>
                            <button 
                                onClick={openCreateBlog} 
                                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
                            >
                                <PlusCircle className="w-4 h-4" /> <span>Write SEO Article</span>
                            </button>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4">Title & Slug</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">SEO Meta Title</th>
                                            <th className="px-6 py-4">Author</th>
                                            <th className="px-6 py-4">Views</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {blogs.map(post => (
                                            <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <img src={post.image || 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=400&q=80'} alt="" className="w-12 h-12 rounded-xl object-cover" />
                                                        <div>
                                                            <div className="font-bold text-slate-900 max-w-[240px] truncate">{post.title}</div>
                                                            <div className="text-xs text-slate-400 font-mono">/{post.slug}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md">{post.category}</span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-600 max-w-[200px] truncate">
                                                    {post.meta_title || <span className="text-slate-400 italic">Auto-generated</span>}
                                                </td>
                                                <td className="px-6 py-4 text-xs font-medium text-slate-700">{post.author}</td>
                                                <td className="px-6 py-4 text-xs font-bold text-slate-700">{post.views_count || 0}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => router.put(`/admin/blogs/${post.id}/publish`, {}, { preserveScroll: true })}
                                                        className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                                                            post.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                                        }`}
                                                    >
                                                        {post.is_published ? 'Published' : 'Draft'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-blue-600 rounded-lg inline-block" title="View Public Article">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                    <button onClick={() => openEditBlog(post)} className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => deleteItem('blogs', post.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 6: REVIEWS CRUD ── */}
                {activeTab === 'reviews' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Manage Verified Reviews</h2>
                                <p className="text-xs text-slate-500">Create, edit, approve, or remove guest ratings across Tours, Accommodations & Vehicles</p>
                            </div>
                            <button 
                                onClick={openCreateReview} 
                                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
                            >
                                <PlusCircle className="w-4 h-4" /> <span>Add Verified Review</span>
                            </button>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4">Guest & Country</th>
                                            <th className="px-6 py-4">Publisher</th>
                                            <th className="px-6 py-4">Target (Tour / Stay / Car)</th>
                                            <th className="px-6 py-4 max-w-xs">Review Content</th>
                                            <th className="px-6 py-4">Rating</th>
                                            <th className="px-6 py-4">Approval</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {reviews.map(rev => (
                                            <tr key={rev.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-900">{rev.customer_name}</div>
                                                    <div className="text-xs text-slate-500">{rev.customer_country || 'International'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {(() => {
                                                        const p = rev.source_platform || 'google';
                                                        const map = {
                                                            google: { label: 'Google', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
                                                            tripadvisor: { label: 'TripAdvisor', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                                                            booking: { label: 'Booking.com', cls: 'bg-sky-50 text-sky-700 border-sky-200' },
                                                            airbnb: { label: 'Airbnb', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
                                                            direct: { label: 'Direct', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
                                                        };
                                                        const info = map[p] || map.google;
                                                        return <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${info.cls}`}>{info.label}</span>;
                                                    })()}
                                                </td>
                                                <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                                                    {rev.tour?.title || rev.accommodation?.name || rev.vehicle?.name || 'General Experience'}
                                                </td>
                                                <td className="px-6 py-4 max-w-xs whitespace-normal">
                                                    {rev.title && <div className="font-bold text-xs text-slate-900 mb-0.5">{rev.title}</div>}
                                                    <div className="text-xs text-slate-600 line-clamp-2">{rev.comment}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-0.5 text-amber-500">
                                                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                                                        <span className="font-bold text-xs ml-1">{rev.rating}.0</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button 
                                                        onClick={() => updateStatus('reviews', rev.id, { is_approved: !rev.is_approved })}
                                                        className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${
                                                            rev.is_approved 
                                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                                                : 'bg-amber-50 border-amber-200 text-amber-700'
                                                        }`}
                                                    >
                                                        {rev.is_approved ? 'Approved' : 'Pending'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button onClick={() => openEditReview(rev)} className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit Review">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => deleteItem('reviews', rev.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 7: PARTNERS CRUD & CONVERT FROM USER ── */}
                {activeTab === 'partners' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Manage Registered Partners</h2>
                                <p className="text-xs text-slate-500">Chauffeur fleet owners, hoteliers, eco retreat hosts, and tour guides</p>
                            </div>
                            <button 
                                onClick={openCreatePartner} 
                                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
                            >
                                <PlusCircle className="w-4 h-4" /> <span>Add New Partner</span>
                            </button>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4">Partner Name & Contact</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4">Location</th>
                                            <th className="px-6 py-4">Linked Fleet / Properties</th>
                                            <th className="px-6 py-4">Rating</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {partners.map(p => (
                                            <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-900">{p.name}</div>
                                                    <div className="text-xs text-slate-500">{p.email} • {p.phone}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md uppercase">
                                                        {p.partner_type ? p.partner_type.replace('_', ' ') : 'Partner'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-medium text-slate-700">{p.location}</td>
                                                <td className="px-6 py-4 text-xs text-slate-600">
                                                    <span>{p.accommodations_count || 0} Stays, {p.vehicles_count || 0} Vehicles</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-1 text-xs font-bold text-amber-500">
                                                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                                                        <span>{p.rating || '5.0'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                                                        p.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                                        p.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-amber-100 text-amber-800'
                                                    }`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button onClick={() => openEditPartner(p)} className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit Partner">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => deleteItem('partners', p.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 8: BOOKINGS ── */}
                {activeTab === 'bookings' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Manage Trip Bookings & Inquiries</h2>
                                <p className="text-xs text-slate-500">Confirm or update status of traveler inquiries</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4">Customer</th>
                                            <th className="px-6 py-4">Tour / Service Requested</th>
                                            <th className="px-6 py-4">Start Date & Guests</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {recentBookings.map(b => (
                                            <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-900">{b.customer_name}</div>
                                                    <div className="text-xs text-slate-500">{b.customer_email} • {b.customer_phone}</div>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-slate-800">
                                                    {b.tour?.title || b.service_type || 'Custom Tour Inquiry'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-900">{b.start_date || 'Flexible'}</div>
                                                    <div className="text-xs text-slate-500">{b.guests_count} Guests</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                                                        b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                                        b.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-amber-100 text-amber-800'
                                                    }`}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    {b.status !== 'confirmed' && (
                                                        <button onClick={() => updateStatus('bookings', b.id, { status: 'confirmed' })} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Confirm">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {b.status !== 'cancelled' && (
                                                        <button onClick={() => updateStatus('bookings', b.id, { status: 'cancelled' })} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Cancel">
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button onClick={() => deleteItem('bookings', b.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TAB 9: USERS (WITH CONVERT TO PARTNER FEATURE) ── */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">User Accounts & Roles</h2>
                                <p className="text-xs text-slate-500">Manage user permissions or convert any registered user directly to a Partner</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4">User Name</th>
                                            <th className="px-6 py-4">Email</th>
                                            <th className="px-6 py-4">Phone</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {users.map(u => (
                                            <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-6 py-4 font-bold text-slate-900">{u.name}</td>
                                                <td className="px-6 py-4 text-slate-600">{u.email}</td>
                                                <td className="px-6 py-4 text-slate-500">{u.phone || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <select 
                                                        value={u.role}
                                                        onChange={(e) => updateRole(u.id, e.target.value)}
                                                        disabled={u.id === auth.user.id}
                                                        className="text-xs font-bold uppercase rounded-lg border-slate-200 px-3 py-1 bg-slate-50"
                                                    >
                                                        <option value="customer">Customer</option>
                                                        <option value="staff">Staff</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    {/* CONVERT USER TO PARTNER BUTTON */}
                                                    <button 
                                                        onClick={() => openConvertUser(u)} 
                                                        className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl transition-all inline-flex items-center space-x-1"
                                                        title="Convert User to Partner"
                                                    >
                                                        <UserCheck className="w-3.5 h-3.5" />
                                                        <span>Make Partner</span>
                                                    </button>
                                                    {u.id !== auth.user.id && (
                                                        <button onClick={() => deleteItem('users', u.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete User">
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

            {/* ════════════════════════════════════════════════════════════════
                MODALS: PARTNER / BLOG / REVIEW / VEHICLE / ACCOMMODATION
            ════════════════════════════════════════════════════════════════ */}

            {/* PARTNER CREATE / EDIT MODAL */}
            {partnerModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 my-8">
                        <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                            <h3 className="font-black text-xl text-slate-900">
                                {editingPartner ? 'Edit Partner Details' : 'Register New Partner'}
                            </h3>
                            <button onClick={() => setPartnerModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handlePartnerSubmit} className="space-y-4 text-xs sm:text-sm">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Partner / Business Name</label>
                                <input
                                    type="text"
                                    required
                                    value={partnerForm.data.name}
                                    onChange={(e) => partnerForm.setData('name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={partnerForm.data.email}
                                        onChange={(e) => partnerForm.setData('email', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        required
                                        value={partnerForm.data.phone}
                                        onChange={(e) => partnerForm.setData('phone', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Partner Type</label>
                                    <select
                                        value={partnerForm.data.partner_type}
                                        onChange={(e) => partnerForm.setData('partner_type', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    >
                                        <option value="vehicle_owner">Vehicle Owner / Fleet</option>
                                        <option value="accommodation_owner">Accommodation / Hotelier</option>
                                        <option value="tour_guide">Tour Guide / Naturalist</option>
                                        <option value="place_owner">Activity Host</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        required
                                        value={partnerForm.data.location}
                                        onChange={(e) => partnerForm.setData('location', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Vehicle or Property Details</label>
                                <input
                                    type="text"
                                    value={partnerForm.data.vehicle_or_property_details}
                                    onChange={(e) => partnerForm.setData('vehicle_or_property_details', e.target.value)}
                                    placeholder="e.g. 5 KDH High-Roof Vans, 3 Prado SUVs"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Base Rate (LKR)</label>
                                    <input
                                        type="number"
                                        value={partnerForm.data.rate_lkr}
                                        onChange={(e) => partnerForm.setData('rate_lkr', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Status</label>
                                    <select
                                        value={partnerForm.data.status}
                                        onChange={(e) => partnerForm.setData('status', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    >
                                        <option value="approved">Approved</option>
                                        <option value="pending">Pending</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={partnerForm.processing}
                                className="w-full py-3 bg-amber-500 hover:bg-amber-600 font-black text-slate-950 rounded-xl shadow-md transition-all"
                            >
                                {editingPartner ? 'Update Partner' : 'Save Partner'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* CONVERT USER TO PARTNER MODAL */}
            {convertUserModalOpen && selectedUserForPartner && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                            <div>
                                <h3 className="font-black text-lg text-slate-900">Make User a Partner</h3>
                                <p className="text-xs text-amber-600 font-bold">{selectedUserForPartner.name} ({selectedUserForPartner.email})</p>
                            </div>
                            <button onClick={() => setConvertUserModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleConvertUserSubmit} className="space-y-4 text-xs sm:text-sm">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Partner Type</label>
                                <select
                                    value={convertUserForm.data.partner_type}
                                    onChange={(e) => convertUserForm.setData('partner_type', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                >
                                    <option value="vehicle_owner">Vehicle Owner / Fleet</option>
                                    <option value="accommodation_owner">Accommodation / Hotelier</option>
                                    <option value="tour_guide">Tour Guide</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Operating Location</label>
                                <input
                                    type="text"
                                    required
                                    value={convertUserForm.data.location}
                                    onChange={(e) => convertUserForm.setData('location', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Vehicle or Property Details</label>
                                <input
                                    type="text"
                                    value={convertUserForm.data.vehicle_or_property_details}
                                    onChange={(e) => convertUserForm.setData('vehicle_or_property_details', e.target.value)}
                                    placeholder="e.g. 2 Vans and 1 Sedan"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={convertUserForm.processing}
                                className="w-full py-3 bg-amber-500 hover:bg-amber-600 font-black text-slate-950 rounded-xl shadow-md transition-all"
                            >
                                Convert & Create Partner Profile
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* BLOG CREATE / EDIT MODAL (SEO FRIENDLY) */}
            {blogModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                            <div>
                                <h3 className="font-black text-xl text-slate-900">
                                    {editingBlog ? 'Edit SEO Blog Article' : 'Create SEO-Optimized Blog Article'}
                                </h3>
                                <p className="text-xs text-slate-500">Includes meta tags, keywords, and canonical configuration</p>
                            </div>
                            <button onClick={() => setBlogModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleBlogSubmit} className="space-y-4 text-xs sm:text-sm">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Article Title</label>
                                <input
                                    type="text"
                                    required
                                    value={blogForm.data.title}
                                    onChange={(e) => {
                                        const newTitle = e.target.value;
                                        blogForm.setData({
                                            ...blogForm.data,
                                            title: newTitle,
                                            slug: editingBlog ? blogForm.data.slug : generateSlugFromTitle(newTitle),
                                            meta_title: editingBlog ? blogForm.data.meta_title : `${newTitle} | Xplor Lanka`
                                        });
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">URL Slug</label>
                                    <input
                                        type="text"
                                        required
                                        value={blogForm.data.slug}
                                        onChange={(e) => blogForm.setData('slug', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                                    <select
                                        value={blogForm.data.category}
                                        onChange={(e) => blogForm.setData('category', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    >
                                        <option value="Travel Guides">Travel Guides</option>
                                        <option value="Wildlife & Safaris">Wildlife & Safaris</option>
                                        <option value="Highland & Trains">Highland & Trains</option>
                                        <option value="Practical Tips">Practical Tips</option>
                                        <option value="Beaches & Coast">Beaches & Coast</option>
                                        <option value="Culture & Heritage">Culture & Heritage</option>
                                    </select>
                                </div>
                            </div>

                            {/* SEO Meta Box */}
                            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-3">
                                <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center space-x-1">
                                    <Globe className="w-3.5 h-3.5 text-amber-600" />
                                    <span>SEO Search Optimization Metadata</span>
                                </span>
                                <div>
                                    <label className="block font-bold text-slate-700 text-xs mb-1">Meta Title Tag (50-60 chars)</label>
                                    <input
                                        type="text"
                                        value={blogForm.data.meta_title}
                                        onChange={(e) => blogForm.setData('meta_title', e.target.value)}
                                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 text-xs mb-1">Meta Description (150-160 chars)</label>
                                    <textarea
                                        rows="2"
                                        value={blogForm.data.meta_description}
                                        onChange={(e) => blogForm.setData('meta_description', e.target.value)}
                                        placeholder="Google search summary snippet..."
                                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 text-xs mb-1">Meta Keywords</label>
                                    <input
                                        type="text"
                                        value={blogForm.data.meta_keywords}
                                        onChange={(e) => blogForm.setData('meta_keywords', e.target.value)}
                                        placeholder="sri lanka travel, tour package, best time to visit"
                                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                                <MediaUploader
                                    value={blogForm.data.image}
                                    onChange={(url) => blogForm.setData('image', url)}
                                    folder="blogs"
                                    label="Featured Article Cover Image"
                                    helpText="Upload from device (PNG, JPG, WEBP) or enter URL below."
                                    isAdmin={true}
                                />
                                <div>
                                    <label className="block font-bold text-slate-500 text-[10px] uppercase mb-1">Or Paste Image URL directly</label>
                                    <input
                                        type="url"
                                        value={blogForm.data.image}
                                        onChange={(e) => blogForm.setData('image', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Excerpt (Short Summary)</label>
                                <textarea
                                    rows="2"
                                    required
                                    value={blogForm.data.excerpt}
                                    onChange={(e) => blogForm.setData('excerpt', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Article Content (HTML/Markdown supported)</label>
                                <textarea
                                    rows="6"
                                    required
                                    value={blogForm.data.content}
                                    onChange={(e) => blogForm.setData('content', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Author Name</label>
                                    <input
                                        type="text"
                                        value={blogForm.data.author}
                                        onChange={(e) => blogForm.setData('author', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Tags (Comma Separated)</label>
                                    <input
                                        type="text"
                                        value={blogForm.data.tags_input}
                                        onChange={(e) => blogForm.setData('tags_input', e.target.value)}
                                        placeholder="Ella, Sigiriya, Train"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="publishCheck"
                                    checked={blogForm.data.is_published}
                                    onChange={(e) => blogForm.setData('is_published', e.target.checked)}
                                    className="w-4 h-4 rounded text-amber-500"
                                />
                                <label htmlFor="publishCheck" className="font-bold text-slate-800">Publish immediately to live website</label>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-amber-500 hover:bg-amber-600 font-black text-slate-950 rounded-xl shadow-md transition-all"
                            >
                                {editingBlog ? 'Update SEO Article' : 'Publish SEO Article'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* REVIEW CREATE / EDIT MODAL */}
            {reviewModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 my-8">
                        <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                            <h3 className="font-black text-xl text-slate-900">
                                {editingReview ? 'Edit Guest Review' : 'Add Verified Guest Review'}
                            </h3>
                            <button onClick={() => setReviewModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs sm:text-sm">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Customer Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={reviewForm.data.customer_name}
                                        onChange={(e) => reviewForm.setData('customer_name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Customer Country</label>
                                    <input
                                        type="text"
                                        value={reviewForm.data.customer_country}
                                        onChange={(e) => reviewForm.setData('customer_country', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
                                    <select
                                        value={reviewForm.data.rating}
                                        onChange={(e) => reviewForm.setData('rating', Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-bold text-amber-600"
                                    >
                                        <option value="5">5 ★★★★★ Excellent</option>
                                        <option value="4">4 ★★★★☆ Very Good</option>
                                        <option value="3">3 ★★★☆☆ Average</option>
                                        <option value="2">2 ★★☆☆☆ Poor</option>
                                        <option value="1">1 ★☆☆☆☆ Terrible</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Source Platform (Publisher)</label>
                                    <select
                                        value={reviewForm.data.source_platform}
                                        onChange={(e) => reviewForm.setData('source_platform', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    >
                                        <option value="google">🔵 Google</option>
                                        <option value="tripadvisor">🟢 TripAdvisor</option>
                                        <option value="booking">🔵 Booking.com</option>
                                        <option value="airbnb">🔴 Airbnb</option>
                                        <option value="direct">⭐ Direct / Internal</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Linked Tour Package</label>
                                    <select
                                        value={reviewForm.data.tour_id}
                                        onChange={(e) => reviewForm.setData('tour_id', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    >
                                        <option value="">-- None / General --</option>
                                        {tours.map(t => (
                                            <option key={t.id} value={t.id}>{t.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Review Headline / Title</label>
                                <input
                                    type="text"
                                    value={reviewForm.data.title}
                                    onChange={(e) => reviewForm.setData('title', e.target.value)}
                                    placeholder="e.g. Unforgettable 14-day family journey"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Review Comment</label>
                                <textarea
                                    rows="4"
                                    required
                                    value={reviewForm.data.comment}
                                    onChange={(e) => reviewForm.setData('comment', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                                <MediaUploader
                                    value={reviewForm.data.media_urls_input ? reviewForm.data.media_urls_input.split('\n').filter(Boolean) : []}
                                    onChange={(urls) => {
                                        const urlArr = Array.isArray(urls) ? urls : [urls];
                                        reviewForm.setData('media_urls_input', urlArr.join('\n'));
                                    }}
                                    folder="reviews"
                                    multiple={true}
                                    label="Guest Experience Photos (MinIO / S3)"
                                    helpText="Upload guest trip photos from device or enter URLs below."
                                    isAdmin={true}
                                />
                                <div>
                                    <label className="block font-bold text-slate-500 text-[10px] uppercase mb-1">Or Paste Photo URLs (one per line)</label>
                                    <textarea
                                        rows="2"
                                        value={reviewForm.data.media_urls_input}
                                        onChange={(e) => reviewForm.setData('media_urls_input', e.target.value)}
                                        placeholder="https://images.unsplash.com/photo-..."
                                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-xs"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="approveCheck"
                                    checked={reviewForm.data.is_approved}
                                    onChange={(e) => reviewForm.setData('is_approved', e.target.checked)}
                                    className="w-4 h-4 rounded text-amber-500"
                                />
                                <label htmlFor="approveCheck" className="font-bold text-slate-800">Approved for display on website</label>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setReviewModalOpen(false)}
                                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 rounded-xl transition-all"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 font-black text-slate-950 rounded-xl shadow-md transition-all"
                                >
                                    {editingReview ? 'Update Review' : 'Save Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* VEHICLE CREATE / EDIT MODAL */}
            {vehicleModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                            <h3 className="font-black text-xl text-slate-900">
                                {editingVehicle ? 'Edit Vehicle Fleet' : 'Add Vehicle to Fleet'}
                            </h3>
                            <button onClick={() => setVehicleModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleVehicleSubmit} className="space-y-4 text-xs sm:text-sm">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Vehicle Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={vehicleForm.data.name}
                                        onChange={(e) => vehicleForm.setData('name', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Unique Key</label>
                                    <input
                                        type="text"
                                        required
                                        value={vehicleForm.data.vehicle_key}
                                        onChange={(e) => vehicleForm.setData('vehicle_key', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                                    <select
                                        value={vehicleForm.data.vehicle_category}
                                        onChange={(e) => vehicleForm.setData('vehicle_category', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    >
                                        <option value="Sedan / Car">Sedan / Car</option>
                                        <option value="Luxury SUV">Luxury SUV</option>
                                        <option value="Passenger Van">Passenger Van</option>
                                        <option value="4x4 Safari Jeep">4x4 Safari Jeep</option>
                                        <option value="Mini Coach / Bus">Mini Coach / Bus</option>
                                        <option value="Tuk-Tuk / Three-Wheeler">Tuk-Tuk / Three-Wheeler</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Partner</label>
                                    <select
                                        value={vehicleForm.data.partner_id}
                                        onChange={(e) => vehicleForm.setData('partner_id', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    >
                                        <option value="">-- Direct Fleet --</option>
                                        {partners.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Passenger Seats</label>
                                    <input
                                        type="text"
                                        value={vehicleForm.data.seats}
                                        onChange={(e) => vehicleForm.setData('seats', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Luggage Bags Capacity</label>
                                    <input
                                        type="number"
                                        value={vehicleForm.data.luggage_capacity}
                                        onChange={(e) => vehicleForm.setData('luggage_capacity', Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Rate Per KM</label>
                                    <input
                                        type="text"
                                        required
                                        value={vehicleForm.data.rate_per_km}
                                        onChange={(e) => vehicleForm.setData('rate_per_km', e.target.value)}
                                        placeholder="Rs. 140 / km"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Daily Rate (LKR)</label>
                                    <input
                                        type="number"
                                        value={vehicleForm.data.daily_rate_lkr}
                                        onChange={(e) => vehicleForm.setData('daily_rate_lkr', Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                                <MediaUploader
                                    value={vehicleForm.data.image}
                                    onChange={(url) => vehicleForm.setData('image', url)}
                                    folder="vehicles"
                                    label="Vehicle Fleet Cover Photo (MinIO / S3)"
                                    helpText="Upload vehicle photo directly from device or enter URL below."
                                    isAdmin={true}
                                />
                                <div>
                                    <label className="block font-bold text-slate-500 text-[10px] uppercase mb-1">Or Paste Image URL directly</label>
                                    <input
                                        type="url"
                                        value={vehicleForm.data.image}
                                        onChange={(e) => vehicleForm.setData('image', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Description & Features</label>
                                <textarea
                                    rows="2"
                                    value={vehicleForm.data.description}
                                    onChange={(e) => vehicleForm.setData('description', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <label className="flex items-center space-x-2 font-bold text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={vehicleForm.data.driver_included}
                                        onChange={(e) => vehicleForm.setData('driver_included', e.target.checked)}
                                        className="rounded text-amber-500"
                                    />
                                    <span>Driver Included</span>
                                </label>
                                <label className="flex items-center space-x-2 font-bold text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={vehicleForm.data.ac_available}
                                        onChange={(e) => vehicleForm.setData('ac_available', e.target.checked)}
                                        className="rounded text-amber-500"
                                    />
                                    <span>A/C Available</span>
                                </label>
                                <label className="flex items-center space-x-2 font-bold text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={vehicleForm.data.is_available}
                                        onChange={(e) => vehicleForm.setData('is_available', e.target.checked)}
                                        className="rounded text-amber-500"
                                    />
                                    <span>Available</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-amber-500 hover:bg-amber-600 font-black text-slate-950 rounded-xl shadow-md transition-all"
                            >
                                {editingVehicle ? 'Update Vehicle' : 'Save Vehicle to Fleet'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ACCOMMODATION CREATE / EDIT MODAL */}
            {accommodationModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                            <h3 className="font-black text-xl text-slate-900">
                                {editingAccommodation ? 'Edit Accommodation' : 'Add New Accommodation'}
                            </h3>
                            <button onClick={() => setAccommodationModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAccommodationSubmit} className="space-y-4 text-xs sm:text-sm">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Property Name</label>
                                <input
                                    type="text"
                                    required
                                    value={accommodationForm.data.name}
                                    onChange={(e) => accommodationForm.setData('name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                                    <select
                                        value={accommodationForm.data.category}
                                        onChange={(e) => accommodationForm.setData('category', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    >
                                        <option value="Eco Lodge">Eco Lodge</option>
                                        <option value="Boutique Villa">Boutique Villa</option>
                                        <option value="Safari Glamping">Safari Glamping</option>
                                        <option value="Heritage Bungalow">Heritage Bungalow</option>
                                        <option value="Beach Resort">Beach Resort</option>
                                        <option value="Hotel">Hotel</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Partner</label>
                                    <select
                                        value={accommodationForm.data.partner_id}
                                        onChange={(e) => accommodationForm.setData('partner_id', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    >
                                        <option value="">-- Direct Hospitality --</option>
                                        {partners.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        required
                                        value={accommodationForm.data.location}
                                        onChange={(e) => accommodationForm.setData('location', e.target.value)}
                                        placeholder="Ella, Hill Country"
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Price Per Night (LKR)</label>
                                    <input
                                        type="number"
                                        required
                                        value={accommodationForm.data.price_lkr}
                                        onChange={(e) => accommodationForm.setData('price_lkr', Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                                <MediaUploader
                                    value={accommodationForm.data.image}
                                    onChange={(url) => accommodationForm.setData('image', url)}
                                    folder="accommodations"
                                    label="Property Cover Photo (MinIO / S3)"
                                    helpText="Upload hotel or villa photo directly from device or enter URL below."
                                    isAdmin={true}
                                />
                                <div>
                                    <label className="block font-bold text-slate-500 text-[10px] uppercase mb-1">Or Paste Image URL directly</label>
                                    <input
                                        type="url"
                                        value={accommodationForm.data.image}
                                        onChange={(e) => accommodationForm.setData('image', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Amenities (Comma separated)</label>
                                <input
                                    type="text"
                                    value={accommodationForm.data.amenities_input}
                                    onChange={(e) => accommodationForm.setData('amenities_input', e.target.value)}
                                    placeholder="Mountain View, Infinity Pool, Breakfast, Wi-Fi"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    rows="3"
                                    value={accommodationForm.data.description}
                                    onChange={(e) => accommodationForm.setData('description', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <label className="flex items-center space-x-2 font-bold text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={accommodationForm.data.is_available}
                                        onChange={(e) => accommodationForm.setData('is_available', e.target.checked)}
                                        className="rounded text-amber-500"
                                    />
                                    <span>Available</span>
                                </label>
                                <label className="flex items-center space-x-2 font-bold text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={accommodationForm.data.is_featured}
                                        onChange={(e) => accommodationForm.setData('is_featured', e.target.checked)}
                                        className="rounded text-amber-500"
                                    />
                                    <span>Featured Stay</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-amber-500 hover:bg-amber-600 font-black text-slate-950 rounded-xl shadow-md transition-all"
                            >
                                {editingAccommodation ? 'Update Accommodation' : 'Save Accommodation'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
