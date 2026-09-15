<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use App\Models\Tour;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TourController extends Controller
{
    // ── Public ────────────────────────────────────────────────────────────────

    public function index(Request $request)
    {
        $category    = $request->query('category');
        $sort        = $request->query('sort', 'featured');
        $minPrice    = $request->query('min_price');
        $maxPrice    = $request->query('max_price');
        $difficulty  = $request->query('difficulty');

        $query = Tour::where('is_active', true);

        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }
        if ($minPrice) {
            $query->where('price_lkr', '>=', $minPrice);
        }
        if ($maxPrice) {
            $query->where('price_lkr', '<=', $maxPrice);
        }
        if ($difficulty) {
            $query->where('difficulty', $difficulty);
        }

        match ($sort) {
            'price_asc'  => $query->orderBy('price_lkr', 'asc'),
            'price_desc' => $query->orderBy('price_lkr', 'desc'),
            'rating'     => $query->orderBy('rating', 'desc'),
            'newest'     => $query->orderBy('created_at', 'desc'),
            default      => $query->orderBy('is_featured', 'desc')->orderBy('rating', 'desc'),
        };

        $tours = $query->get();

        return Inertia::render('Tours', [
            'tours'           => $tours,
            'currentCategory' => $category ?? 'all',
            'currentSort'     => $sort,
            'filters'         => compact('minPrice', 'maxPrice', 'difficulty'),
        ]);
    }

    // ── Admin: Form Pages ─────────────────────────────────────────────────────

    public function create()
    {
        $partners = Partner::all()->groupBy('partner_type');

        return Inertia::render('Admin/TourForm', [
            'tour'     => null,
            'partners' => $partners,
            'isEdit'   => false,
        ]);
    }

    public function edit($id)
    {
        $tour     = Tour::findOrFail($id);
        $partners = Partner::all()->groupBy('partner_type');

        return Inertia::render('Admin/TourForm', [
            'tour'     => $tour,
            'partners' => $partners,
            'isEdit'   => true,
        ]);
    }

    // ── Admin: CRUD ───────────────────────────────────────────────────────────

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'slug'           => 'required|string|unique:tours,slug',
            'category'       => 'required|string',
            'route'          => 'required|string',
            'duration'       => 'required|string',
            'price_lkr'      => 'required|numeric',
            'price_usd'      => 'nullable|numeric',
            'description'    => 'nullable|string',
            'highlights'     => 'nullable|array',
            'itinerary'      => 'nullable|array',
            'image'          => 'nullable|string',
            'gallery'        => 'nullable|array',
            'tags'           => 'nullable|array',
            'waypoints'      => 'nullable|array',
            'video_url'      => 'nullable|string',
            'map_center_lat' => 'nullable|numeric',
            'map_center_lng' => 'nullable|numeric',
            'seo_title'      => 'nullable|string',
            'seo_description'=> 'nullable|string',
            'max_group_size' => 'nullable|integer',
            'difficulty'     => 'nullable|string|in:easy,moderate,challenging',
            'is_featured'    => 'boolean',
            'is_active'      => 'boolean',
        ]);

        Tour::create($validated);

        return redirect()->route('admin.dashboard')->with('success', 'Tour created successfully!');
    }

    public function update(Request $request, $id)
    {
        $tour = Tour::findOrFail($id);

        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'category'       => 'required|string',
            'route'          => 'required|string',
            'duration'       => 'required|string',
            'price_lkr'      => 'required|numeric',
            'price_usd'      => 'nullable|numeric',
            'description'    => 'nullable|string',
            'highlights'     => 'nullable|array',
            'itinerary'      => 'nullable|array',
            'image'          => 'nullable|string',
            'gallery'        => 'nullable|array',
            'tags'           => 'nullable|array',
            'waypoints'      => 'nullable|array',
            'video_url'      => 'nullable|string',
            'map_center_lat' => 'nullable|numeric',
            'map_center_lng' => 'nullable|numeric',
            'seo_title'      => 'nullable|string',
            'seo_description'=> 'nullable|string',
            'max_group_size' => 'nullable|integer',
            'difficulty'     => 'nullable|string|in:easy,moderate,challenging',
            'is_featured'    => 'boolean',
            'is_active'      => 'boolean',
        ]);

        $tour->update($validated);

        return redirect()->route('admin.dashboard')->with('success', 'Tour updated successfully!');
    }

    public function destroy($id)
    {
        Tour::findOrFail($id)->delete();
        return redirect()->route('admin.dashboard')->with('success', 'Tour deleted successfully!');
    }
}
