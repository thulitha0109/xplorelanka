<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\Tour;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Public Blog Articles Listing
     */
    public function index(Request $request)
    {
        $category = $request->query('category');
        $search = $request->query('search');

        $query = BlogPost::where('is_published', true);

        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                  ->orWhere('excerpt', 'ilike', "%{$search}%")
                  ->orWhere('content', 'ilike', "%{$search}%");
            });
        }

        $posts = $query->orderBy('published_at', 'desc')->get();
        $categories = BlogPost::where('is_published', true)
            ->distinct()
            ->pluck('category');

        return Inertia::render('Blog', [
            'posts'           => $posts,
            'categories'      => $categories,
            'currentCategory' => $category ?? 'all',
            'searchQuery'     => $search ?? '',
        ]);
    }

    /**
     * Public Single Blog Article Detail
     */
    public function show($slug)
    {
        $post = BlogPost::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        // Increment views count safely
        $post->increment('views_count');

        $relatedPosts = BlogPost::where('id', '!=', $post->id)
            ->where('is_published', true)
            ->where(function ($q) use ($post) {
                $q->where('category', $post->category);
            })
            ->take(3)
            ->get();

        if ($relatedPosts->isEmpty()) {
            $relatedPosts = BlogPost::where('id', '!=', $post->id)
                ->where('is_published', true)
                ->take(3)
                ->get();
        }

        $featuredTours = Tour::where('is_active', true)->take(2)->get();

        return Inertia::render('BlogDetail', [
            'post'          => $post,
            'relatedPosts'  => $relatedPosts,
            'featuredTours' => $featuredTours,
        ]);
    }

    /**
     * Admin: Store new Blog Post
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'slug'             => 'required|string|unique:blog_posts,slug',
            'category'         => 'required|string|max:100',
            'meta_title'       => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords'    => 'nullable|string|max:255',
            'canonical_url'    => 'nullable|string|max:255',
            'image'            => 'nullable|string',
            'excerpt'          => 'required|string|max:500',
            'content'          => 'required|string',
            'author'           => 'required|string|max:100',
            'reading_time_min' => 'nullable|integer',
            'tags'             => 'nullable|array',
            'is_published'     => 'nullable|boolean',
        ]);

        $validated['published_at'] = $request->boolean('is_published') ? now() : null;

        BlogPost::create($validated);

        return redirect()->back()->with('success', 'Blog article created successfully.');
    }

    /**
     * Admin: Update Blog Post
     */
    public function update(Request $request, $id)
    {
        $post = BlogPost::findOrFail($id);

        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'slug'             => 'required|string|unique:blog_posts,slug,' . $id,
            'category'         => 'required|string|max:100',
            'meta_title'       => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords'    => 'nullable|string|max:255',
            'canonical_url'    => 'nullable|string|max:255',
            'image'            => 'nullable|string',
            'excerpt'          => 'required|string|max:500',
            'content'          => 'required|string',
            'author'           => 'required|string|max:100',
            'reading_time_min' => 'nullable|integer',
            'tags'             => 'nullable|array',
            'is_published'     => 'nullable|boolean',
        ]);

        if ($request->boolean('is_published') && !$post->published_at) {
            $validated['published_at'] = now();
        }

        $post->update($validated);

        return redirect()->back()->with('success', 'Blog article updated successfully.');
    }

    /**
     * Admin: Toggle Publish Status
     */
    public function togglePublish(Request $request, $id)
    {
        $post = BlogPost::findOrFail($id);
        $published = !$post->is_published;

        $post->update([
            'is_published' => $published,
            'published_at' => $published ? ($post->published_at ?: now()) : null,
        ]);

        return redirect()->back()->with('success', 'Blog publication status updated.');
    }

    /**
     * Admin: Delete Blog Post
     */
    public function destroy($id)
    {
        $post = BlogPost::findOrFail($id);
        $post->delete();

        return redirect()->back()->with('success', 'Blog article deleted.');
    }
}
