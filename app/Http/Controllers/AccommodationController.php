<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Partner;
use App\Models\Review;
use App\Services\CatalogPricingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccommodationController extends Controller
{
    /**
     * Public Accommodations Listing
     */
    public function index(Request $request)
    {
        $category = $request->query('category');
        $minPrice = $request->query('min_price');
        $maxPrice = $request->query('max_price');
        $partnerId = $request->query('partner_id');

        $currency = app(\App\Services\CurrencyPreferenceService::class)->defaultCurrency($request);
        $query = Accommodation::with(['partner', 'catalogPrices'])->where('is_available', true);

        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }
        if ($minPrice) {
            $query->whereHas('catalogPrices', fn ($prices) => $prices->where('unit', 'night')->where('currency', $currency)->where('amount_minor', '>=', round((float) $minPrice * 100)));
        }
        if ($maxPrice) {
            $query->whereHas('catalogPrices', fn ($prices) => $prices->where('unit', 'night')->where('currency', $currency)->where('amount_minor', '<=', round((float) $maxPrice * 100)));
        }
        if ($partnerId) {
            $query->where('partner_id', $partnerId);
        }

        $accommodations = $query->withMin(['catalogPrices as selected_price_minor' => fn ($prices) => $prices->where('unit', 'night')->where('currency', $currency)], 'amount_minor')
            ->orderBy('is_featured', 'desc')
            ->orderBy('rating', 'desc')
            ->get();

        $partners = Partner::where('partner_type', 'accommodation_owner')
            ->orWhere('partner_type', 'hotelier')
            ->get();

        return Inertia::render('Accommodations', [
            'accommodations'  => $accommodations,
            'partners'        => $partners,
            'currentCategory' => $category ?? 'all',
            'filters'         => compact('minPrice', 'maxPrice', 'partnerId'),
        ]);
    }

    /**
     * Public Accommodation Detail
     */
    public function show($id)
    {
        $accommodation = Accommodation::with(['partner', 'catalogPrices'])->findOrFail($id);
        $reviews = Review::where('accommodation_id', $id)
            ->where('is_approved', true)
            ->latest()
            ->get();

        $relatedStays = Accommodation::with('catalogPrices')->where('id', '!=', $id)
            ->where('is_available', true)
            ->take(3)
            ->get();

        return Inertia::render('AccommodationDetail', [
            'accommodation' => $accommodation,
            'reviews'       => $reviews,
            'relatedStays'  => $relatedStays,
        ]);
    }

    /**
     * Admin: Store Accommodation
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'category'      => 'required|string',
            'partner_id'    => 'nullable|exists:partners,id',
            'location'      => 'required|string',
            'latitude'      => 'nullable|numeric',
            'longitude'     => 'nullable|numeric',
            'price_lkr'     => 'required|numeric',
            'price_usd'     => 'nullable|numeric|min:0',
            'price_eur'     => 'nullable|numeric|min:0',
            'period'        => 'nullable|string',
            'rating'        => 'nullable|numeric|between:1,5',
            'image'         => 'nullable|string',
            'gallery'       => 'nullable|array',
            'amenities'     => 'nullable|array',
            'room_types'    => 'nullable|array',
            'description'   => 'nullable|string',
            'contact_phone' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'is_available'  => 'nullable|boolean',
            'is_featured'   => 'nullable|boolean',
        ]);

        $priceUsd = $validated['price_usd'] ?? null;
        $priceEur = $validated['price_eur'] ?? null;
        unset($validated['price_usd'], $validated['price_eur']);
        $accommodation = Accommodation::create($validated);
        app(CatalogPricingService::class)->sync($accommodation, ['night' => ['lkr' => $accommodation->price_lkr, 'usd' => $priceUsd, 'eur' => $priceEur]]);

        return redirect()->back()->with('success', 'Accommodation created successfully.');
    }

    /**
     * Admin: Update Accommodation
     */
    public function update(Request $request, $id)
    {
        $accommodation = Accommodation::findOrFail($id);

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'category'      => 'required|string',
            'partner_id'    => 'nullable|exists:partners,id',
            'location'      => 'required|string',
            'latitude'      => 'nullable|numeric',
            'longitude'     => 'nullable|numeric',
            'price_lkr'     => 'required|numeric',
            'price_usd'     => 'nullable|numeric|min:0',
            'price_eur'     => 'nullable|numeric|min:0',
            'period'        => 'nullable|string',
            'rating'        => 'nullable|numeric|between:1,5',
            'image'         => 'nullable|string',
            'gallery'       => 'nullable|array',
            'amenities'     => 'nullable|array',
            'room_types'    => 'nullable|array',
            'description'   => 'nullable|string',
            'contact_phone' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'is_available'  => 'nullable|boolean',
            'is_featured'   => 'nullable|boolean',
        ]);

        $priceUsd = $validated['price_usd'] ?? null;
        $priceEur = $validated['price_eur'] ?? null;
        unset($validated['price_usd'], $validated['price_eur']);
        $accommodation->update($validated);
        app(CatalogPricingService::class)->sync($accommodation->refresh(), ['night' => ['lkr' => $accommodation->price_lkr, 'usd' => $priceUsd, 'eur' => $priceEur]]);

        return redirect()->back()->with('success', 'Accommodation updated successfully.');
    }

    /**
     * Admin: Toggle Availability
     */
    public function updateAvailability(Request $request, $id)
    {
        $accommodation = Accommodation::findOrFail($id);
        $request->validate(['is_available' => 'required|boolean']);

        $accommodation->update(['is_available' => $request->is_available]);

        return redirect()->back()->with('success', 'Accommodation status updated.');
    }

    /**
     * Admin: Delete Accommodation
     */
    public function destroy($id)
    {
        Accommodation::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Accommodation deleted.');
    }
}
