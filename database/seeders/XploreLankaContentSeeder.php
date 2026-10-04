<?php

namespace Database\Seeders;

use App\Models\CampingLocation;
use App\Models\Accommodation;
use App\Models\BlogPost;
use App\Models\Partner;
use App\Models\Review;
use App\Models\Tour;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Services\CatalogPricingService;

class XploreLankaContentSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            $this->removePreviousDemoContent();

            $adminEmail = config('seeding.admin_email');
            $adminPassword = config('seeding.admin_password');
            if ($adminEmail && $adminPassword) {
                User::firstOrCreate(
                    ['email' => $adminEmail],
                    [
                        'name' => 'Xplore Lanka Admin',
                        'password' => Hash::make($adminPassword),
                        'role' => 'admin',
                        'phone' => '+94763762763',
                    ]
                );
            }

            Partner::updateOrCreate(
                ['email' => 'info@xplorelanka.com'],
                [
                    'name' => 'Xplore Lanka Tours',
                    'phone' => '+94763762763',
                    'partner_type' => 'tour_guide',
                    'location' => '99 Augustawatta, Kandy 20000, Sri Lanka',
                    'vehicle_or_property_details' => 'Personalized private tours, transfers, camping and cycling experiences across Sri Lanka.',
                    'rating' => 5.00,
                    'message' => 'Founded in Kandy in 2016. Public Google profile: 5.0 rating from 39 reviews (checked October 2026).',
                    'status' => 'approved',
                ]
            );

            $tours = [
                [
                    'title' => 'Xplore the Wonders of Sri Lanka',
                    'slug' => 'xplore-the-wonders-of-sri-lanka',
                    'category' => 'cultural',
                    'route' => 'Colombo - Sigiriya - Kandy - Nuwara Eliya - Ella - Yala - Tangalle - Mirissa - Galle',
                    'duration' => '15 days',
                    'price_usd' => 998,
                    'description' => 'A private 15-day journey through Sri Lanka’s cultural heritage, hill country, wildlife and southern coast. Visit Sigiriya, Kandy, Nuwara Eliya, Ella, Yala and Galle, with a scenic train journey, safari opportunities and flexible stops. Includes private air-conditioned transport, an English-speaking driver, fuel, water and in-vehicle Wi-Fi. Hotels, meals, tickets and medicines are excluded.',
                    'highlights' => ['Sigiriya Rock Fortress', 'Kandy Temple of the Tooth', 'Hill-country tea plantations', 'Scenic train journey to Ella', 'Yala National Park safari', 'Galle Fort and southern beaches'],
                    'itinerary' => [
                        ['day' => 'Days 1-3', 'title' => 'Sigiriya and the Cultural Triangle', 'desc' => 'Explore Sigiriya, local village experiences and the ancient cultural region.'],
                        ['day' => 'Days 4-5', 'title' => 'Kandy', 'desc' => 'Visit the Temple of the Tooth, viewpoints and a Kandyan cultural performance.'],
                        ['day' => 'Days 6-9', 'title' => 'Hill Country and Ella', 'desc' => 'Discover tea country, waterfalls, Horton Plains and the scenic train to Ella.'],
                        ['day' => 'Days 10-11', 'title' => 'Wildlife', 'desc' => 'Take a safari in Yala National Park. Wildlife sightings are not guaranteed.'],
                        ['day' => 'Days 12-15', 'title' => 'Southern Coast and Galle', 'desc' => 'Relax by the coast, with options for whale watching and a visit to Galle Fort.'],
                    ],
                    'image' => '/images/legacy/tour-1.jpg',
                    'gallery' => ['/images/legacy/tour-1.jpg', '/images/legacy/tour-2.jpg', '/images/legacy/tour-3.jpg', '/images/legacy/tour-4.jpg'],
                    'rating' => 5.0,
                    'reviews_count' => 0,
                    'is_featured' => true,
                    'is_active' => true,
                    'tags' => ['Private tour', 'Culture', 'Nature', 'Wildlife', 'Beach'],
                    'waypoints' => [],
                    'map_center_lat' => 7.8731,
                    'map_center_lng' => 80.7718,
                    'max_group_size' => 3,
                    'difficulty' => 'easy',
                ],
                [
                    'title' => 'Colombo Airport to Sigiriya Private Transfer',
                    'slug' => 'colombo-airport-to-sigiriya-private-transfer',
                    'category' => 'city',
                    'route' => 'Bandaranaike International Airport - Sigiriya',
                    'duration' => '5 hours',
                    'price_usd' => 98,
                    'description' => 'Private, door-to-door transfer from Bandaranaike International Airport to Sigiriya with an air-conditioned vehicle and English-speaking driver. Flexible refreshment and sightseeing stops are available. Water is included; meals are not.',
                    'highlights' => ['Airport welcome', 'Private air-conditioned vehicle', 'English-speaking driver', 'Door-to-door hotel drop-off', 'Flexible stops'],
                    'itinerary' => [],
                    'image' => '/images/legacy/tour-2.jpg',
                    'gallery' => [],
                    'rating' => 5.0,
                    'reviews_count' => 0,
                    'is_featured' => true,
                    'is_active' => true,
                    'tags' => ['Transfer', 'Airport', 'Private'],
                    'waypoints' => [],
                    'map_center_lat' => 6.9200,
                    'map_center_lng' => 79.8772,
                    'max_group_size' => 3,
                    'difficulty' => 'easy',
                ],
                [
                    'title' => 'Kandy to Arugambay',
                    'slug' => 'kandy-to-arugambay',
                    'category' => 'beach',
                    'route' => 'Kandy - Arugam Bay',
                    'duration' => '5 hours',
                    'price_usd' => 148.98,
                    'description' => 'Travel from Kandy to the East Coast surf destination of Arugam Bay through scenic countryside and rural villages. Water is included; lunch is not.',
                    'highlights' => ['Private trip from Kandy', 'Scenic countryside', 'Arugam Bay arrival'],
                    'itinerary' => [],
                    'image' => '/images/legacy/tour-3.jpg',
                    'gallery' => [],
                    'rating' => 5.0,
                    'reviews_count' => 0,
                    'is_featured' => false,
                    'is_active' => true,
                    'tags' => ['Transfer', 'East Coast', 'Beach'],
                    'waypoints' => [],
                    'map_center_lat' => 6.8394,
                    'map_center_lng' => 81.8332,
                    'max_group_size' => 3,
                    'difficulty' => 'easy',
                ],
                [
                    'title' => 'Kandy to Sigiriya drop',
                    'slug' => 'kandy-to-sigiriya-drop',
                    'category' => 'cultural',
                    'route' => 'Kandy - Matale - Dambulla - Sigiriya',
                    'duration' => '9 hours',
                    'price_usd' => 59.99,
                    'description' => 'A private journey from Kandy to Sigiriya with stops at Matale Hindu Temple, Nalanda Gedige, a spice garden and Dambulla Cave Temple before drop-off in Sigiriya. Water is included; lunch is not.',
                    'highlights' => ['Matale Hindu Temple', 'Nalanda Gedige', 'Matale spice garden', 'Dambulla Cave Temple', 'Sigiriya drop-off'],
                    'itinerary' => [
                        ['day' => 'Morning', 'title' => 'Matale', 'desc' => 'Hotel pickup, Sri Muthumariamman Temple and Nalanda Gedige.'],
                        ['day' => 'Midday', 'title' => 'Spice garden and Dambulla', 'desc' => 'Visit a spice garden and the Dambulla Cave Temple. Lunch is not included.'],
                        ['day' => 'Afternoon', 'title' => 'Sigiriya', 'desc' => 'Continue to Sigiriya for hotel drop-off.'],
                    ],
                    'image' => '/images/legacy/tour-4.jpg',
                    'gallery' => [],
                    'rating' => 5.0,
                    'reviews_count' => 0,
                    'is_featured' => false,
                    'is_active' => true,
                    'tags' => ['Day trip', 'Culture', 'Temple'],
                    'waypoints' => [],
                    'map_center_lat' => 7.9541,
                    'map_center_lng' => 79.7547,
                    'max_group_size' => 3,
                    'difficulty' => 'easy',
                ],
                [
                    'title' => 'Kandy City Tour with Ambuluwawa',
                    'slug' => 'kandy-city-tour-with-ambuluwawa',
                    'category' => 'city',
                    'route' => 'Kandy - Ambuluwawa - Gampola temples - Peradeniya - Kandy',
                    'duration' => '9 hours',
                    'price_usd' => 49,
                    'description' => 'Full-day private Kandy-region tour covering sunrise at Ambuluwawa, the Ambekka-Gadaladeniya-Lankathilaka temple loop, local craft stops, Peradeniya Royal Botanical Garden, the Temple of the Tooth, a Kandyan dance show and city viewpoints. Water and a traditional Sri Lankan lunch are included.',
                    'highlights' => ['Sunrise at Ambuluwawa', 'Three Temples Loop', 'Ceylon tea and local crafts', 'Peradeniya Botanical Garden', 'Temple of the Tooth', 'Kandyan dance show'],
                    'itinerary' => [
                        ['day' => 'Early morning', 'title' => 'Ambuluwawa', 'desc' => 'Drive to the multi-religious complex for sunrise and mountain views.'],
                        ['day' => 'Morning', 'title' => 'Three Temples Loop', 'desc' => 'Visit Ambekka, Lankathilaka and Gadaladeniya temples.'],
                        ['day' => 'Midday', 'title' => 'Crafts and lunch', 'desc' => 'Visit local tea and craft stops, followed by traditional Sri Lankan lunch.'],
                        ['day' => 'Afternoon', 'title' => 'Kandy heritage', 'desc' => 'Explore Peradeniya, the Temple of the Tooth, cultural dance and viewpoints.'],
                    ],
                    'image' => '/images/legacy/tour-1.jpg',
                    'gallery' => [],
                    'rating' => 5.0,
                    'reviews_count' => 0,
                    'is_featured' => true,
                    'is_active' => true,
                    'tags' => ['Kandy', 'Culture', 'Temples', 'Full day'],
                    'waypoints' => [],
                    'map_center_lat' => 7.2906,
                    'map_center_lng' => 80.6331,
                    'max_group_size' => 1,
                    'difficulty' => 'easy',
                ],
                [
                    'title' => 'Kandy Tea Trails Cycling Ride',
                    'slug' => 'kandy-tea-trails-cycling-ride',
                    'category' => 'adventure',
                    'route' => 'Kandy tea trails',
                    'duration' => 'Half day',
                    'price_usd' => 70,
                    'description' => 'A 25 km cross-country mountain-bike ride with approximately 600 m total climb, local food along the route and a Ceylon tea break. Published group pricing: USD 70 per person for four guests, USD 90 per person for two guests, or USD 140 total for one guest.',
                    'highlights' => ['25 km route', '600 m total climb', 'Mountain biking', 'Local food experience', 'Ceylon tea'],
                    'itinerary' => [],
                    'image' => '/images/legacy/cycling-kandy-1.jpg',
                    'gallery' => ['/images/legacy/cycling-kandy-1.jpg', '/images/legacy/cycling-kandy-2.jpg', '/images/legacy/cycling-kandy-3.jpg', '/images/legacy/cycling-kandy-4.jpg'],
                    'rating' => 5.0,
                    'reviews_count' => 0,
                    'is_featured' => false,
                    'is_active' => true,
                    'tags' => ['Cycling', 'Mountain biking', 'Tea country'],
                    'waypoints' => [],
                    'map_center_lat' => 7.2906,
                    'map_center_lng' => 80.6337,
                    'max_group_size' => null,
                    'difficulty' => 'moderate',
                ],
            ];

            foreach ($tours as $tour) {
                $usdToLkr = (float) config('currency.rates.USD_LKR', 300);
                $tour['price_lkr'] = round($tour['price_usd'] * $usdToLkr, 2);
                Tour::updateOrCreate(['slug' => $tour['slug']], $tour);
            }

            $campingLocations = [
                ['title' => 'Knuckles Mountain Range', 'image' => '/images/legacy/camping-knuckles.jpg'],
                ['title' => 'Yala Buffer Zone', 'image' => '/images/legacy/camping-yala.jpg'],
                ['title' => 'Ella Hills', 'image' => '/images/legacy/camping-ella.jpg'],
                ['title' => 'Wilpattu Forest Edge', 'image' => '/images/legacy/camping-wilpattu.jpg'],
            ];

            foreach ($campingLocations as $location) {
                CampingLocation::updateOrCreate(
                    ['title' => $location['title']],
                    [
                        'location' => $location['title'] . ', Sri Lanka',
                        'image' => $location['image'],
                        'types' => ['Luxury tented camping', 'Basic forest camping', 'Lake-side or beach camping'],
                        'inclusions' => ['Tents and bedding', 'Campfire dinner and BBQ', 'Breakfast', 'Nature walks with a guide'],
                        'durations' => ['1 Night / 2 Days', '2 Nights / 3 Days'],
                        'add_ons' => ['Jeep safaris', 'Hiking guides', 'Transport'],
                        'description' => 'Customized camping experiences in Sri Lanka. Contact Xplore Lanka for availability and a current quote; the source site does not publish a price.',
                        'starting_price_lkr' => null,
                        'is_active' => true,
                    ]
                );
            }

            $googleReviews = [
                [
                    'customer_name' => 'Charlene Coudreau',
                    'title' => 'Flexible, well-organized trip from Sigiriya to Hiriketiya',
                    'comment' => 'Paraphrased from the public Google review: praised Vije for organizing a flexible itinerary, well-paced travel and a memorable trip through to Hiriketiya.',
                ],
                [
                    'customer_name' => 'Anja Riegel',
                    'title' => 'Two-week Sri Lanka trip with Nelka',
                    'comment' => 'Paraphrased from the public Google review: described a two-week February 2026 trip, collaborative planning and dependable help from Nelka, and recommended the experience.',
                ],
                [
                    'customer_name' => 'Sergey Antonov',
                    'title' => 'Helpful guide and memorable local stops',
                    'comment' => 'Paraphrased from the public Google review: appreciated Nelka’s courteous help and visits to waterfalls, tea plantations, spice and herb gardens, and a meditation centre.',
                ],
            ];

            foreach ($googleReviews as $review) {
                Review::updateOrCreate(
                    ['customer_name' => $review['customer_name'], 'source_platform' => 'google'],
                    [
                        'tour_id' => null,
                        'accommodation_id' => null,
                        'vehicle_id' => null,
                        'user_id' => null,
                        'customer_country' => 'International Traveler',
                        'title' => $review['title'],
                        'rating' => 5,
                        'comment' => $review['comment'],
                        'media_urls' => null,
                        'is_approved' => true,
                    ]
                );
            }

            $this->seedLegacyCyclingRoutes();
            $this->seedLegacyBlogPosts();

            $pricing = app(CatalogPricingService::class);
            foreach ([Tour::class, Accommodation::class, Vehicle::class, CampingLocation::class, Partner::class] as $modelClass) {
                $modelClass::query()->get()->each(fn ($model) => $pricing->syncFromModel($model));
            }
        });
    }

    private function seedLegacyCyclingRoutes(): void
    {
        $routes = [
            [
                'title' => 'Ella to Haputale Cycling Route',
                'slug' => 'ella-to-haputale-cycling-route',
                'route' => 'Ella - Haputale',
                'image' => '/images/legacy/cycling-ella.jpg',
                'description' => 'A scenic cycling route through Sri Lanka’s hill-country tea trails between Ella and Haputale. The legacy website lists this route as an inquiry experience without a published price.',
                'tags' => ['Cycling', 'Tea country', 'Hill country'],
                'lat' => 6.8667,
                'lng' => 81.0467,
            ],
            [
                'title' => 'Galle Coastal Cycling Route',
                'slug' => 'galle-coastal-cycling-route',
                'route' => 'Galle coastal route',
                'image' => '/images/legacy/cycling-galle.jpg',
                'description' => 'A coastal cycling experience along scenic beach paths around Galle. Contact Xplore Lanka for route details and a current quote.',
                'tags' => ['Cycling', 'Coast', 'Beach'],
                'lat' => 6.0535,
                'lng' => 80.2210,
            ],
            [
                'title' => 'Sigiriya Countryside Cycling Route',
                'slug' => 'sigiriya-countryside-cycling-route',
                'route' => 'Sigiriya countryside',
                'image' => '/images/legacy/cycling-sigiriya.jpg',
                'description' => 'Explore countryside paths and ancient-kingdom landscapes by bicycle around Sigiriya. Contact Xplore Lanka for availability and pricing.',
                'tags' => ['Cycling', 'Cultural Triangle', 'Countryside'],
                'lat' => 7.9570,
                'lng' => 80.7603,
            ],
            [
                'title' => 'Knuckles Range Cycling Trails',
                'slug' => 'knuckles-range-cycling-trails',
                'route' => 'Knuckles range trails',
                'image' => '/images/legacy/cycling-knuckles.jpg',
                'description' => 'Mountain-bike adventures on trails around the Knuckles range. Ask Xplore Lanka to confirm route difficulty, availability and a current quote.',
                'tags' => ['Cycling', 'Mountain biking', 'Knuckles'],
                'lat' => 7.4514,
                'lng' => 80.7997,
            ],
        ];

        foreach ($routes as $route) {
            Tour::updateOrCreate(
                ['slug' => $route['slug']],
                [
                    'title' => $route['title'],
                    'category' => 'adventure',
                    'route' => $route['route'],
                    'duration' => 'Inquire',
                    'price_lkr' => 0,
                    'price_usd' => null,
                    'description' => $route['description'],
                    'highlights' => ['Guided or private ride options', 'Route and equipment confirmed when booking'],
                    'itinerary' => [],
                    'image' => $route['image'],
                    'gallery' => [$route['image']],
                    'rating' => 5.0,
                    'reviews_count' => 0,
                    'is_featured' => false,
                    'is_active' => true,
                    'tags' => $route['tags'],
                    'waypoints' => [['name' => $route['route'], 'lat' => $route['lat'], 'lng' => $route['lng']]],
                    'map_center_lat' => $route['lat'],
                    'map_center_lng' => $route['lng'],
                    'max_group_size' => null,
                    'difficulty' => 'moderate',
                ]
            );
        }
    }

    private function seedLegacyBlogPosts(): void
    {
        $posts = [
            [
                'title' => 'Horton Plains National Park: Where Earth Meets the Sky',
                'slug' => 'horton-plains-national-park-where-earth-meets-the-sky',
                'category' => 'Adventure',
                'image' => '/images/legacy/blog-horton.jpg',
                'excerpt' => 'A practical introduction to Horton Plains’ high-altitude grasslands, cloud forest, endemic wildlife and the classic World’s End and Baker’s Falls walking loop.',
                'content' => '<h2>A highland landscape above the clouds</h2><p>Horton Plains National Park lies in Sri Lanka’s Central Highlands near Nuwara Eliya. Its open grasslands, cloud forest and cool climate make it one of the island’s distinctive walking destinations.</p><h2>World’s End and Baker’s Falls</h2><p>The popular circular walk takes visitors to Small World’s End, the escarpment at World’s End and Baker’s Falls. Starting early improves the chance of clear views. Conditions, trail access and park rules can change, so check locally before travelling.</p><h2>Wildlife and responsible visits</h2><p>Sambar deer are often seen in open areas, and the park protects highland birdlife and delicate plant communities. Stay on marked trails, carry warm layers and leave no litter.</p>',
                'author' => 'Xplore Lanka Travel Writer',
                'published_at' => '2026-02-13 08:00:00',
                'views_count' => 72,
                'reading_time_min' => 4,
                'tags' => ['Adventure', 'Photography', 'Destinations', 'Horton Plains'],
            ],
            [
                'title' => 'Tusker Agbo’s Legendary Tale',
                'slug' => 'tusker-agbos-legendary-tale',
                'category' => 'Wildlife',
                'image' => '/images/legacy/blog-tusker.jpg',
                'excerpt' => 'A story about tusker Agbo, his recovery after injury and the challenges of human-elephant coexistence in Sri Lanka.',
                'content' => '<h2>A tusker with a place in Sri Lanka’s story</h2><p>The legacy article follows Tusker Agbo (T-096), associated with the Thirappane area of the island’s North Central Province. The name Agbo recalls ancient Sri Lankan kings and the cultural importance of elephants.</p><h2>Recovery and coexistence</h2><p>Agbo was reported injured by gunshots in 2023 and later received treatment from wildlife authorities. His recovery drew attention to the difficult relationship between people and elephants, and to the importance of conservation, safe communities and humane responses to conflict.</p><p>Wild elephants are unpredictable. Observe wildlife only with qualified local professionals and at a safe distance.</p>',
                'author' => 'Xplore Lanka Travel Writer',
                'published_at' => '2025-09-06 08:00:00',
                'views_count' => 122,
                'reading_time_min' => 2,
                'tags' => ['Wildlife', 'Conservation', 'Destinations'],
            ],
            [
                'title' => 'Ancient Kingdom of Sri Lanka: Kandy',
                'slug' => 'ancient-kingdom-of-sri-lanka-kandy',
                'category' => 'Culture',
                'image' => '/images/legacy/blog-kandy.jpg',
                'excerpt' => 'Explore Kandy’s history as Sri Lanka’s last royal capital, its sacred Temple of the Tooth, Kandyan arts and the annual Esala Perahera.',
                'content' => '<h2>The last royal capital</h2><p>Set among central highland hills, Kandy served as the last royal capital of Sri Lanka before the kingdom came under British rule in 1815. Its historic centre and the Temple of the Tooth form part of a UNESCO World Heritage Site.</p><h2>Culture and living traditions</h2><p>Kandyan dance, drumming, craft traditions and the Esala Perahera procession are among the cultural experiences associated with the city. Festival dates and access arrangements vary from year to year.</p><h2>Plan a thoughtful visit</h2><p>Allow time to walk beside Kandy Lake, visit sacred places respectfully and ask local guides about current opening times and event schedules.</p>',
                'author' => 'Xplore Lanka Travel Writer',
                'published_at' => '2025-08-04 08:00:00',
                'views_count' => 40,
                'reading_time_min' => 4,
                'tags' => ['Culture', 'Kandy', 'History', 'Festivals'],
            ],
            [
                'title' => 'Kandy: A Highland City of History and Culture',
                'slug' => 'kandy-highland-city-history-culture',
                'category' => 'Travel Tips',
                'image' => '/images/legacy/cycling-kandy-1.jpg',
                'excerpt' => 'A short guide to Kandy Lake, the Temple of the Tooth, surrounding tea country and the city’s cultural calendar.',
                'content' => '<p>Kandy is a central Sri Lankan city on a plateau ringed by hills, tea-growing country and rainforest. Kandy Lake offers a central walking route, while Sri Dalada Maligawa (the Temple of the Tooth) is among the city’s most important sacred and historic sites.</p><p>Visitors can combine a city visit with nearby tea country. Dress respectfully at religious sites, check local festival dates before travel and follow site-specific photography guidance.</p>',
                'author' => 'Xplore Lanka Travel Writer',
                'published_at' => '2025-07-09 08:00:00',
                'views_count' => 51,
                'reading_time_min' => 1,
                'tags' => ['Travel Tips', 'Kandy', 'Culture'],
            ],
        ];

        foreach ($posts as $post) {
            $post['meta_title'] = $post['title'] . ' | Xplore Lanka';
            $post['meta_description'] = $post['excerpt'];
            $post['meta_keywords'] = implode(', ', $post['tags']);
            $post['canonical_url'] = 'https://xplorlanka.com/blog/' . $post['slug'];
            $post['is_published'] = true;
            BlogPost::updateOrCreate(['slug' => $post['slug']], $post);
        }
    }

    private function removePreviousDemoContent(): void
    {
        Review::whereIn('customer_name', [
            'Marcus & Elena Rost',
            'Charlotte & James Davies',
            'David & Liam Nguyen',
            'Sophie & Antoine Laurent',
            'Anders & Birgitta Lindqvist',
            'Jessica Roberts',
        ])->delete();

        Tour::whereIn('slug', [
            '14-day-ultimate-sri-lanka-explorer',
            '8-day-east-coast-surf-and-sun',
            '5-day-hill-country-romantic-getaway',
            '6-day-wild-safari-and-udawalawe-wildlife',
            'kandy-to-sigiriya-day-trip',
        ])->delete();

        Accommodation::whereIn('name', [
            'Ella Cloud Forest Eco Resort & Chalets',
            'Galle Fort Colonial Heritage Villa',
            'Yala Leopard Valley Glamping Safari Lodge',
            'Nuwara Eliya Heritage Tea Bungalow 1892',
            'Mirissa Oceanfront Palm Villa & Beach Club',
        ])->delete();

        Vehicle::whereIn('name', [
            'Premium AC Sedan (Toyota Axio / Prius)',
            'Luxury 4x4 SUV (Toyota Prado / Fortuner)',
            'Spacious Tourist Van (Toyota KDH High-Roof)',
            'Custom Wildlife Safari 4x4 Jeep (Toyota Land Cruiser)',
            'Executive Mini Coach (Toyota Coaster 22-Seater)',
            'Authentic Sri Lankan Tuk-Tuk Experience',
        ])->delete();

        BlogPost::whereIn('slug', [
            'ultimate-14-day-sri-lanka-travel-itinerary-2026',
            'kandy-to-ella-scenic-train-guide-tickets-timings',
            'yala-vs-udawalawe-vs-wilpattu-safari-comparison',
            'best-time-to-visit-sri-lanka-weather-guide',
        ])->delete();

        Partner::whereIn('name', [
            'Ceylon Royal Chauffeurs & Fleets',
            'Ella Vista Eco Hospitality Group',
            'Southern Coastal Escapes Ltd',
            'Yala Wild Trails & Safaris',
        ])->delete();
    }
}