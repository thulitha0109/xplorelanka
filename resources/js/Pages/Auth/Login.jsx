import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff, LogIn, CheckCircle2, AlertCircle } from 'lucide-react';
import SeoHead from '../../Components/SeoHead';

export default function Login() {
    const { flash } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 relative overflow-hidden">
            <SeoHead title="Sign In | Xplore Lanka" description="Sign in to your Xplore Lanka account." noIndex />

            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/70 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md space-y-6">
                {/* Logo */}
                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center justify-center rounded-2xl bg-white/80 px-5 py-3 shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md">
                        <img src="/images/legacy/logo.png" alt="Xplore Lanka" className="h-14 w-auto max-w-[240px] object-contain" />
                    </Link>
                    <p className="text-slate-600 text-sm">Sign in to access your account</p>
                </div>

                {/* Flash Messages */}
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

                {/* Card */}
                <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-900/5">
                    <h1 className="text-xl font-bold text-slate-900 mb-6">Welcome back</h1>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                required
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition-all text-sm"
                                placeholder="your@email.com"
                            />
                            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
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

                        <div className="flex items-center justify-between">
                            {/* Remember Me */}
                            <div className="flex items-center space-x-2">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 bg-white text-amber-500 focus:ring-amber-500/30"
                                />
                                <label htmlFor="remember" className="text-xs text-slate-600 cursor-pointer">Keep me signed in</label>
                            </div>
                            
                            {/* Forgot Password Link */}
                            <Link href="/forgot-password" className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>{processing ? 'Signing in...' : 'Sign In'}</span>
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                        <p className="text-slate-600 text-sm">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-amber-700 hover:text-amber-800 font-semibold transition-colors">
                                Create one free
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-slate-500 text-xs">
                    <Link href="/" className="hover:text-slate-800 transition-colors">← Back to Xplor Lanka</Link>
                </p>
            </div>
        </div>
    );
}
