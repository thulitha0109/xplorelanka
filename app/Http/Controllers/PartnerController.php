<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use App\Services\CatalogPricingService;
use Illuminate\Http\Request;

class PartnerController extends Controller
{
    /**
     * Public Partner Registration Form
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                        => 'required|string|max:255',
            'email'                       => 'required|email|max:255',
            'phone'                       => 'required|string|max:50',
            'partner_type'                => 'required|string',
            'location'                    => 'required|string',
            'vehicle_or_property_details' => 'nullable|string',
            'message'                     => 'nullable|string',
        ]);

        $validated['status'] = 'pending';
        Partner::create($validated);

        return redirect()->back()->with('success', 'Partner application submitted! Our team will contact you shortly.');
    }

    /**
     * Admin: Store Partner directly from Admin Panel
     */
    public function adminStore(Request $request)
    {
        $validated = $request->validate([
            'name'                        => 'required|string|max:255',
            'email'                       => 'required|email|max:255',
            'phone'                       => 'required|string|max:50',
            'partner_type'                => 'required|string',
            'location'                    => 'required|string',
            'vehicle_or_property_details' => 'nullable|string',
            'rate_lkr'                    => 'nullable|numeric',
            'rate_usd'                    => 'nullable|numeric|min:0',
            'rate_eur'                    => 'nullable|numeric|min:0',
            'rating'                      => 'nullable|numeric|between:1,5',
            'message'                     => 'nullable|string',
            'status'                      => 'required|string|in:approved,pending,rejected',
        ]);

        $priceUsd = $validated['rate_usd'] ?? null;
        $priceEur = $validated['rate_eur'] ?? null;
        unset($validated['rate_usd'], $validated['rate_eur']);
        $partner = Partner::create($validated);
        app(CatalogPricingService::class)->syncFromModel($partner);
        app(CatalogPricingService::class)->sync($partner, ['partner_rate' => ['lkr' => $partner->rate_lkr, 'usd' => $priceUsd, 'eur' => $priceEur]]);

        return redirect()->back()->with('success', "Partner '{$partner->name}' created successfully.");
    }

    /**
     * Admin: Create Partner from existing User
     */
    public function createFromUser(Request $request, $userId)
    {
        $user = \App\Models\User::findOrFail($userId);

        $validated = $request->validate([
            'partner_type'                => 'required|string',
            'location'                    => 'required|string',
            'vehicle_or_property_details' => 'nullable|string',
            'rate_lkr'                    => 'nullable|numeric',
            'rate_usd'                    => 'nullable|numeric|min:0',
            'rate_eur'                    => 'nullable|numeric|min:0',
            'status'                      => 'nullable|string|in:approved,pending,rejected',
        ]);

        $partner = Partner::create([
            'name'                        => $user->name,
            'email'                       => $user->email,
            'phone'                       => $user->phone ?: ($request->phone ?: '+94700000000'),
            'partner_type'                => $validated['partner_type'],
            'location'                    => $validated['location'],
            'vehicle_or_property_details' => $validated['vehicle_or_property_details'] ?? null,
            'rate_lkr'                    => $validated['rate_lkr'] ?? null,
            'rating'                      => 5.0,
            'status'                      => $validated['status'] ?? 'approved',
            'message'                     => "Created from existing user account ({$user->email})",
        ]);
        app(CatalogPricingService::class)->syncFromModel($partner);

        return redirect()->back()->with('success', "User '{$user->name}' converted to Partner successfully.");
    }
    public function update(Request $request, $id)
    {
        $partner = Partner::findOrFail($id);

        $validated = $request->validate([
            'name'                        => 'required|string|max:255',
            'email'                       => 'required|email|max:255',
            'phone'                       => 'required|string|max:50',
            'partner_type'                => 'required|string',
            'location'                    => 'required|string',
            'vehicle_or_property_details' => 'nullable|string',
            'rate_lkr'                    => 'nullable|numeric',
            'rating'                      => 'nullable|numeric|between:1,5',
            'message'                     => 'nullable|string',
            'status'                      => 'required|string',
        ]);

        $priceUsd = $validated['rate_usd'] ?? null;
        $priceEur = $validated['rate_eur'] ?? null;
        unset($validated['rate_usd'], $validated['rate_eur']);
        $partner->update($validated);
        $partner->refresh();
        $pricing = app(CatalogPricingService::class);
        $pricing->syncFromModel($partner);
        $pricing->sync($partner, ['partner_rate' => ['lkr' => $partner->rate_lkr, 'usd' => $priceUsd, 'eur' => $priceEur]]);

        return redirect()->back()->with('success', 'Partner updated successfully.');
    }

    /**
     * Admin: Update Partner Status
     */
    public function updateStatus(Request $request, $id)
    {
        $partner = Partner::findOrFail($id);
        $request->validate(['status' => 'required|string']);

        $partner->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Partner status updated.');
    }

    /**
     * Admin: Delete Partner
     */
    public function destroy($id)
    {
        $partner = Partner::findOrFail($id);
        $partner->delete();

        return redirect()->back()->with('success', 'Partner removed successfully.');
    }
}
