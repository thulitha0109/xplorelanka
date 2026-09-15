import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Compass, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export default function ForgotPassword() {
    const { flash } = usePage().props;
    
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
            <Head title="Forgot Password - Xplor Lanka" />

            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Compass className="w-6 h-6 text-slate-950" />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight">
                            XPLOR <span className="text-amber-500">LANKA</span>
                        </span>
                    </Link>
                    <p className="text-slate-400 text-sm">Reset your password</p>
                </div>

                {flash?.success && (
                    <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <div className="mb-6">
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                required
                                autoFocus
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm"
                                placeholder="your@email.com"
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
                        >
                            <Send className="w-4 h-4" />
                            <span>{processing ? 'Sending...' : 'Email Password Reset Link'}</span>
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                        <Link href="/login" className="text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors">
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
