import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Car, Building2, Users, CheckCircle2, MessageCircle } from 'lucide-react';

export default function Partner() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        partner_type: 'driver',
        location: '',
        vehicle_or_property_details: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/partner-applications', {
            onSuccess: () => reset()
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans">
            <Head title="Become a Partner - Driver & Hotelier Onboarding - Xplor Lanka" />
            <Navbar currentPath="/partner" />

            {flash?.success && (
                <div className="bg-emerald-600 text-white px-4 py-3 text-center text-sm font-semibold flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}

            <main className="flex-grow py-12 container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
                    <span className="text-amber-500 font-bold text-sm tracking-wider uppercase">Grow With Us</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Join Xplor Lanka Partner Network</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-base">
                        Are you a licensed tourist driver, boutique hotel owner, eco lodge manager, or local guide? Partner with us to host international travelers.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                        <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Partner Type</label>
                            <select
                                value={data.partner_type}
                                onChange={(e) => setData('partner_type', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-medium"
                            >
                                <option value="driver">Tourist Chauffeur / Driver</option>
                                <option value="hotelier">Hotelier / Eco Lodge Owner</option>
                                <option value="tour_guide">Licensed Tour Guide</option>
                                <option value="activity_provider">Camping / Activity Provider</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone / WhatsApp</label>
                                <input
                                    type="text"
                                    required
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Operating Location / City</label>
                                <input
                                    type="text"
                                    required
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                    placeholder="e.g. Kandy, Ella, Colombo"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Vehicle / Property Details</label>
                            <input
                                type="text"
                                value={data.vehicle_or_property_details}
                                onChange={(e) => setData('vehicle_or_property_details', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                placeholder="e.g. KDH High-Roof Van / 6 Room Eco Lodge"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Message / Additional Info</label>
                            <textarea
                                rows="3"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-bold rounded-xl shadow-md transition-all"
                        >
                            Submit Partner Application
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
