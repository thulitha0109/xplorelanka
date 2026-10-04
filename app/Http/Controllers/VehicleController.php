<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use App\Models\Review;
use App\Models\Vehicle;
use App\Services\CatalogPricingService;
use App\Services\CurrencyPreferenceService;
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

        $query = Vehicle::with(['partner', 'catalogPrices'])->where('is_available', true);

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
        $validated = $request->validate([
            'vehicle_id' => ['required', 'exists:vehicles,id'],
            'distance_km' => ['nullable', 'numeric', 'min:0', 'max:5000'],
            'days' => ['nullable', 'integer', 'min:1', 'max:60'],
        ]);

        $currency = app(CurrencyPreferenceService::class)->defaultCurrency($request);
        $vehicle = Vehicle::with('catalogPrices')->findOrFail($validated['vehicle_id']);
        $priceFor = fn (string $unit) => $vehicle->catalogPrices->first(
            fn ($price) => $price->unit === $unit && $price->currency === $currency && $price->is_active
        );
        $perKmPrice = $priceFor('per_km');
        $dailyPrice = $priceFor('day');

        if (! $perKmPrice || ! $dailyPrice) {
            return response()->json(['success' => false, 'message' => 'A current quote is required for this vehicle.'], 422);
        }

        $distanceKm = (float) ($validated['distance_km'] ?? 100);
        $days = (int) ($validated['days'] ?? 1);
        $perKmRate = $perKmPrice->amount_minor / 100;
        $dailyRate = $dailyPrice->amount_minor / 100;
        $estimatedTotal = max($distanceKm * $perKmRate, $days * $dailyRate);
        $estimatedMinor = (int) round($estimatedTotal * 100);

        return response()->json([
            'success'          => true,
            'vehicle'          => $vehicle->name,
            'distance_km'      => $distanceKm,
            'days'             => $days,
            'currency'         => $currency,
            'rate_per_km'      => $perKmRate,
            'daily_rate'       => $dailyRate,
            'estimated_total'  => $estimatedMinor / 100,
            'estimated_total_minor' => $estimatedMinor,
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
            'per_km_usd'       => 'nullable|numeric|min:0',
            'per_km_eur'       => 'nullable|numeric|min:0',
            'base_rate_lkr'    => 'nullable|numeric',
            'daily_rate_lkr'   => 'nullable|numeric',
            'daily_rate_usd'   => 'nullable|numeric|min:0',
            'daily_rate_eur'   => 'nullable|numeric|min:0',
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

        $prices = array_intersect_key($validated, array_flip(['per_km_usd', 'per_km_eur', 'daily_rate_usd', 'daily_rate_eur']));
        unset($validated['per_km_usd'], $validated['per_km_eur'], $validated['daily_rate_usd'], $validated['daily_rate_eur']);
        $vehicle = Vehicle::create($validated);
        $pricing = app(CatalogPricingService::class);
        $pricing->syncFromModel($vehicle);
        $pricing->sync($vehicle, [
            'per_km' => ['usd' => $prices['per_km_usd'] ?? null, 'eur' => $prices['per_km_eur'] ?? null],
            'day' => ['lkr' => $vehicle->daily_rate_lkr, 'usd' => $prices['daily_rate_usd'] ?? null, 'eur' => $prices['daily_rate_eur'] ?? null],
        ]);

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
            'per_km_usd'       => 'nullable|numeric|min:0',
            'per_km_eur'       => 'nullable|numeric|min:0',
            'base_rate_lkr'    => 'nullable|numeric',
            'daily_rate_lkr'   => 'nullable|numeric',
            'daily_rate_usd'   => 'nullable|numeric|min:0',
            'daily_rate_eur'   => 'nullable|numeric|min:0',
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

        $prices = array_intersect_key($validated, array_flip(['per_km_usd', 'per_km_eur', 'daily_rate_usd', 'daily_rate_eur']));
        unset($validated['per_km_usd'], $validated['per_km_eur'], $validated['daily_rate_usd'], $validated['daily_rate_eur']);
        $vehicle->update($validated);
        $vehicle->refresh();
        $pricing = app(CatalogPricingService::class);
        $pricing->syncFromModel($vehicle);
        $pricing->sync($vehicle, [
            'per_km' => ['usd' => $prices['per_km_usd'] ?? null, 'eur' => $prices['per_km_eur'] ?? null],
            'day' => ['lkr' => $vehicle->daily_rate_lkr, 'usd' => $prices['daily_rate_usd'] ?? null, 'eur' => $prices['daily_rate_eur'] ?? null],
        ]);

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
