<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request — allow only admin or staff roles.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login')->with('error', 'Please log in to access the admin panel.');
        }

        if (!auth()->user()->isStaff()) {
            abort(403, 'Access denied. Admin or Staff role required.');
        }

        return $next($request);
    }
}
