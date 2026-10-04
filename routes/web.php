<?php

use App\Http\Controllers\AccommodationController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\PlannerController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TourController;
use App\Http\Controllers\VehicleController;
use App\Models\Accommodation;
use App\Models\BlogPost;
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
                        ->with(['tour', 'accommodation', 'vehicle'])->latest()->get();
        return Inertia::render('User/Dashboard', [
            'user'     => $user,
            'bookings' => $bookings,
            'reviews'  => $reviews,
        ]);
    })->name('user.dashboard');

    Route::get('/write-review/{tour_id?}', [ReviewController::class, 'create'])->name('reviews.create');
    Route::get('/reviews/{id}/edit',        [ReviewController::class, 'edit'])->name('reviews.edit');
    Route::put('/reviews/{id}',             [ReviewController::class, 'update'])->name('reviews.update');
});

// ── Media Upload Endpoints (Device Uploads to MinIO / Storage) ─────────────────
Route::post('/media/upload',       [MediaController::class, 'upload'])->name('media.upload');

// ── Public Pages ───────────────────────────────────────────────────────────────
Route::get('/', function () {
    $featuredTours = Tour::with('catalogPrices')->where('is_active', true)->where('is_featured', true)->take(4)->get();
    if ($featuredTours->isEmpty()) {
        $featuredTours = Tour::with('catalogPrices')->where('is_active', true)->take(4)->get();
    }
    $accommodations = Accommodation::with(['partner', 'catalogPrices'])->where('is_available', true)->take(3)->get();
    $vehicles       = Vehicle::with(['partner', 'catalogPrices'])->where('is_available', true)->get();
    $reviews        = Review::with(['tour', 'accommodation', 'vehicle'])->where('is_approved', true)->latest()->take(8)->get();

    return Inertia::render('Home', [
        'featuredTours'  => $featuredTours,
        'accommodations' => $accommodations,
        'vehicles'       => $vehicles,
        'reviews'        => $reviews,
    ]);
})->name('home');

// Tours
Route::get('/tours',      [TourController::class, 'index'])->name('tours.index');
Route::get('/tours/{id}', function ($id) {
    $tour         = Tour::with('catalogPrices')->findOrFail($id);
    $relatedTours = Tour::with('catalogPrices')->where('id', '!=', $id)->where('is_active', true)->take(3)->get();
    $reviews      = Review::where('tour_id', $id)->where('is_approved', true)->latest()->get();

    return Inertia::render('TourDetail', [
        'tour'         => $tour,
        'relatedTours' => $relatedTours,
        'reviews'      => $reviews,
    ]);
})->name('tours.show');

// Accommodations
Route::get('/accommodations',      [AccommodationController::class, 'index'])->name('accommodations.index');
Route::get('/accommodations/{id}', [AccommodationController::class, 'show'])->name('accommodations.show');

// Vehicles & Transfers
Route::get('/vehicles',                 [VehicleController::class, 'index'])->name('vehicles.index');
Route::post('/vehicles/estimate-quote', [VehicleController::class, 'estimateQuote'])->name('vehicles.estimate');

// Trip Planner (Connecting Tours, Vehicles, and Accommodations)
Route::get('/planner',  [PlannerController::class, 'index'])->name('planner.index');
Route::post('/planner', [PlannerController::class, 'store'])->name('planner.store');

// Partners
Route::get('/partner', function () {
    return Inertia::render('Partner');
})->name('partner');

// Blogs (Complete System)
Route::get('/blog',        [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');

// Informational
Route::get('/about',   function () { return Inertia::render('About'); })->name('about');
Route::get('/contact', function () { return Inertia::render('Contact'); })->name('contact');

// ── Public Form Submissions ────────────────────────────────────────────────────
Route::post('/currency-preference', [CurrencyController::class, 'update'])->name('currency.update');
Route::post('/bookings',             [BookingController::class, 'store'])->name('bookings.store');
Route::post('/partner-applications', [PartnerController::class, 'store'])->name('partners.store');
Route::post('/reviews',              [ReviewController::class, 'store'])->name('reviews.store');

// ── Admin Management Routes (auth + admin middleware) ──────────────────────────
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/',          [AdminController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [AdminController::class, 'index']);

    // Admin Media Upload
    Route::post('/media/upload', [MediaController::class, 'upload'])->name('media.upload');

    // Tour CRUD
    Route::get('/tours/create',    [TourController::class, 'create'])->name('tours.create');
    Route::get('/tours/{id}/edit', [TourController::class, 'edit'])->name('tours.edit');
    Route::post('/tours',          [TourController::class, 'store'])->name('tours.store');
    Route::put('/tours/{id}',      [TourController::class, 'update'])->name('tours.update');
    Route::delete('/tours/{id}',   [TourController::class, 'destroy'])->name('tours.destroy');

    // Accommodations CRUD
    Route::post('/accommodations',                  [AccommodationController::class, 'store'])->name('accommodations.store');
    Route::put('/accommodations/{id}',              [AccommodationController::class, 'update'])->name('accommodations.update');
    Route::put('/accommodations/{id}/availability', [AccommodationController::class, 'updateAvailability'])->name('accommodations.availability');
    Route::delete('/accommodations/{id}',           [AccommodationController::class, 'destroy'])->name('accommodations.destroy');

    // Vehicles CRUD
    Route::post('/vehicles',                  [VehicleController::class, 'store'])->name('vehicles.store');
    Route::put('/vehicles/{id}',              [VehicleController::class, 'update'])->name('vehicles.update');
    Route::put('/vehicles/{id}/availability', [VehicleController::class, 'updateAvailability'])->name('vehicles.availability');
    Route::delete('/vehicles/{id}',           [VehicleController::class, 'destroy'])->name('vehicles.destroy');

    // Blogs CRUD
    Route::post('/blogs',               [BlogController::class, 'store'])->name('blogs.store');
    Route::put('/blogs/{id}',           [BlogController::class, 'update'])->name('blogs.update');
    Route::put('/blogs/{id}/publish',   [BlogController::class, 'togglePublish'])->name('blogs.publish');
    Route::delete('/blogs/{id}',        [BlogController::class, 'destroy'])->name('blogs.destroy');

    // Booking Management
    Route::put('/bookings/{id}/status', [BookingController::class, 'updateStatus'])->name('bookings.status');
    Route::delete('/bookings/{id}',     [BookingController::class, 'destroy'])->name('bookings.destroy');

    // Partner Management
    Route::post('/partners',                            [PartnerController::class, 'adminStore'])->name('partners.store');
    Route::post('/partners/from-user/{userId}',          [PartnerController::class, 'createFromUser'])->name('partners.fromUser');
    Route::put('/partners/{id}',                        [PartnerController::class, 'update'])->name('partners.update');
    Route::put('/partners/{id}/status',                 [PartnerController::class, 'updateStatus'])->name('partners.status');
    Route::delete('/partners/{id}',                     [PartnerController::class, 'destroy'])->name('partners.destroy');

    // Users Management
    Route::put('/users/{id}/role', [AdminController::class, 'updateUserRole'])->name('users.role');
    Route::delete('/users/{id}',   [AdminController::class, 'destroyUser'])->name('users.destroy');

    // Reviews Management
    Route::post('/reviews',            [ReviewController::class, 'adminStore'])->name('reviews.store');
    Route::put('/reviews/{id}',        [ReviewController::class, 'adminUpdate'])->name('reviews.update');
    Route::put('/reviews/{id}/status', [ReviewController::class, 'updateStatus'])->name('reviews.status');
    Route::delete('/reviews/{id}',     [ReviewController::class, 'destroy'])->name('reviews.destroy');
});
