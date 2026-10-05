<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Review;
use App\Models\Tour;
use App\Models\Vehicle;
use App\Services\MediaUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function __construct(
        protected MediaUploadService $uploadService
    ) {}

    /**
     * Show the write-review form for a tour, accommodation, or vehicle.
     */
    public function create(Request $request, $tourId = null)
    {
        $tourId = $tourId ?: $request->query('tour_id');
        $accommodationId = $request->query('accommodation_id');
        $vehicleId = $request->query('vehicle_id');

        $tour = $tourId ? Tour::find($tourId) : null;
        $accommodation = $accommodationId ? Accommodation::find($accommodationId) : null;
        $vehicle = $vehicleId ? Vehicle::find($vehicleId) : null;

        return Inertia::render('WriteReview', [
            'tour'          => $tour,
            'accommodation' => $accommodation,
            'vehicle'       => $vehicle,
            'review'        => null,
            'isEdit'        => false,
        ]);
    }

    /**
     * Show the edit review form.
     */
    public function edit($id)
    {
        $review = Review::with(['tour', 'accommodation', 'vehicle'])->findOrFail($id);

        // Ensure authorization: must be author or admin/staff
        $user = auth()->user();
        if (!$user || ($user->id !== $review->user_id && !in_array($user->role, ['admin', 'staff']))) {
            abort(403, 'Unauthorized to edit this review.');
        }

        return Inertia::render('WriteReview', [
            'tour'          => $review->tour,
            'accommodation' => $review->accommodation,
            'vehicle'       => $review->vehicle,
            'review'        => $review,
            'isEdit'        => true,
        ]);
    }

    /**
     * Store a new review with photo/video uploads or URLs.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tour_id'          => 'nullable|exists:tours,id',
            'accommodation_id' => 'nullable|exists:accommodations,id',
            'vehicle_id'       => 'nullable|exists:vehicles,id',
            'title'            => 'nullable|string|max:150',
            'customer_name'    => 'required|string|max:100',
            'customer_country' => 'nullable|string|max:100',
            'rating'           => 'required|integer|min:1|max:5',
            'comment'          => 'required|string|min:10',
            'media_urls'       => 'nullable|array',
            'media_urls.*'     => 'nullable|string',
            'media_files'      => 'nullable|array',
            'media_files.*'    => 'file|max:52428', // up to 50MB
        ]);

        $mediaUrls = $validated['media_urls'] ?? [];

        // Handle direct device file uploads if provided
        if ($request->hasFile('media_files')) {
            foreach ($request->file('media_files') as $file) {
                try {
                    $uploaded = $this->uploadService->upload($file, 'reviews');
                    $mediaUrls[] = $uploaded['url'];
                } catch (\Throwable $e) {
                    Log::error('ReviewController: review media file upload failed', [
                        'filename' => $file->getClientOriginalName(),
                        'error'    => $e->getMessage(),
                    ]);
                }
            }
        }

        $validated['media_urls'] = array_values(array_filter($mediaUrls));
        $validated['user_id'] = auth()->id();
        $validated['is_approved'] = true; // auto-approve; admin can toggle

        Review::create($validated);

        return redirect()->back()->with('success', 'Thank you! Your review has been submitted.');
    }

    /**
     * Admin: Create review directly from Admin panel
     */
    public function adminStore(Request $request)
    {
        $validated = $request->validate([
            'tour_id'          => 'nullable|exists:tours,id',
            'accommodation_id' => 'nullable|exists:accommodations,id',
            'vehicle_id'       => 'nullable|exists:vehicles,id',
            'title'            => 'nullable|string|max:150',
            'customer_name'    => 'required|string|max:100',
            'customer_country' => 'nullable|string|max:100',
            'rating'           => 'required|integer|min:1|max:5',
            'comment'          => 'required|string|min:5',
            'media_urls'       => 'nullable|array',
            'is_approved'      => 'nullable|boolean',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['is_approved'] = $request->has('is_approved') ? $request->boolean('is_approved') : true;

        Review::create($validated);

        return redirect()->back()->with('success', 'Review added successfully.');
    }

    /**
     * Admin: Update review details directly from Admin panel
     */
    public function adminUpdate(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        $validated = $request->validate([
            'tour_id'          => 'nullable|exists:tours,id',
            'accommodation_id' => 'nullable|exists:accommodations,id',
            'vehicle_id'       => 'nullable|exists:vehicles,id',
            'title'            => 'nullable|string|max:150',
            'customer_name'    => 'required|string|max:100',
            'customer_country' => 'nullable|string|max:100',
            'rating'           => 'required|integer|min:1|max:5',
            'comment'          => 'required|string|min:5',
            'media_urls'       => 'nullable|array',
            'is_approved'      => 'nullable|boolean',
        ]);

        $review->update($validated);

        return redirect()->back()->with('success', 'Review updated successfully.');
    }

    /**
     * Update an existing review (author or admin).
     */
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        $user = auth()->user();
        if (!$user || ($user->id !== $review->user_id && !in_array($user->role, ['admin', 'staff']))) {
            abort(403, 'Unauthorized to edit this review.');
        }

        $validated = $request->validate([
            'title'            => 'nullable|string|max:150',
            'customer_name'    => 'required|string|max:100',
            'customer_country' => 'nullable|string|max:100',
            'rating'           => 'required|integer|min:1|max:5',
            'comment'          => 'required|string|min:10',
            'media_urls'       => 'nullable|array',
            'media_urls.*'     => 'nullable|string',
            'media_files'      => 'nullable|array',
            'media_files.*'    => 'file|max:52428',
        ]);

        $mediaUrls = $validated['media_urls'] ?? ($review->media_urls ?: []);

        if ($request->hasFile('media_files')) {
            foreach ($request->file('media_files') as $file) {
                try {
                    $uploaded = $this->uploadService->upload($file, 'reviews');
                    $mediaUrls[] = $uploaded['url'];
                } catch (\Throwable $e) {
                    Log::error('ReviewController: review update media file upload failed', [
                        'review_id' => $review->id,
                        'filename'  => $file->getClientOriginalName(),
                        'error'     => $e->getMessage(),
                    ]);
                }
            }
        }

        $validated['media_urls'] = array_values(array_filter($mediaUrls));
        $review->update($validated);

        return redirect()->back()->with('success', 'Your review has been updated successfully.');
    }

    /**
     * Toggle approval status (admin).
     */
    public function updateStatus(Request $request, $id)
    {
        $review = Review::findOrFail($id);
        $request->validate(['is_approved' => 'required|boolean']);

        $review->update(['is_approved' => $request->is_approved]);

        return redirect()->back()->with('success', 'Review status updated.');
    }

    /**
     * Delete a review (admin or author).
     */
    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $user = auth()->user();

        if (!$user || ($user->id !== $review->user_id && !in_array($user->role, ['admin', 'staff']))) {
            abort(403, 'Unauthorized.');
        }

        $review->delete();
        return redirect()->back()->with('success', 'Review deleted.');
    }
}
