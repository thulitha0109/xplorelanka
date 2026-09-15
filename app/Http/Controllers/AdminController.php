<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Booking;
use App\Models\CampingLocation;
use App\Models\Partner;
use App\Models\Review;
use App\Models\Tour;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $totalTours = Tour::count();
        $totalBookings = Booking::count();
        $pendingBookings = Booking::where('status', 'pending')->count();
        $totalPartners = Partner::count();
        $totalAccommodations = Accommodation::count();
        $totalVehicles = Vehicle::count();
        $totalReviews = Review::count();

        $recentBookings = Booking::with('tour')->latest()->take(15)->get();
        $allTours = Tour::latest()->get();
        $allAccommodations = Accommodation::latest()->get();
        $allVehicles = Vehicle::all();
        $allPartners = Partner::latest()->get();
        $allUsers = User::latest()->get();
        $allReviews = Review::with('tour')->latest()->get();
        $campingLocations = CampingLocation::all();

        // Categorize partners for tour creation selection
        $vehiclePartners = Partner::where('partner_type', 'vehicle_owner')->get();
        $accommodationPartners = Partner::where('partner_type', 'accommodation_owner')->get();
        $placePartners = Partner::where('partner_type', 'place_owner')->get();
        $guidePartners = Partner::where('partner_type', 'tour_guide')->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalTours' => $totalTours,
                'totalBookings' => $totalBookings,
                'pendingBookings' => $pendingBookings,
                'totalPartners' => $totalPartners,
                'totalAccommodations' => $totalAccommodations,
                'totalVehicles' => $totalVehicles,
                'totalReviews' => $totalReviews,
            ],
            'recentBookings' => $recentBookings,
            'tours' => $allTours,
            'accommodations' => $allAccommodations,
            'vehicles' => $allVehicles,
            'partners' => $allPartners,
            'users' => $allUsers,
            'reviews' => $allReviews,
            'campingLocations' => $campingLocations,
            'categorizedPartners' => [
                'vehicles' => $vehiclePartners,
                'accommodations' => $accommodationPartners,
                'places' => $placePartners,
                'guides' => $guidePartners,
            ],
        ]);
    }

    public function updateUserRole(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $request->validate(['role' => 'required|string|in:admin,staff,customer']);

        $user->update(['role' => $request->role]);

        return redirect()->back()->with('success', "Updated user {$user->name} role to {$request->role}");
    }

    public function destroyUser($id)
    {
        $user = User::findOrFail($id);
        if ($user->email === 'admin@xplorelanka.com') {
            return redirect()->back()->with('error', 'Cannot delete primary admin account.');
        }
        $user->delete();

        return redirect()->back()->with('success', 'User deleted.');
    }
}
