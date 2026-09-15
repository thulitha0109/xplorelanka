<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use Illuminate\Http\Request;

class PartnerController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'partner_type' => 'required|string',
            'location' => 'required|string',
            'vehicle_or_property_details' => 'nullable|string',
            'message' => 'nullable|string',
        ]);

        $partner = Partner::create($validated);

        return redirect()->back()->with('success', 'Partner application submitted! We will contact you shortly.');
    }

    public function updateStatus(Request $request, $id)
    {
        $partner = Partner::findOrFail($id);
        $request->validate(['status' => 'required|string']);

        $partner->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Partner status updated.');
    }
}
