<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Tour;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Show the write-review form (auth-gated).
     */
    public function create($tourId)
    {
        $tour = Tour::findOrFail($tourId);

        return Inertia::render('WriteReview', [
            'tour' => $tour,
        ]);
    }

    /**
     * Store a new review (public, optionally linked to auth user).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tour_id'         => 'nullable|exists:tours,id',
            'title'           => 'nullable|string|max:150',
            'customer_name'   => 'required|string|max:100',
            'customer_country'=> 'nullable|string|max:100',
            'rating'          => 'required|integer|min:1|max:5',
            'comment'         => 'required|string|min:10',
            'media_urls'      => 'nullable|array',
            'media_urls.*'    => 'nullable|string|url',
        ]);

        $validated['user_id']     = auth()->id();
        $validated['is_approved'] = true; // auto-approve; admin can toggle

        Review::create($validated);

        return redirect()->back()->with('success', 'Thank you! Your review has been submitted.');
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
     * Delete a review (admin).
     */
    public function destroy($id)
    {
        Review::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Review deleted.');
    }
}
