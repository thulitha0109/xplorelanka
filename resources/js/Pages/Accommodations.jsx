import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { MapPin, Star, Bed, Wifi, Coffee, MessageCircle } from 'lucide-react';

export default function Accommodations({ accommodations = [] }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans">
            <Head title="Eco Lodges, Cabins & Stays - Xplor Lanka" />
            <Navbar currentPath="/accommodations" />

            <main className="flex-grow py-12 container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
                    <span className="text-amber-500 font-bold text-sm tracking-wider uppercase">Authentic Stays</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Eco Lodges & Boutique Cabins</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-base">
                        Handpicked eco-friendly wooden cabins, hillside tea lodges, and heritage homestays with stunning mountain panoramas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {accommodations.map((acc) => (
                        <div key={acc.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
                            <div>
                                <div className="h-52 relative overflow-hidden">
                                    <img src={acc.image} alt={acc.name} className="w-full h-full object-cover" />
                                    <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-md capitalize">
                                        {acc.category}
                                    </span>
                                </div>
                                <div className="p-6 space-y-3">
                                    <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                                        <Star className="w-4 h-4 fill-amber-500" />
                                        <span>{acc.rating}</span>
                                        <span className="text-slate-400">({acc.reviews_count} reviews)</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{acc.name}</h3>
                                    <p className="text-xs text-slate-500 flex items-center space-x-1">
                                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                        <span>{acc.location}</span>
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{acc.description}</p>
                                </div>
                            </div>
                            <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
                                <div>
                                    <div className="text-xs text-slate-400">Rate per night</div>
                                    <div className="text-lg font-black text-amber-500">LKR {Number(acc.price_lkr).toLocaleString()}</div>
                                </div>
                                <a
                                    href={`https://wa.me/94763762763?text=${encodeURIComponent('Hello Xplor Lanka! I would like to inquire about booking stay at ' + acc.name)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center space-x-1"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Inquire Stay</span>
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
