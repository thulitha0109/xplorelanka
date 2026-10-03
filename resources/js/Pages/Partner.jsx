import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Car, Building2, Users, CheckCircle2, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';

export default function Partner() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        partner_type: 'vehicle_owner',
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
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
            <Head title="Become a Partner - Driver & Hotelier Onboarding - Xplor Lanka" />
            <Navbar currentPath="/partner" />

            {flash?.success && (
                <div className="bg-emerald-600 text-white px-4 py-3 text-center text-sm font-semibold flex items-center justify-center space-x-2 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}

            <main className="flex-grow py-12 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
                    <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider rounded-full">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Grow Your Tourism Business</span>
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900">Join Xplor Lanka Partner Network</h1>
                    <p className="text-slate-600 text-base max-w-2xl mx-auto">
                        Are you a licensed tourist driver, boutique hotel owner, eco lodge manager, or certified guide? Partner with us to host international travelers.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Partner Type</label>
                            <select
                                value={data.partner_type}
                                onChange={(e) => setData('partner_type', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                            >
                                <option value="vehicle_owner">Tourist Chauffeur / Vehicle Owner</option>
                                <option value="accommodation_owner">Hotelier / Eco Lodge Owner</option>
                                <option value="tour_guide">Licensed Tour Guide</option>
                                <option value="place_owner">Camping & Activity Provider</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Full Name / Business Contact</label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Sunil Perera"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="sunil@example.com"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                                <input
                                    type="text"
                                    required
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+94 77 123 4567"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Operating Base / City</label>
                                <input
                                    type="text"
                                    required
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="e.g. Kandy / Colombo / Ella"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Vehicle Fleet or Property Details</label>
                            <input
                                type="text"
                                value={data.vehicle_or_property_details}
                                onChange={(e) => setData('vehicle_or_property_details', e.target.value)}
                                placeholder="e.g. 2 KDH Vans, 1 Sedan / 8-Room Eco Villa"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Message / Experience Overview</label>
                            <textarea
                                rows="3"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                placeholder="Tell us about your experience and tour licenses..."
                                className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-slate-50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 font-black text-slate-950 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Submit Partner Application</span>
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
