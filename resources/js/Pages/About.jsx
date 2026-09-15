import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { ShieldCheck, Heart, Award, Users } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans">
            <Head title="About Us - Xplor Lanka" />
            <Navbar currentPath="/about" />

            <main className="flex-grow py-16 container mx-auto px-4 space-y-16">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                    <span className="text-amber-500 font-bold text-sm tracking-wider uppercase">Our Story</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Connecting You to Authentic Sri Lanka</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                        Xplor Lanka is a premiere Sri Lankan travel agency headquartered in Kandy. We specialize in personalized itineraries, wilderness camping, chauffeur transfers, and authentic Ceylon hospitality.
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
                        <p className="text-xs text-slate-500">Over 1,000 satisfied global travelers rating us 4.9★ across tours and camping trips.</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
