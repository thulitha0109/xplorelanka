import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { 
    Phone, MapPin, Menu, X, ShieldCheck, User, LogOut,
    ChevronDown, Compass, LayoutDashboard
} from 'lucide-react';

export default function Navbar({ currentPath = '/' }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Tours', href: '/tours' },
        { name: 'Camping', href: '/camping' },
        { name: 'Accommodations', href: '/accommodations' },
        { name: 'Vehicles & Transfers', href: '/vehicles' },
        { name: 'Trip Planner', href: '/planner' },
        { name: 'Blog', href: '/blog' },
        { name: 'Become a Partner', href: '/partner' },
    ];

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-sm">
            {/* Top Contact Bar */}
            <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <a href="tel:+94763762763" className="flex items-center space-x-1.5 hover:text-amber-400 transition-colors">
                            <Phone className="w-3.5 h-3.5 text-amber-500" />
                            <span>+94 76 376 2763</span>
                        </a>
                        <div className="hidden sm:flex items-center space-x-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-500" />
                            <span>Kandy, Sri Lanka</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="hidden md:inline-block text-slate-400">Authentic Sri Lankan Travel Experiences</span>
                        {auth?.user?.role && ['admin', 'staff'].includes(auth.user.role) && (
                            <Link href="/admin/dashboard" className="inline-flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-medium">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Admin Portal</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                            <Compass className="w-5 h-5 text-slate-950" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                            XPLOR <span className="text-amber-500">LANKA</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-semibold transition-colors hover:text-amber-500 ${
                                    currentPath === link.href
                                        ? 'text-amber-500 font-bold border-b-2 border-amber-500 pb-1'
                                        : 'text-slate-700 dark:text-slate-200'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-3">
                        <a
                            href="https://wa.me/94763762763"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
                        >
                            WhatsApp
                        </a>

                        {/* Auth State */}
                        {auth?.user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl px-3 py-2 transition-all"
                                >
                                    <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 font-black text-xs">
                                        {getInitial(auth.user.name)}
                                    </div>
                                    <span className="hidden md:block text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                                        {auth.user.name}
                                    </span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2 z-50">
                                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                                            <p className="text-xs text-slate-500">Signed in as</p>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{auth.user.email}</p>
                                            <span className={`inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                                auth.user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                                auth.user.role === 'staff' ? 'bg-blue-100 text-blue-700' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>{auth.user.role}</span>
                                        </div>
                                        <Link
                                            href="/my-account"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <LayoutDashboard className="w-4 h-4 text-slate-400" />
                                            <span>My Account</span>
                                        </Link>
                                        {auth.user.role && ['admin', 'staff'].includes(auth.user.role) && (
                                            <Link
                                                href="/admin/dashboard"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <ShieldCheck className="w-4 h-4 text-amber-500" />
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        )}
                                        <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center space-x-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-500 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-all"
                                >
                                    Join Free
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                                currentPath === link.href
                                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                                    : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                        {auth?.user ? (
                            <>
                                <Link href="/my-account" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                                    My Account ({auth.user.name})
                                </Link>
                                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-center text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg">
                                    Sign In
                                </Link>
                                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm font-bold text-center text-slate-950 bg-amber-500 rounded-lg">
                                    Join Free
                                </Link>
                            </>
                        )}
                        <a
                            href="https://wa.me/94763762763"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center block px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg"
                        >
                            WhatsApp Inquiry
                        </a>
                    </div>
                </div>
            )}

            {/* Overlay for user menu close */}
            {userMenuOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
            )}
        </header>
    );
}
