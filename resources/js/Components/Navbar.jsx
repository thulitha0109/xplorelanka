import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { 
    Phone, MapPin, Menu, X, ShieldCheck, User, LogOut,
    LayoutDashboard
} from 'lucide-react';

function WhatsAppMark({ className = 'h-5 w-5' }) {
    return (
        <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="currentColor">
            <path d="M16.02 3.2a12.52 12.52 0 0 0-10.7 19.02L3.2 28.8l6.74-2.1A12.52 12.52 0 1 0 16.02 3.2Zm0 22.78c-1.9 0-3.76-.5-5.4-1.46l-.39-.23-4 .1.1-3.9-.25-.4a10.18 10.18 0 1 1 9.94 5.89Zm5.58-7.62c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15s-.78.98-.95 1.18c-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.23-.25-.58-.5-.5-.68-.51h-.58c-.2 0-.53.07-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.72.63.72.23 1.37.2 1.88.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
        </svg>
    );
}

export default function Navbar({ currentPath = '/' }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Tours', href: '/tours' },
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

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white text-slate-800 shadow-md">
            {/* Top Contact Bar */}
            <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <a href="tel:+94763762763" className="flex items-center space-x-1.5 hover:text-amber-300 transition-colors">
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
                    <Link href="/" className="flex items-center space-x-2" aria-label="Xplore Lanka home">
                        <img
                            src="/images/legacy/logo.png"
                            alt="Xplore Lanka"
                            className="h-11 w-auto max-w-[180px] object-contain"
                        />
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
                                        : 'text-slate-700'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <a
                            href="https://wa.me/94763762763"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Chat with Xplore Lanka on WhatsApp"
                            title="Chat on WhatsApp"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm transition duration-200 hover:scale-105 hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                        >
                            <WhatsAppMark />
                        </a>

                        {/* Auth State */}
                        {auth?.user ? (
                            <div className="relative hidden lg:block">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    aria-label="Open account menu"
                                    aria-expanded={userMenuOpen}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition duration-200 hover:scale-105 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
                                >
                                    <User className="h-5 w-5" />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                                        <div className="px-4 py-2 border-b border-slate-100 mb-1">
                                            <p className="text-xs text-slate-500">Signed in as</p>
                                            <p className="text-sm font-bold text-slate-800 truncate">{auth.user.email}</p>
                                            <span className={`inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                                auth.user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                                auth.user.role === 'staff' ? 'bg-blue-100 text-blue-700' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>{auth.user.role}</span>
                                        </div>
                                        <Link
                                            href="/my-account"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 transition-colors"
                                        >
                                            <LayoutDashboard className="w-4 h-4 text-slate-400" />
                                            <span>My Account</span>
                                        </Link>
                                        {auth.user.role && ['admin', 'staff'].includes(auth.user.role) && (
                                            <Link
                                                href="/admin/dashboard"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 transition-colors"
                                            >
                                                <ShieldCheck className="w-4 h-4 text-amber-500" />
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        )}
                                        <div className="border-t border-slate-100 mt-1 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden lg:block">
                                <Link
                                    href="/login"
                                    aria-label="Sign in to your account"
                                    title="Sign in"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition duration-200 hover:scale-105 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
                                >
                                    <User className="h-5 w-5" />
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-navigation-drawer"
                            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition duration-200 hover:border-amber-300 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
                        >
                            <span className={`transition-transform duration-300 ease-out ${mobileMenuOpen ? 'rotate-90' : 'rotate-0'}`}>
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating mobile navigation drawer */}
            <>
                <button
                    type="button"
                    tabIndex={mobileMenuOpen ? 0 : -1}
                    aria-label="Close navigation menu"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`fixed inset-0 z-[55] bg-slate-950/35 backdrop-blur-[2px] transition-opacity duration-300 ease-out lg:hidden ${mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                />
                <div
                    id="mobile-navigation-drawer"
                    aria-hidden={!mobileMenuOpen}
                    inert={!mobileMenuOpen}
                    className={`fixed right-3 top-[5.5rem] z-[60] flex max-h-[calc(100dvh-6.5rem)] w-[min(22rem,calc(100vw-1.5rem))] flex-col overflow-y-auto rounded-3xl border border-white/70 bg-white/95 p-4 shadow-[0_24px_80px_-20px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${mobileMenuOpen ? 'visible translate-x-0 scale-100 opacity-100' : 'invisible translate-x-5 scale-[0.97] opacity-0 pointer-events-none'}`}
                >
                    <div className="mb-3 flex items-center justify-between border-b border-slate-100 px-2 pb-3">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-600">Explore Sri Lanka</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">Where would you like to go?</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            aria-label="Close navigation menu"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`group flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-semibold transition-all duration-200 ${
                                currentPath === link.href
                                    ? 'translate-x-1 bg-amber-50 text-amber-800'
                                    : 'text-slate-700 hover:translate-x-1 hover:bg-slate-50 hover:text-slate-950'
                            }`}
                        >
                            {link.name}
                            <span className="text-slate-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-amber-500">→</span>
                        </Link>
                    ))}
                    <div className="mt-3 space-y-2 border-t border-slate-100 pt-4">
                        {auth?.user ? (
                            <>
                                <Link href="/my-account" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-amber-50 hover:text-amber-800">
                                    <User className="h-4 w-4" />
                                    <span className="truncate">{auth.user.name || 'My Account'}</span>
                                </Link>
                                <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50">
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800">
                                <User className="h-4 w-4" />
                                Sign in to your account
                            </Link>
                        )}
                        <a
                            href="https://wa.me/94763762763"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700"
                        >
                            <WhatsAppMark className="h-5 w-5" />
                            Chat with a local expert
                        </a>
                    </div>
                </div>
            </>

            {/* Overlay for user menu close */}
            {userMenuOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
            )}
        </header>
    );
}
