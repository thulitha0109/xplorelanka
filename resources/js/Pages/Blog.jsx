import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Calendar, User, ArrowRight, Clock, Sparkles, Search, Tag } from 'lucide-react';

export default function Blog({ posts = [], categories = [], currentCategory = 'all', searchQuery = '' }) {
    const [selectedCategory, setSelectedCategory] = useState(currentCategory);
    const [search, setSearch] = useState(searchQuery);

    const filtered = posts.filter(p => {
        const matchCat = selectedCategory === 'all' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.excerpt?.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
            <Head>
                <title>Sri Lanka Travel Blog, Itineraries & Insider Guides | Xplor Lanka</title>
                <meta name="description" content="Discover expert Sri Lanka travel guides, scenic train advice, wildlife safari tips, and packing essentials from local Ceylon tour experts." />
            </Head>
            <Navbar currentPath="/blog" />

            <main className="flex-grow py-12 container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-10 space-y-3">
                    <span className="inline-flex items-center space-x-1 px-3.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Curated Travel Inspiration</span>
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900">Sri Lanka Travel Blog & Guides</h1>
                    <p className="text-slate-600 text-base max-w-2xl mx-auto">
                        Insider tips on weather, best times to visit, packing guides, and hidden mountain trails in Sri Lanka.
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="max-w-xl mx-auto mb-10">
                    <div className="relative">
                        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search articles on Ella train, Yala safari, Sigiriya..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm"
                        />
                    </div>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((post) => (
                        <article 
                            key={post.id} 
                            className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div>
                                <Link href={`/blog/${post.slug}`} className="block h-52 overflow-hidden bg-slate-100 relative">
                                    <img 
                                        src={post.image || 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                    <span className="absolute top-3 left-3 bg-slate-900/85 text-white text-[11px] font-bold px-3 py-1 rounded-lg backdrop-blur-xs">
                                        {post.category}
                                    </span>
                                </Link>
                                <div className="p-6 space-y-3">
                                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                                        <span>{post.reading_time_min || 5} min read</span>
                                        <span>•</span>
                                        <span>{new Date(post.published_at || post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>

                                    <h2 className="text-xl font-extrabold text-slate-900 leading-snug line-clamp-2">
                                        <Link href={`/blog/${post.slug}`} className="hover:text-amber-600 transition-colors">
                                            {post.title}
                                        </Link>
                                    </h2>

                                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{post.excerpt}</p>
                                </div>
                            </div>

                            <div className="p-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50 rounded-b-3xl">
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center justify-center">
                                        {(post.author || 'X')[0]}
                                    </div>
                                    <span className="font-semibold text-slate-700">{post.author}</span>
                                </div>
                                <Link 
                                    href={`/blog/${post.slug}`}
                                    className="text-amber-600 font-bold hover:text-amber-700 flex items-center space-x-1"
                                >
                                    <span>Read Article</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16 text-slate-500">
                        <p className="text-base font-bold">No articles found matching "{search}".</p>
                        <button onClick={() => { setSearch(''); setSelectedCategory('all'); }} className="mt-2 text-xs font-bold text-amber-600 hover:underline">
                            Reset Search Filters
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
