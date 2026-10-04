import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import SeoHead from '../../Components/SeoHead';

export default function ResetPassword({ token, email }) {
    const { flash } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 relative overflow-hidden">
            <SeoHead title="Reset Password | Xplore Lanka" description="Choose a new password for your Xplore Lanka account." noIndex />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center justify-center rounded-2xl bg-white/80 px-5 py-3 shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md">
                        <img src="/images/legacy/logo.png" alt="Xplore Lanka" className="h-14 w-auto max-w-[240px] object-contain" />
                    </Link>
                </div>

                {flash?.error && (
                    <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-900/5">
                    <h1 className="text-xl font-bold text-slate-900 mb-6">Create New Password</h1>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-300 text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-sm"
                                readOnly
                            />
                            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Confirm New Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Resetting...' : 'Reset Password'}</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
