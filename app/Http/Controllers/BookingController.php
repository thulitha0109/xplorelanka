<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'nullable|string',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:50',
            'country' => 'nullable|string',
            'tour_id' => 'nullable|exists:tours,id',
            'pickup_location' => 'nullable|string',
            'dropoff_location' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'guests_count' => 'nullable|integer',
            'vehicle_type' => 'nullable|string',
            'total_price' => 'nullable|numeric',
            'notes' => 'nullable|string',
        ]);

        $validated['reference_no'] = 'XPL-' . strtoupper(Str::random(6));
        $validated['status'] = 'pending';

        $booking = Booking::create($validated);

        // Generate WhatsApp direct link for seamless inquiry
        $message = "Hello Xplor Lanka! I would like to inquire about booking details:\n"
            . "Ref: " . $booking->reference_no . "\n"
            . "Name: " . $booking->customer_name . "\n"
            . "Phone: " . $booking->customer_phone . "\n"
            . "Guests: " . ($booking->guests_count ?? 1) . "\n"
            . "Notes: " . ($booking->notes ?? 'N/A');

        $whatsappUrl = 'https://wa.me/94763762763?text=' . urlencode($message);

        return redirect()->back()->with([
            'success' => 'Inquiry submitted successfully! Reference: ' . $booking->reference_no,
            'whatsapp_url' => $whatsappUrl,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        $request->validate(['status' => 'required|string']);

        $booking->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Booking status updated to ' . $request->status);
    }

    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return redirect()->back()->with('success', 'Booking deleted!');
    }
}
