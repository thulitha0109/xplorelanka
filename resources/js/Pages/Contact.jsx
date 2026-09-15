import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Phone, Mail, MapPin, MessageCircle, CheckCircle2 } from 'lucide-react';

export default function Contact() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/bookings', {
            onSuccess: (page) => {
                reset();
                if (page.props.flash?.whatsapp_url) {
                    window.open(page.props.flash.whatsapp_url, '_blank');
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans">
            <Head title="Contact Us - Xplor Lanka" />
            <Navbar currentPath="/contact" />

            {flash?.success && (
                <div className="bg-emerald-600 text-white px-4 py-3 text-center text-sm font-semibold flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}

            <main className="flex-grow py-12 container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
                    <span className="text-amber-500 font-bold text-sm tracking-wider uppercase">We Are Here For You</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Contact Xplor Lanka</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-base">
                        Have questions or need assistance planning your Sri Lankan trip? Get in touch via WhatsApp, phone, or email.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                    {/* Contact Cards */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-base">Call / WhatsApp</h4>
                                    <a href="tel:+94763762763" className="text-amber-500 font-bold hover:underline text-sm">+94 76 376 2763</a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-base">Email Us</h4>
                                    <a href="mailto:info@xplorelanka.com" className="text-amber-500 font-bold hover:underline text-sm">info@xplorelanka.com</a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-base">Headquarters Address</h4>
                                    <p className="text-xs text-slate-500">99 Augustawatta, Kandy, Sri Lanka</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white border-b pb-3 border-slate-200 dark:border-slate-800">
                            Send Us a Message
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={data.customer_email}
                                    onChange={(e) => setData('customer_email', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone / WhatsApp</label>
                                <input
                                    type="text"
                                    required
                                    value={data.customer_phone}
                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Message</label>
                                <textarea
                                    rows="3"
                                    required
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>Send & Launch WhatsApp</span>
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
