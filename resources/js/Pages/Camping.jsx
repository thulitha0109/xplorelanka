import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { MapPin, Tent, Utensils, Clock, CheckCircle2, MessageCircle } from 'lucide-react';

export default function Camping({ campingLocations = [] }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans">
            <Head title="Wilderness Camping Experiences in Sri Lanka - Xplor Lanka" />
            <Navbar currentPath="/camping" />

            <main className="flex-grow py-12 container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
                    <span className="text-amber-500 font-bold text-sm tracking-wider uppercase">Unplug in Nature</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Wilderness Camping in Sri Lanka</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-base">
                        From high-altitude cloud forests in Knuckles to wild national park buffer zones in Yala and forest edges in Wilpattu.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {campingLocations.map((camp) => (
                        <div key={camp.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all flex flex-col justify-between">
                            <div>
                                <div className="h-64 relative overflow-hidden">
                                    <img src={camp.image} alt={camp.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                        <h3 className="text-2xl font-bold">{camp.title}</h3>
                                        <p className="text-xs text-slate-300 flex items-center space-x-1 mt-1">
                                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                                            <span>{camp.location}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4 text-xs">
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5 mb-2">
                                            <Tent className="w-4 h-4 text-amber-500" />
                                            <span>Camping Styles</span>
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {camp.types?.map((t, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-medium">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5 mb-2">
                                            <Utensils className="w-4 h-4 text-amber-500" />
                                            <span>Package Inclusions</span>
                                        </h4>
                                        <ul className="grid grid-cols-2 gap-1.5 text-slate-600 dark:text-slate-400">
                                            {camp.inclusions?.map((inc, idx) => (
                                                <li key={idx} className="flex items-center space-x-1">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                    <span>{inc}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
                                <div>
                                    <div className="text-xs text-slate-400">Starting from</div>
                                    <div className="text-lg font-black text-amber-500">LKR {Number(camp.starting_price_lkr).toLocaleString()}</div>
                                </div>
                                <a
                                    href={`https://wa.me/94763762763?text=${encodeURIComponent('Hello Xplor Lanka! I want to inquire about camping at ' + camp.title)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center space-x-1.5 shadow-md"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Inquire Camping</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
