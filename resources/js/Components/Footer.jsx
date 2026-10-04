import React from 'react';
import { Link } from '@inertiajs/react';
import { Phone, Mail, MapPin, Globe, Compass, ShieldCheck, Share2, MessageCircle } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white text-slate-700 pt-16 pb-12 border-t border-slate-200">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand Column */}
                    <div>
                        <div className="inline-flex rounded-xl bg-white px-3 py-2 mb-4">
                            <img
                                src="/images/legacy/logo.png"
                                alt="Xplore Lanka"
                                className="h-14 w-auto max-w-[220px] object-contain object-left"
                            />
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6">
                            Personalized Sri Lanka tour packages, private vehicle hires, and curated eco stays across Sri Lanka.
                        </p>
                        <div className="flex space-x-3">
                            <a href="https://www.facebook.com/xplorelanka" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-amber-400 hover:text-slate-950 transition-colors">
                                <Share2 className="w-4 h-4" />
                            </a>
                            <a href="https://www.instagram.com/xplorelanka" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-amber-400 hover:text-slate-950 transition-colors">
                                <Globe className="w-4 h-4" />
                            </a>
                            <a href="https://www.youtube.com/xplorelanka" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-amber-400 hover:text-slate-950 transition-colors">
                                <MessageCircle className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div>
                        <h4 className="text-slate-900 font-bold text-lg mb-4">Quick Links</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/tours" className="hover:text-amber-700 transition-colors">Sri Lanka Tours</Link></li>
                            <li><Link href="/accommodations" className="hover:text-amber-700 transition-colors">Eco Lodges & Cabins</Link></li>
                            <li><Link href="/vehicles" className="hover:text-amber-700 transition-colors">Vehicle Fleet & Transfers</Link></li>
                            <li><Link href="/planner" className="hover:text-amber-700 transition-colors">Custom Trip Planner</Link></li>
                            <li><Link href="/blog" className="hover:text-amber-700 transition-colors">Travel Blog & Guides</Link></li>
                            <li><Link href="/partner" className="hover:text-amber-700 transition-colors">Driver & Hotelier Partner Portal</Link></li>
                        </ul>
                    </div>

                    {/* Popular Tour Categories */}
                    <div>
                        <h4 className="text-slate-900 font-bold text-lg mb-4">Top Experiences</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/tours?category=cultural" className="hover:text-amber-700 transition-colors">Cultural Triangle & Heritage</Link></li>
                            <li><Link href="/tours?category=nature" className="hover:text-amber-700 transition-colors">Hill Country Ceylon Tea Trails</Link></li>
                            <li><Link href="/tours?category=wildlife" className="hover:text-amber-700 transition-colors">Yala & Udawalawe Safaris</Link></li>
                            <li><Link href="/tours?category=beach" className="hover:text-amber-700 transition-colors">Golden Beaches & Surfing</Link></li>
                            <li><Link href="/vehicles" className="hover:text-amber-700 transition-colors">Airport Pickups & Transfers</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-slate-900 font-bold text-lg mb-4">Contact Info</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <span>99 Augustawatta, Kandy, Sri Lanka</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                                <a href="tel:+94763762763" className="hover:text-amber-700">+94 76 376 2763</a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                                <a href="mailto:info@xplorelanka.com" className="hover:text-amber-700">info@xplorelanka.com</a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Globe className="w-5 h-5 text-amber-500 shrink-0" />
                                <span>www.xplorelanka.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} Xplor Lanka. All rights reserved.</p>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0 text-slate-600">
                        <span className="text-[11px] text-slate-500">Developed by</span>
                        <a 
                            href="https://www.linkedin.com/company/ilutechnologies" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-amber-400 text-slate-700 hover:text-amber-700 transition-all group"
                        >
                            <span className="w-4 h-4 rounded bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-[9px] flex items-center justify-center shadow group-hover:scale-105 transition-transform">
                                ILU
                            </span>
                            <span className="font-semibold text-xs tracking-tight">Ilu</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
