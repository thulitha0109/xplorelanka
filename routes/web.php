<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TourController;
use App\Models\Accommodation;
use App\Models\BlogPost;
use App\Models\CampingLocation;
use App\Models\Review;
use App\Models\Tour;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ── Auth Routes ────────────────────────────────────────────────────────────────
Route::get('/login',    [AuthController::class, 'showLogin'])->name('login')->middleware('guest');
Route::post('/login',   [AuthController::class, 'login'])->name('login.post')->middleware('guest');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register')->middleware('guest');
Route::post('/register',[AuthController::class, 'register'])->name('register.post')->middleware('guest');

// Password Reset Routes
Route::get('/forgot-password', [AuthController::class, 'showForgotPassword'])->name('password.request')->middleware('guest');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.email')->middleware('guest');
Route::get('/reset-password/{token}', [AuthController::class, 'showResetPassword'])->name('password.reset')->middleware('guest');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update')->middleware('guest');

Route::post('/logout',  [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// ── User Account (auth-gated) ──────────────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/my-account', function () {
        $user     = auth()->user();
        $bookings = \App\Models\Booking::where('customer_email', $user->email)
                        ->with('tour')->latest()->get();
        $reviews  = \App\Models\Review::where('user_id', $user->id)
                        ->with('tour')->latest()->get();
        return Inertia::render('User/Dashboard', [
            'user'     => $user,
            'bookings' => $bookings,
            'reviews'  => $reviews,
        ]);
    })->name('user.dashboard');

    Route::get('/write-review/{tour_id}', [ReviewController::class, 'create'])->name('reviews.create');
});

// ── Public Pages ───────────────────────────────────────────────────────────────
Route::get('/', function () {
    $featuredTours = Tour::where('is_active', true)->where('is_featured', true)->take(4)->get();
    if ($featuredTours->isEmpty()) {
        $featuredTours = Tour::where('is_active', true)->take(4)->get();
    }
    $campingLocations = CampingLocation::where('is_active', true)->take(4)->get();
    $accommodations   = Accommodation::where('is_available', true)->take(3)->get();
    $vehicles         = Vehicle::where('is_available', true)->get();
    $reviews          = Review::with('tour')->where('is_approved', true)->latest()->take(8)->get();

    return Inertia::render('Home', [
        'featuredTours'    => $featuredTours,
        'campingLocations' => $campingLocations,
        'accommodations'   => $accommodations,
        'vehicles'         => $vehicles,
        'reviews'          => $reviews,
    ]);
})->name('home');

Route::get('/tours', [TourController::class, 'index'])->name('tours.index');

Route::get('/tours/{id}', function ($id) {
    $tour        = Tour::findOrFail($id);
    $relatedTours = Tour::where('id', '!=', $id)->where('is_active', true)->take(3)->get();
    $reviews     = Review::where('tour_id', $id)->where('is_approved', true)->latest()->get();

    return Inertia::render('TourDetail', [
        'tour'         => $tour,
        'relatedTours' => $relatedTours,
        'reviews'      => $reviews,
    ]);
})->name('tours.show');

Route::get('/camping', function () {
    $locations = CampingLocation::where('is_active', true)->get();
    return Inertia::render('Camping', ['campingLocations' => $locations]);
})->name('camping');

Route::get('/accommodations', function () {
    $accommodations = Accommodation::where('is_available', true)->get();
    return Inertia::render('Accommodations', ['accommodations' => $accommodations]);
})->name('accommodations');

Route::get('/vehicles', function () {
    $vehicles = Vehicle::where('is_available', true)->get();
    return Inertia::render('Vehicles', ['vehicles' => $vehicles]);
})->name('vehicles');

Route::get('/planner', function () {
    $tours    = Tour::where('is_active', true)->get();
    $vehicles = Vehicle::where('is_available', true)->get();
    return Inertia::render('Planner', [
        'tours'    => $tours,
        'vehicles' => $vehicles,
    ]);
})->name('planner');

Route::get('/partner', function () {
    return Inertia::render('Partner');
})->name('partner');

Route::get('/blog', function () {
    $posts = BlogPost::where('is_published', true)->latest()->get();
    return Inertia::render('Blog', ['posts' => $posts]);
})->name('blog');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

// ── Public Form Submissions ────────────────────────────────────────────────────
Route::post('/bookings',             [BookingController::class, 'store'])->name('bookings.store');
Route::post('/partner-applications', [PartnerController::class, 'store'])->name('partners.store');
Route::post('/reviews',              [ReviewController::class, 'store'])->name('reviews.store');

// ── Admin Management Routes (auth + admin middleware) ──────────────────────────
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/',          [AdminController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [AdminController::class, 'index']);

    // Tour CRUD
    Route::get('/tours/create',    [TourController::class, 'create'])->name('tours.create');
    Route::get('/tours/{id}/edit', [TourController::class, 'edit'])->name('tours.edit');
    Route::post('/tours',          [TourController::class, 'store'])->name('tours.store');
    Route::put('/tours/{id}',      [TourController::class, 'update'])->name('tours.update');
    Route::delete('/tours/{id}',   [TourController::class, 'destroy'])->name('tours.destroy');

    // Booking Management
    Route::put('/bookings/{id}/status', [BookingController::class, 'updateStatus'])->name('bookings.status');
    Route::delete('/bookings/{id}',     [BookingController::class, 'destroy'])->name('bookings.destroy');

    // Partner Management
    Route::put('/partners/{id}/status', [PartnerController::class, 'updateStatus'])->name('partners.status');

    // Users Management
    Route::put('/users/{id}/role', [AdminController::class, 'updateUserRole'])->name('users.role');
    Route::delete('/users/{id}',   [AdminController::class, 'destroyUser'])->name('users.destroy');

    // Reviews Management
    Route::put('/reviews/{id}/status', [ReviewController::class, 'updateStatus'])->name('reviews.status');
    Route::delete('/reviews/{id}',     [ReviewController::class, 'destroy'])->name('reviews.destroy');
});
