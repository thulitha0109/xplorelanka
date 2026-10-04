<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Booking;
use App\Models\Tour;
use App\Models\Vehicle;
use App\Services\CurrencyPreferenceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PlannerController extends Controller
{
    /**
     * Show Trip Planner interface with connected tours, vehicles, and accommodations
     */
    public function index()
    {
        $tours = Tour::with('catalogPrices')->where('is_active', true)
            ->select('id', 'title', 'slug', 'category', 'route', 'duration', 'price_lkr', 'rating', 'image')
            ->get();

        $vehicles = Vehicle::with(['partner', 'catalogPrices'])
            ->where('is_available', true)
            ->get();

        $accommodations = Accommodation::with(['partner', 'catalogPrices'])
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
            'country'           => 'nullable|string|max:100',
            'country_code'      => 'nullable|string|size:2',
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

        $tour = !empty($validated['tour_id']) ? Tour::with('catalogPrices')->find($validated['tour_id']) : null;
        $vehicle = !empty($validated['vehicle_id']) ? Vehicle::with('catalogPrices')->find($validated['vehicle_id']) : null;
        $accommodation = !empty($validated['accommodation_id']) ? Accommodation::with('catalogPrices')->find($validated['accommodation_id']) : null;
        $currency = app(CurrencyPreferenceService::class)->defaultCurrency($request);
        $days = $validated['days'] ?? 7;
        $nights = max($days - 1, 1);
        $items = [];
        $quoteIsComplete = true;

        $addPriceItem = function ($model, string $type, string $unit, int $quantity) use (&$items, &$quoteIsComplete, $currency): void {
            if (! $model) {
                return;
            }

            $price = $model->catalogPrices->first(
                fn ($candidate) => $candidate->unit === $unit && $candidate->currency === $currency && $candidate->is_active
            );
            if (! $price) {
                $quoteIsComplete = false;
                return;
            }

            $items[] = [
                'type' => $type,
                'id' => (int) $model->id,
                'unit' => $unit,
                'quantity' => $quantity,
                'unit_amount_minor' => (int) $price->amount_minor,
                'amount_minor' => (int) $price->amount_minor * $quantity,
                'currency' => $currency,
            ];
        };

        if ($tour) {
            $addPriceItem($tour, 'tour', 'package', 1);
        } else {
            $addPriceItem($vehicle, 'vehicle', 'day', $days);
            $addPriceItem($accommodation, 'accommodation', 'night', $nights);
        }

        $totalMinor = $quoteIsComplete && count($items) > 0
            ? array_sum(array_column($items, 'amount_minor'))
            : null;
        $priceLabel = fn ($model, string $unit) => ($price = $model?->catalogPrices->first(
            fn ($candidate) => $candidate->unit === $unit && $candidate->currency === $currency && $candidate->is_active
        )) ? $currency . ' ' . number_format($price->amount_minor / 100, 2) : 'price to be confirmed';
        $tourPriceLabel = $priceLabel($tour, 'package');
        $vehicleKmPriceLabel = $priceLabel($vehicle, 'per_km');
        $vehicleDayPriceLabel = $priceLabel($vehicle, 'day');
        $accommodationPriceLabel = $priceLabel($accommodation, 'night');

        $notesArray = [
            'Planner Itinerary Details:',
            'Days: ' . $days,
            'Guests: ' . ($validated['guests_count'] ?? 2),
            'Selected Places: ' . implode(', ', $validated['selected_places'] ?? []),
            $tour ? "Selected Tour: {$tour->title} ({$tourPriceLabel})" : null,
            $vehicle ? "Vehicle: {$vehicle->name} ({$vehicleKmPriceLabel}/km; {$vehicleDayPriceLabel}/day)" : null,
            $accommodation ? "Stay: {$accommodation->name} ({$accommodation->category} - {$accommodationPriceLabel}/night)" : null,
            $totalMinor !== null ? 'Catalog estimate: ' . $currency . ' ' . number_format($totalMinor / 100, 2) . ' (subject to confirmation)' : 'Final price to be confirmed by Xplor Lanka.',
            !empty($validated['special_requests']) ? "Requests: {$validated['special_requests']}" : null,
        ];

        $booking = Booking::create([
            'reference_no'    => 'XPL-' . strtoupper(Str::random(6)),
            'type'            => 'planner',
            'tour_id'         => $validated['tour_id'] ?? null,
            'customer_name'   => $validated['customer_name'],
            'customer_email'  => $validated['customer_email'],
            'customer_phone'  => $validated['customer_phone'],
            'guests_count'    => $validated['guests_count'] ?? 2,
            'country'         => $validated['country'] ?? null,
            'country_code'    => isset($validated['country_code'])
                ? strtoupper($validated['country_code'])
                : app(CurrencyPreferenceService::class)->countryCode($request),
            'start_date'      => $validated['start_date'] ?? null,
            'notes'           => implode("\n", array_filter($notesArray)),
            'currency'        => $currency,
            'total_price'     => $totalMinor !== null ? $totalMinor / 100 : null,
            'quoted_total_minor' => $totalMinor,
            'price_snapshot'  => $totalMinor !== null ? ['items' => $items, 'captured_at' => now()->toIso8601String()] : null,
            'payment_status'  => 'not_started',
            'status'          => 'pending',
        ]);

        $whatsappMessage = "Hello Xplor Lanka! I just built a custom Sri Lanka trip on your website."
            . "\nName: {$validated['customer_name']}"
            . "\nDays: " . ($validated['days'] ?? 7)
            . ($tour ? "\nTour: {$tour->title}" : '')
            . ($vehicle ? "\nVehicle: {$vehicle->name}" : '')
            . ($accommodation ? "\nAccommodation: {$accommodation->name}" : '')
            . "\nBooking Ref: {$booking->reference_no}";

        $whatsappUrl = 'https://wa.me/94763762763?text=' . urlencode($whatsappMessage);

        return redirect()->back()->with([
            'success'      => "Your custom trip itinerary has been submitted! Reference: {$booking->reference_no}.",
            'whatsapp_url' => $whatsappUrl,
        ]);
    }
}
