import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Calendar, User, Clock, Eye, ArrowLeft, ArrowRight, Share2, Tag, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export default function BlogDetail({ post, relatedPosts = [], featuredTours = [] }) {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                url: shareUrl,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert('Article link copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
            <Head>
                <title>{post.meta_title || `${post.title} | Xplor Lanka`}</title>
                <meta name="description" content={post.meta_description || post.excerpt || post.title} />
                {post.meta_keywords && <meta name="keywords" content={post.meta_keywords} />}
                {post.canonical_url && <link rel="canonical" href={post.canonical_url} />}
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={post.meta_title || post.title} />
                <meta property="og:description" content={post.meta_description || post.excerpt} />
                {post.image && <meta property="og:image" content={post.image} />}
            </Head>
            <Navbar currentPath="/blog" />

            <main className="flex-grow py-12 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-10">
                {/* Back button */}
                <Link
                    href="/blog"
                    className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-amber-600 font-bold transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to All Guides</span>
                </Link>

                {/* Article Header */}
                <article className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xl">
                    <div className="p-8 md:p-12 space-y-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                                {post.category}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center space-x-1">
                                <Clock className="w-3.5 h-3.5 text-amber-500" />
                                <span>{post.reading_time_min || 5} min read</span>
                            </span>
                            <span className="text-xs text-slate-500 flex items-center space-x-1">
                                <Eye className="w-3.5 h-3.5 text-blue-500" />
                                <span>{post.views_count || 1} views</span>
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                            {post.title}
                        </h1>

                        <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium italic border-l-4 border-amber-500 pl-4 bg-amber-50/40 py-2 rounded-r-xl">
                            {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs">
                                    {(post.author || 'X')[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">{post.author}</div>
                                    <div className="text-[11px] text-slate-400">
                                        Published on {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleShare}
                                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors shadow-xs"
                            >
                                <Share2 className="w-3.5 h-3.5 text-amber-500" />
                                <span>Share Guide</span>
                            </button>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {post.image && (
                        <div className="h-72 md:h-[450px] w-full overflow-hidden bg-slate-100">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Main Content Body */}
                    <div className="p-8 md:p-12 text-slate-700 leading-relaxed space-y-6 text-base prose-headings:font-black prose-headings:text-slate-900">
                        {post.content.includes('<h') ? (
                            <div 
                                className="space-y-4 font-normal text-slate-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: post.content }} 
                            />
                        ) : (
                            post.content.split('\n\n').map((paragraph, idx) => (
                                <p key={idx} className="leading-relaxed text-slate-700">
                                    {paragraph}
                                </p>
                            ))
                        )}
                    </div>

                    {/* Tags */}
                    {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                        <div className="p-8 md:p-12 pt-0 flex flex-wrap items-center gap-2 border-t border-slate-100 mt-6">
                            <span className="text-xs font-bold text-slate-400 flex items-center space-x-1">
                                <Tag className="w-3 h-3" />
                                <span>Tags:</span>
                            </span>
                            {post.tags.map((tag, i) => (
                                <span key={i} className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </article>

                {/* Related Articles */}
                {relatedPosts.length > 0 && (
                    <div className="space-y-6 pt-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-slate-900">Related Travel Guides</h3>
                            <Link href="/blog" className="text-xs font-bold text-amber-600 hover:text-amber-700">
                                View all guides →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {relatedPosts.map(rel => (
                                <Link 
                                    key={rel.id} 
                                    href={`/blog/${rel.slug}`} 
                                    className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all group"
                                >
                                    <div className="h-32 rounded-xl overflow-hidden mb-3 bg-slate-100">
                                        <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                    <span className="text-[10px] font-bold text-amber-600 uppercase">{rel.category}</span>
                                    <h4 className="font-bold text-sm text-slate-900 line-clamp-2 mt-1 group-hover:text-amber-600 transition-colors">{rel.title}</h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
