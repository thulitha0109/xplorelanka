import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';
import SeoHead from '../../Components/SeoHead';

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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 relative overflow-hidden">
            <SeoHead title="Forgot Password | Xplore Lanka" description="Request a password reset for your Xplore Lanka account." noIndex />

            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center justify-center rounded-2xl bg-white/80 px-5 py-3 shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md">
                        <img src="/images/legacy/logo.png" alt="Xplore Lanka" className="h-14 w-auto max-w-[240px] object-contain" />
                    </Link>
                    <p className="text-slate-600 text-sm">Reset your password</p>
                </div>

                {flash?.success && (
                    <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-900/5">
                    <div className="mb-6">
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                required
                                autoFocus
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-sm"
                                placeholder="your@email.com"
                            />
                            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
                        >
                            <Send className="w-4 h-4" />
                            <span>{processing ? 'Sending...' : 'Email Password Reset Link'}</span>
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                        <Link href="/login" className="text-amber-700 hover:text-amber-800 text-sm font-semibold transition-colors">
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
