import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Phone, Mail, MapPin, MessageCircle, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import SeoHead from '../Components/SeoHead';

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
            <SeoHead
                title="Contact Xplore Lanka in Kandy | WhatsApp, Call or Email Us"
                description="Reach Xplore Lanka's Kandy office via WhatsApp (+94 76 376 2763), email or contact form. Get instant help planning a custom Sri Lanka itinerary, private transfer or guided tour."
                keywords="contact Xplore Lanka, WhatsApp Xplore Lanka, Sri Lanka tour agency phone, Kandy travel company email, book Sri Lanka tour, Xplore Lanka WhatsApp number"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Contact', url: '/contact' }
                ]}
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'ContactPage',
                    name: 'Contact Xplore Lanka Tours',
                    mainEntity: { '@id': 'https://xplorelanka.com/#organization' }
                }}
            />
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
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Contact Xplore Lanka</h1>
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

                    {/* Rich Inquiry & Booking Box */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5">
                            <h3 className="font-extrabold text-xl text-white flex items-center space-x-2">
                                <Sparkles className="w-5 h-5 text-amber-400" />
                                <span>Book or Inquire Now</span>
                            </h3>
                            <p className="text-white/60 text-xs mt-1">Connect with our local team in Kandy, Sri Lanka to plan your trip.</p>
                            <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-white/10 text-[10px] text-white/60">
                                <span className="flex items-center space-x-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Direct Local Agency</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                    <span>5.0 Rating</span>
                                </span>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 space-y-5">
                            {/* ── SEPARATE WHATSAPP DIRECT METHOD (No user phone/form required) ── */}
                            <div>
                                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block mb-2">Contact us directly on WhatsApp</span>
                                <a
                                    href={`https://wa.me/94763762763?text=${encodeURIComponent(
                                        "Hi Xplore Lanka! I'd like to book a tour or ask for a custom itinerary. Could you please share more information?"
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-extrabold">Book via WhatsApp</div>
                                            <div className="text-[11px] text-white/80 font-medium">Direct to Concierge &bull; No form needed</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </a>
                            </div>

                            {/* ── Divider ── */}
                            <div className="flex items-center space-x-3">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">or submit online inquiry</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
                            </div>

                            {/* ── Form ── */}
                            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px] uppercase tracking-wide">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        placeholder="e.g. Sarah Jenkins"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px] uppercase tracking-wide">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={data.customer_email}
                                            onChange={(e) => setData('customer_email', e.target.value)}
                                            placeholder="sarah@example.com"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px] uppercase tracking-wide">
                                            Phone <span className="text-slate-400 font-normal lowercase">(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.customer_phone}
                                            onChange={(e) => setData('customer_phone', e.target.value)}
                                            placeholder="+44 7911 123456"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px] uppercase tracking-wide">Message / Travel Requirements</label>
                                    <textarea
                                        rows="3"
                                        required
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Destinations, travel dates, number of people, preferred vehicle type..."
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-black text-slate-950 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 hover:-translate-y-0.5"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{processing ? 'Submitting...' : 'Send Inquiry Message'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
