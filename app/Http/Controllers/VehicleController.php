<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use App\Models\Review;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleController extends Controller
{
    /**
     * Public Vehicle Fleet & Transfers Listing
     */
    public function index(Request $request)
    {
        $category = $request->query('category');
        $partnerId = $request->query('partner_id');

        $query = Vehicle::with('partner')->where('is_available', true);

        if ($category && $category !== 'all') {
            $query->where('vehicle_category', $category);
        }
        if ($partnerId) {
            $query->where('partner_id', $partnerId);
        }

        $vehicles = $query->orderBy('base_rate_lkr', 'asc')->get();

        $vehicleReviews = Review::whereNotNull('vehicle_id')
            ->where('is_approved', true)
            ->with('vehicle')
            ->latest()
            ->take(6)
            ->get();

        $fleetPartners = Partner::where('partner_type', 'vehicle_owner')
            ->orWhere('partner_type', 'driver')
            ->get();

        return Inertia::render('Vehicles', [
            'vehicles'        => $vehicles,
            'vehicleReviews'  => $vehicleReviews,
            'fleetPartners'   => $fleetPartners,
            'currentCategory' => $category ?? 'all',
        ]);
    }

    /**
     * Public Quote Calculator API
     */
    public function estimateQuote(Request $request): JsonResponse
    {
        $vehicleId = $request->input('vehicle_id');
        $distanceKm = (float) $request->input('distance_km', 100);
        $days = (int) $request->input('days', 1);

        $vehicle = Vehicle::find($vehicleId);
        if (!$vehicle) {
            return response()->json(['success' => false, 'message' => 'Vehicle not found.'], 404);
        }

        $perKmRate = (float) preg_replace('/[^0-9.]/', '', $vehicle->rate_per_km) ?: 120;
        $dailyRate = (float) $vehicle->daily_rate_lkr ?: ($perKmRate * 100);

        // Calculate based on distance or days
        $distanceCost = $distanceKm * $perKmRate;
        $timeCost = $days * $dailyRate;
        $estimatedTotal = max($distanceCost, $timeCost);

        return response()->json([
            'success'          => true,
            'vehicle'          => $vehicle->name,
            'distance_km'      => $distanceKm,
            'days'             => $days,
            'rate_per_km'      => $perKmRate,
            'daily_rate_lkr'   => $dailyRate,
            'estimated_total'  => round($estimatedTotal, 2),
        ]);
    }

    /**
     * Admin: Store Vehicle
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_key'      => 'required|string|unique:vehicles,vehicle_key',
            'vehicle_category' => 'required|string',
            'partner_id'       => 'nullable|exists:partners,id',
            'name'             => 'required|string|max:255',
            'seats'            => 'required|string',
            'luggage_capacity' => 'nullable|integer',
            'transmission'     => 'nullable|string',
            'fuel_type'        => 'nullable|string',
            'rate_per_km'      => 'required|string',
            'base_rate_lkr'    => 'nullable|numeric',
            'daily_rate_lkr'   => 'nullable|numeric',
            'pricing_tiers'    => 'nullable|array',
            'icon'             => 'nullable|string',
            'image'            => 'nullable|string',
            'gallery'          => 'nullable|array',
            'description'      => 'nullable|string',
            'driver_included'  => 'nullable|boolean',
            'ac_available'     => 'nullable|boolean',
            'is_available'     => 'nullable|boolean',
            'fleet_count'      => 'nullable|integer',
        ]);

        Vehicle::create($validated);

        return redirect()->back()->with('success', 'Vehicle fleet type added successfully.');
    }

    /**
     * Admin: Update Vehicle
     */
    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);

        $validated = $request->validate([
            'vehicle_key'      => 'required|string|unique:vehicles,vehicle_key,' . $id,
            'vehicle_category' => 'required|string',
            'partner_id'       => 'nullable|exists:partners,id',
            'name'             => 'required|string|max:255',
            'seats'            => 'required|string',
            'luggage_capacity' => 'nullable|integer',
            'transmission'     => 'nullable|string',
            'fuel_type'        => 'nullable|string',
            'rate_per_km'      => 'required|string',
            'base_rate_lkr'    => 'nullable|numeric',
            'daily_rate_lkr'   => 'nullable|numeric',
            'pricing_tiers'    => 'nullable|array',
            'icon'             => 'nullable|string',
            'image'            => 'nullable|string',
            'gallery'          => 'nullable|array',
            'description'      => 'nullable|string',
            'driver_included'  => 'nullable|boolean',
            'ac_available'     => 'nullable|boolean',
            'is_available'     => 'nullable|boolean',
            'fleet_count'      => 'nullable|integer',
        ]);

        $vehicle->update($validated);

        return redirect()->back()->with('success', 'Vehicle updated successfully.');
    }

    /**
     * Admin: Toggle Availability
     */
    public function updateAvailability(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);
        $request->validate(['is_available' => 'required|boolean']);

        $vehicle->update(['is_available' => $request->is_available]);

        return redirect()->back()->with('success', 'Vehicle status updated.');
    }

    /**
     * Admin: Delete Vehicle
     */
    public function destroy($id)
    {
        $vehicle = Vehicle::findOrFail($id);
        $vehicle->delete();

        return redirect()->back()->with('success', 'Vehicle fleet item deleted.');
    }
}
