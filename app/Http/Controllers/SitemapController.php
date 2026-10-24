<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\BlogPost;
use App\Models\Tour;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $baseUrl = rtrim(config('seo.url', 'https://xplorelanka.com'), '/');

        $staticRoutes = [
            ['url' => $baseUrl . '/', 'priority' => '1.0', 'changefreq' => 'daily'],
            ['url' => $baseUrl . '/tours', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => $baseUrl . '/vehicles', 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['url' => $baseUrl . '/accommodations', 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['url' => $baseUrl . '/planner', 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['url' => $baseUrl . '/blog', 'priority' => '0.8', 'changefreq' => 'daily'],
            ['url' => $baseUrl . '/about', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => $baseUrl . '/contact', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => $baseUrl . '/partner', 'priority' => '0.6', 'changefreq' => 'monthly'],
        ];

        $urls = [];

        foreach ($staticRoutes as $route) {
            $urls[] = [
                'loc' => $route['url'],
                'lastmod' => date('Y-m-d'),
                'changefreq' => $route['changefreq'],
                'priority' => $route['priority'],
            ];
        }

        // Active Tours
        $tours = Tour::where('is_active', true)->latest('updated_at')->get();
        foreach ($tours as $tour) {
            $urls[] = [
                'loc' => $baseUrl . '/tours/' . $tour->id,
                'lastmod' => $tour->updated_at ? $tour->updated_at->format('Y-m-d') : date('Y-m-d'),
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ];
        }

        // Active Accommodations
        $accommodations = Accommodation::where('is_available', true)->latest('updated_at')->get();
        foreach ($accommodations as $acc) {
            $urls[] = [
                'loc' => $baseUrl . '/accommodations/' . $acc->id,
                'lastmod' => $acc->updated_at ? $acc->updated_at->format('Y-m-d') : date('Y-m-d'),
                'changefreq' => 'weekly',
                'priority' => '0.7',
            ];
        }

        // Published Blogs
        $blogs = BlogPost::where('is_published', true)->latest('updated_at')->get();
        foreach ($blogs as $blog) {
            $urls[] = [
                'loc' => $baseUrl . '/blog/' . $blog->slug,
                'lastmod' => $blog->updated_at ? $blog->updated_at->format('Y-m-d') : date('Y-m-d'),
                'changefreq' => 'weekly',
                'priority' => '0.7',
            ];
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($urls as $url) {
            $xml .= "    <url>\n";
            $xml .= "        <loc>" . htmlspecialchars($url['loc'], ENT_XML1, 'UTF-8') . "</loc>\n";
            $xml .= "        <lastmod>" . $url['lastmod'] . "</lastmod>\n";
            $xml .= "        <changefreq>" . $url['changefreq'] . "</changefreq>\n";
            $xml .= "        <priority>" . $url['priority'] . "</priority>\n";
            $xml .= "    </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
        ]);
    }
}
