import React from 'react';
import { Link } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import SeoHead from '../Components/SeoHead';
import { ShieldCheck, Heart, Award, Users, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans">
            <SeoHead
                title="About Xplore Lanka | Local Sri Lanka Tour Operator in Kandy Since 2016"
                description="Xplore Lanka is a 5.0★-rated Kandy travel operator founded in 2016. Meet our licensed chauffeur guides, see our certified tourist fleet, and learn why 39+ travelers trust us for custom Sri Lanka tours."
                keywords="about Xplore Lanka, Kandy travel company, Sri Lanka local tour operator, trusted Sri Lanka tour agency, Xplore Lanka reviews, who is Xplore Lanka"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'About', url: '/about' }
                ]}
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'AboutPage',
                    name: 'About Xplore Lanka Tours',
                    description: 'Kandy-based tour operator founded in 2016 with a 5.0★ Google rating.',
                    about: { '@id': 'https://xplorelanka.com/#organization' }
                }}
            />
            <Navbar currentPath="/about" />

            <main className="flex-grow py-16 container mx-auto px-4 space-y-16">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                    <span className="text-amber-500 font-bold text-sm tracking-wider uppercase">Our Story</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Connecting You to Authentic Sri Lanka</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                        Xplore Lanka is a premiere Sri Lankan travel agency headquartered in Kandy. We specialize in personalized itineraries, boutique stays, chauffeur transfers, and authentic Ceylon hospitality.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-sm">
                        <ShieldCheck className="w-10 h-10 text-amber-500 mx-auto" />
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Safety & Trust</h3>
                        <p className="text-xs text-slate-500">Fully licensed tourist vehicles, certified mountain guides, and 24/7 guest support.</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-sm">
                        <Heart className="w-10 h-10 text-amber-500 mx-auto" />
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Authentic Local Touch</h3>
                        <p className="text-xs text-slate-500">Curated village homestays, traditional meals, and off-the-beaten-path mountain trails.</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-sm">
                        <Award className="w-10 h-10 text-amber-500 mx-auto" />
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Top Guest Reviews</h3>
                        <p className="text-xs text-slate-500">5.0★ Google rating from 39 verified reviews across custom tours and private transfers.</p>
                    </div>
                </div>

                {/* Direct Booking & Planning CTA */}
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center md:justify-start space-x-1.5">
                            <Sparkles className="w-4 h-4" />
                            <span>Direct Sri Lanka Concierge</span>
                        </span>
                        <h3 className="text-2xl font-black">Plan Your Custom Journey With Us</h3>
                        <p className="text-white/70 text-sm max-w-lg">
                            Message our local team on WhatsApp for an instant custom tour quote with private driver and hotel bookings.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                        <a
                            href={`https://wa.me/94763762763?text=${encodeURIComponent(
                                "Hi Xplore Lanka! I'd like to plan a custom Sri Lanka trip. Could you share some recommendations?"
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>Book on WhatsApp</span>
                        </a>
                        <Link
                            href="/planner"
                            className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
                        >
                            <span>Open Trip Planner</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
