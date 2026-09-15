import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function Blog({ posts = [] }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans">
            <Head title="Sri Lanka Travel Blog & Guides - Xplor Lanka" />
            <Navbar currentPath="/blog" />

            <main className="flex-grow py-12 container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
                    <span className="text-amber-500 font-bold text-sm tracking-wider uppercase">Travel Tips & Guides</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Sri Lanka Travel Blog</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-base">
                        Insider tips on weather, best times to visit, packing guides, and hidden mountain trails in Sri Lanka.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
                            <div>
                                <div className="h-48 overflow-hidden">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-6 space-y-3">
                                    <span className="text-xs font-bold text-amber-500 uppercase">{post.category}</span>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2">{post.title}</h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">{post.excerpt}</p>
                                </div>
                            </div>
                            <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 mt-4">
                                <div className="flex items-center space-x-1">
                                    <User className="w-3.5 h-3.5" />
                                    <span>{post.author}</span>
                                </div>
                                <span className="text-amber-500 font-bold hover:underline cursor-pointer flex items-center space-x-1">
                                    <span>Read Article</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
