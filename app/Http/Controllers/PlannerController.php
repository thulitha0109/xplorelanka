<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Booking;
use App\Models\Tour;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlannerController extends Controller
{
    /**
     * Show Trip Planner interface with connected tours, vehicles, and accommodations
     */
    public function index()
    {
        $tours = Tour::where('is_active', true)
            ->select('id', 'title', 'slug', 'category', 'route', 'duration', 'price_lkr', 'rating', 'image')
            ->get();

        $vehicles = Vehicle::with('partner')
            ->where('is_available', true)
            ->get();

        $accommodations = Accommodation::with('partner')
            ->where('is_available', true)
            ->get();

        return Inertia::render('Planner', [
            'tours'          => $tours,
            'vehicles'       => $vehicles,
            'accommodations' => $accommodations,
        ]);
    }

    /**
     * Store custom trip plan booking request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name'     => 'required|string|max:255',
            'customer_email'    => 'required|email|max:255',
            'customer_phone'    => 'required|string|max:50',
            'tour_id'           => 'nullable|exists:tours,id',
            'vehicle_id'        => 'nullable|exists:vehicles,id',
            'accommodation_id'  => 'nullable|exists:accommodations,id',
            'days'              => 'nullable|integer|min:1|max:60',
            'guests_count'      => 'nullable|integer|min:1|max:50',
            'start_date'        => 'nullable|date',
            'selected_places'   => 'nullable|array',
            'estimated_total'   => 'nullable|numeric',
            'special_requests'  => 'nullable|string',
        ]);

        $tour = !empty($validated['tour_id']) ? Tour::find($validated['tour_id']) : null;
        $vehicle = !empty($validated['vehicle_id']) ? Vehicle::find($validated['vehicle_id']) : null;
        $accommodation = !empty($validated['accommodation_id']) ? Accommodation::find($validated['accommodation_id']) : null;

        $notesArray = [
            'Planner Itinerary Details:',
            'Days: ' . ($validated['days'] ?? 7),
            'Guests: ' . ($validated['guests_count'] ?? 2),
            'Selected Places: ' . implode(', ', $validated['selected_places'] ?? []),
            $tour ? "Selected Tour: {$tour->title} (LKR {$tour->price_lkr})" : null,
            $vehicle ? "Vehicle: {$vehicle->name} (LKR {$vehicle->rate_per_km}/km, Daily: LKR {$vehicle->daily_rate_lkr})" : null,
            $accommodation ? "Stay: {$accommodation->name} ({$accommodation->category} - LKR {$accommodation->price_lkr}/night)" : null,
            !empty($validated['estimated_total']) ? "Estimated Quote: LKR " . number_format($validated['estimated_total']) : null,
            !empty($validated['special_requests']) ? "Requests: {$validated['special_requests']}" : null,
        ];

        $booking = Booking::create([
            'tour_id'         => $validated['tour_id'] ?? null,
            'customer_name'   => $validated['customer_name'],
            'customer_email'  => $validated['customer_email'],
            'customer_phone'  => $validated['customer_phone'],
            'guests_count'    => $validated['guests_count'] ?? 2,
            'booking_date'    => $validated['start_date'] ?? now()->addDays(7)->toDateString(),
            'notes'           => implode("\n", array_filter($notesArray)),
            'total_price_lkr' => $validated['estimated_total'] ?? 0,
            'status'          => 'pending',
        ]);

        $whatsappMessage = "Hello Xplor Lanka! I just built a custom Sri Lanka trip on your website."
            . "\nName: {$validated['customer_name']}"
            . "\nDays: " . ($validated['days'] ?? 7)
            . ($tour ? "\nTour: {$tour->title}" : '')
            . ($vehicle ? "\nVehicle: {$vehicle->name}" : '')
            . ($accommodation ? "\nAccommodation: {$accommodation->name}" : '')
            . "\nBooking Ref: #BK-{$booking->id}";

        $whatsappUrl = 'https://wa.me/94763762763?text=' . urlencode($whatsappMessage);

        return redirect()->back()->with([
            'success'      => "Your custom trip itinerary has been submitted! Reference: #BK-{$booking->id}.",
            'whatsapp_url' => $whatsappUrl,
        ]);
    }
}
