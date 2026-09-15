<?php

namespace Database\Seeders;

use App\Models\Tour;
use App\Models\User;
use App\Models\Review;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@xplorelanka.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'phone' => '+94700000000',
            ]
        );
        $customer = User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'phone' => '+44700000000',
            ]
        );

        // 2. Tours
        Tour::truncate();

        $tours = [
            [
                'title'          => '14-Day Ultimate Sri Lanka Explorer',
                'slug'           => '14-day-ultimate-sri-lanka-explorer',
                'category'       => 'cultural',
                'route'          => 'Colombo - Sigiriya - Kandy - Nuwara Eliya - Ella - Yala - Mirissa - Galle',
                'duration'       => '14 Days / 13 Nights',
                'price_lkr'      => 350000,
                'price_usd'      => 1150,
                'difficulty'     => 'moderate',
                'max_group_size' => 12,
                'is_featured'    => true,
                'is_active'      => true,
                'rating'         => 4.9,
                'reviews_count'  => 48,
                'image'          => 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1920&auto=format&fit=crop',
                'video_url'      => 'https://www.youtube.com/watch?v=FOfp5X4hYeg',
                'map_center_lat' => 7.8731,
                'map_center_lng' => 80.7718,
                'tags'           => ['History', 'Nature', 'Wildlife', 'Beach'],
                'waypoints'      => [
                    ['name' => 'Colombo Airport', 'lat' => 7.1808, 'lng' => 79.8841],
                    ['name' => 'Sigiriya Rock', 'lat' => 7.9570, 'lng' => 80.7603],
                    ['name' => 'Kandy Temple', 'lat' => 7.2906, 'lng' => 80.6337],
                    ['name' => 'Ella Nine Arch', 'lat' => 6.8711, 'lng' => 81.0478],
                    ['name' => 'Yala Safari', 'lat' => 6.3770, 'lng' => 81.3323],
                    ['name' => 'Galle Fort', 'lat' => 6.0535, 'lng' => 80.2210],
                ],
                'description'    => 'The ultimate, all-encompassing grand tour of Sri Lanka. Traverse ancient cultural ruins in the Cultural Triangle, hike through misty tea plantations in the Hill Country, spot leopards on a thrilling safari in Yala, and relax on pristine southern palm-fringed beaches. Curated with private air-conditioned luxury transport, handpicked boutique hotels, and dedicated local tour experts.',
                'highlights'     => ['Sigiriya 5th Century Lion Rock Climb', 'Sacred Temple of the Tooth Relic', 'Scenic Blue Train Journey to Ella', 'Yala National Park Leopard Safari', 'UNESCO Galle Dutch Fort Walk'],
                'itinerary'      => [
                    ['day' => 'Day 1-3', 'title' => 'Cultural Triangle & Sigiriya', 'desc' => 'Arrive in Colombo and head straight to Sigiriya. Climb the iconic rock fortress at sunrise and explore Dambulla Cave Temple.'],
                    ['day' => 'Day 4-5', 'title' => 'Kandy Royal Heritage', 'desc' => 'Explore the sacred city of Kandy, visit the Temple of the Tooth Relic, stroll Peradeniya Botanical Gardens, and enjoy a traditional cultural dance.'],
                    ['day' => 'Day 6-8', 'title' => 'Ceylon Tea Country & Ella', 'desc' => 'Travel to Nuwara Eliya and board the world-famous blue train to Ella. Hike Little Adam\'s Peak and photograph the Nine Arch Bridge.'],
                    ['day' => 'Day 9-10', 'title' => 'Wild Ceylon & Yala Safari', 'desc' => 'Descend to Yala National Park for afternoon and early morning 4x4 open-top jeep safaris to spot elusive Sri Lankan leopards and wild elephants.'],
                    ['day' => 'Day 11-14', 'title' => 'Golden Coast Mirissa & Galle', 'desc' => 'Unwind in beachfront Mirissa, enjoy a sunset catamaran cruise, explore the historic cobblestone streets of Galle Fort, and return to Colombo.'],
                ],
                'gallery'        => [
                    'https://images.unsplash.com/photo-1590306122485-6db27f8a3791?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1620803525206-8c4d623ea39e?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1563200922-db3e47012b18?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80',
                ]
            ],
            [
                'title'          => '8-Day East Coast Surf & Sun',
                'slug'           => '8-day-east-coast-surf-and-sun',
                'category'       => 'beach',
                'route'          => 'Colombo - Arugam Bay - Trincomalee - Passikudah',
                'duration'       => '8 Days / 7 Nights',
                'price_lkr'      => 145000,
                'price_usd'      => 480,
                'difficulty'     => 'easy',
                'max_group_size' => 15,
                'is_featured'    => true,
                'is_active'      => true,
                'rating'         => 4.8,
                'reviews_count'  => 29,
                'image'          => 'https://images.unsplash.com/photo-1544485547-49cc3c5095f8?q=80&w=1920&auto=format&fit=crop',
                'video_url'      => 'https://www.youtube.com/watch?v=FOfp5X4hYeg',
                'map_center_lat' => 7.8576,
                'map_center_lng' => 81.6558,
                'tags'           => ['Surfing', 'Beaches', 'Relaxation', 'Snorkeling'],
                'waypoints'      => [
                    ['name' => 'Arugam Bay Point', 'lat' => 6.8436, 'lng' => 81.8248],
                    ['name' => 'Passikudah Bay', 'lat' => 7.9234, 'lng' => 81.5583],
                    ['name' => 'Pigeon Island Trincomalee', 'lat' => 8.5874, 'lng' => 81.2152],
                ],
                'description'    => 'Escape to the untouched eastern coast of Sri Lanka. Famous for its world-class point breaks in Arugam Bay, crystal clear shallow calm waters in Passikudah, and the vibrant coral reefs and marine life of Pigeon Island National Park in Trincomalee. The quintessential summer beach escape.',
                'highlights'     => ['Surfing at Main Point Arugam Bay', 'Snorkeling with Blacktip Reef Sharks at Pigeon Island', 'Shallow Water Bathing in Passikudah', 'Koneswaram Cliff Temple Sunset'],
                'itinerary'      => [
                    ['day' => 'Day 1-3', 'title' => 'Arugam Bay Surf Haven', 'desc' => 'Travel to Sri Lanka\'s surfing capital. Enjoy daily surf lessons, oceanfront cafes, and lagoon boat safaris.'],
                    ['day' => 'Day 4-5', 'title' => 'Passikudah Calm Waters', 'desc' => 'Head north to Passikudah. Walk hundreds of meters into the turquoise ocean with gentle calm waves.'],
                    ['day' => 'Day 6-8', 'title' => 'Trincomalee & Pigeon Island', 'desc' => 'Explore Trincomalee, visit the cliff-side Koneswaram Temple, and take a speedboat to snorkel Pigeon Island reefs.'],
                ],
                'gallery'        => [
                    'https://images.unsplash.com/photo-1616110903822-1d70a448d3db?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
                ]
            ],
            [
                'title'          => '5-Day Hill Country Romantic Getaway',
                'slug'           => '5-day-hill-country-romantic-getaway',
                'category'       => 'nature',
                'route'          => 'Kandy - Nuwara Eliya - Ella',
                'duration'       => '5 Days / 4 Nights',
                'price_lkr'      => 95000,
                'price_usd'      => 315,
                'difficulty'     => 'moderate',
                'max_group_size' => 2,
                'is_featured'    => true,
                'is_active'      => true,
                'rating'         => 4.9,
                'reviews_count'  => 36,
                'image'          => 'https://images.unsplash.com/photo-1623126908029-58cb08a2b0fa?q=80&w=1920&auto=format&fit=crop',
                'video_url'      => 'https://www.youtube.com/watch?v=FOfp5X4hYeg',
                'map_center_lat' => 6.8781,
                'map_center_lng' => 80.7718,
                'tags'           => ['Honeymoon', 'Mountains', 'Couples', 'Tea'],
                'waypoints'      => [
                    ['name' => 'Kandy Lake', 'lat' => 7.2906, 'lng' => 80.6337],
                    ['name' => 'Nuwara Eliya High Tea', 'lat' => 6.9497, 'lng' => 80.7828],
                    ['name' => 'Ella Gap & Viewpoint', 'lat' => 6.8711, 'lng' => 81.0478],
                ],
                'description'    => 'A specially curated journey for couples and honeymooners. Escape the tropical heat and retreat to the cool, misty mountains of Sri Lanka. Stay in luxury heritage planters bungalows, savor private tea tastings overlooking endless emerald valleys, and experience the magical scenic train ride to Ella.',
                'highlights'     => ['Luxury Boutique Planters Bungalows', 'Private Ceylon Tea Tasting Session', 'First-Class Scenic Train Ride', 'Romantic Candlelit Dinner in Ella'],
                'itinerary'      => [
                    ['day' => 'Day 1', 'title' => 'Arrival & Kandy Royalty', 'desc' => 'Arrive and transfer to a luxury boutique hotel in Kandy. Enjoy a peaceful evening stroll around the lake.'],
                    ['day' => 'Day 2-3', 'title' => 'Little England & Tea Trails', 'desc' => 'Drive through cascading waterfalls to Nuwara Eliya. Private tea factory masterclass and high tea experience.'],
                    ['day' => 'Day 4-5', 'title' => 'Magical Ella Panorama', 'desc' => 'Take the scenic blue train to Ella. Hike Little Adam\'s Peak at sunrise and enjoy a farewell private dinner.'],
                ],
                'gallery'        => [
                    'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
                ]
            ],
            [
                'title'          => '6-Day Wild Safari & Udawalawe Wildlife',
                'slug'           => '6-day-wild-safari-and-udawalawe-wildlife',
                'category'       => 'wildlife',
                'route'          => 'Colombo - Sinharaja - Udawalawe - Yala - Bundala',
                'duration'       => '6 Days / 5 Nights',
                'price_lkr'      => 175000,
                'price_usd'      => 580,
                'difficulty'     => 'moderate',
                'max_group_size' => 8,
                'is_featured'    => true,
                'is_active'      => true,
                'rating'         => 4.9,
                'reviews_count'  => 41,
                'image'          => 'https://images.unsplash.com/photo-1563200922-db3e47012b18?q=80&w=1920&auto=format&fit=crop',
                'video_url'      => 'https://www.youtube.com/watch?v=FOfp5X4hYeg',
                'map_center_lat' => 6.4250,
                'map_center_lng' => 80.8500,
                'tags'           => ['Leopards', 'Elephants', 'Safari', 'Birds'],
                'waypoints'      => [
                    ['name' => 'Sinharaja Rainforest', 'lat' => 6.4000, 'lng' => 80.4500],
                    ['name' => 'Udawalawe Elephant Sanctuary', 'lat' => 6.4745, 'lng' => 80.8987],
                    ['name' => 'Yala Block 1', 'lat' => 6.3770, 'lng' => 81.3323],
                ],
                'description'    => 'Encounter Sri Lanka\'s extraordinary biodiversity. Track endemic bird species in the UNESCO Sinharaja Rainforest, observe herds of wild Asian elephants in Udawalawe, and search for the highest density of wild leopards on Earth in Yala National Park.',
                'highlights'     => ['Private Safari Jeeps with Expert Naturalist', 'Herds of Wild Asian Elephants', 'Sinharaja Rainforest Trek', 'Yala Leopard Tracking'],
                'itinerary'      => [
                    ['day' => 'Day 1-2', 'title' => 'Sinharaja Rainforest Ecology', 'desc' => 'Guided trek through virgin tropical rainforest with endemic birds and flora.'],
                    ['day' => 'Day 3-4', 'title' => 'Udawalawe Elephants', 'desc' => 'Visit Elephant Transit Home and take a sunset safari across Udawalawe reservoir.'],
                    ['day' => 'Day 5-6', 'title' => 'Yala Leopard Kingdom', 'desc' => 'Full morning safari in Yala National Park and wildlife photography session.'],
                ],
                'gallery'        => [
                    'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80',
                ]
            ]
        ];

        foreach ($tours as $t) {
            Tour::create($t);
        }

        // 3. Google Verified Reviews & Testimonials
        Review::truncate();
        $tour1 = Tour::where('slug', '14-day-ultimate-sri-lanka-explorer')->first() ?? Tour::first();
        $tour2 = Tour::where('slug', '8-day-east-coast-surf-and-sun')->first() ?? Tour::first();
        $tour3 = Tour::where('slug', '5-day-hill-country-romantic-getaway')->first() ?? Tour::first();
        $tour4 = Tour::where('slug', '6-day-wild-safari-and-udawalawe-wildlife')->first() ?? Tour::first();

        $reviews = [
            [
                'tour_id'          => $tour1->id,
                'user_id'          => $customer->id,
                'customer_name'    => 'Marcus & Elena Rost',
                'customer_country' => 'Germany',
                'title'            => 'Exceptional 14-day journey — our guide Nuwan was world-class!',
                'rating'           => 5,
                'comment'          => 'We booked the 14-day ultimate tour through Xplor Lanka and it exceeded every expectation. Our private driver and guide Nuwan was attentive, safe, punctual, and shared incredible knowledge of Sri Lankan history. The sunrise climb at Sigiriya and spotting two leopards in Yala will stay in our memories forever! Every hotel was clean, boutique, and hospitable.',
                'media_urls'       => [
                    'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1590306122485-6db27f8a3791?auto=format&fit=crop&w=800&q=80',
                ],
                'is_approved'      => true,
            ],
            [
                'tour_id'          => $tour3->id,
                'user_id'          => null,
                'customer_name'    => 'Charlotte & James Davies',
                'customer_country' => 'United Kingdom',
                'title'            => 'Dream honeymoon in the Hill Country & Ceylon Tea Trails',
                'rating'           => 5,
                'comment'          => 'From the moment we were picked up at Bandaranaike Airport, Xplor Lanka took care of every detail. The heritage planters bungalow in Nuwara Eliya felt like stepping back in time, and the scenic train ride to Ella had reserved first-class seats arranged flawlessly. Truly 5-star service with authentic local warmth.',
                'media_urls'       => [
                    'https://images.unsplash.com/photo-1623126908029-58cb08a2b0fa?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
                ],
                'is_approved'      => true,
            ],
            [
                'tour_id'          => $tour4->id,
                'user_id'          => null,
                'customer_name'    => 'David & Liam Nguyen',
                'customer_country' => 'Australia',
                'title'            => 'Wild Ceylon Safari was the highlight for our family',
                'rating'           => 5,
                'comment'          => 'Traveling with two teenagers, we wanted nature, excitement, and wildlife. The private 4x4 safari jeeps in Udawalawe got us up-close with majestic elephant herds, and our naturalist in Yala was extraordinary. The AC van was spotless and had bottled water & Wi-Fi throughout.',
                'media_urls'       => [
                    'https://images.unsplash.com/photo-1563200922-db3e47012b18?auto=format&fit=crop&w=800&q=80',
                ],
                'is_approved'      => true,
            ],
            [
                'tour_id'          => $tour2->id,
                'user_id'          => null,
                'customer_name'    => 'Sophie & Antoine Laurent',
                'customer_country' => 'France',
                'title'            => 'Unbeatable surfing & tranquility in Arugam Bay',
                'rating'           => 5,
                'comment'          => 'The East Coast tour was paradise! Crystal blue waters, relaxed vibe, and pristine surf conditions. Xplor Lanka hooked us up with top local surf instructors and great seafood spots. Pigeon Island snorkeling with baby reef sharks was breathtaking.',
                'media_urls'       => [
                    'https://images.unsplash.com/photo-1544485547-49cc3c5095f8?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1616110903822-1d70a448d3db?auto=format&fit=crop&w=800&q=80',
                ],
                'is_approved'      => true,
            ],
            [
                'tour_id'          => $tour1->id,
                'user_id'          => null,
                'customer_name'    => 'Anders & Birgitta Lindqvist',
                'customer_country' => 'Sweden',
                'title'            => 'Authentic Sri Lanka, great organization and flexibility',
                'rating'           => 5,
                'comment'          => 'We loved that our itinerary was customized to our pace. When we wanted an extra stop for fresh king coconut by the road or to see a spice garden, our guide happily accommodated us. Sri Lankan curries were outstanding everywhere we went. Highly recommend Xplor Lanka!',
                'media_urls'       => [
                    'https://images.unsplash.com/photo-1620803525206-8c4d623ea39e?auto=format&fit=crop&w=800&q=80',
                ],
                'is_approved'      => true,
            ],
            [
                'tour_id'          => $tour1->id,
                'user_id'          => null,
                'customer_name'    => 'Jessica Roberts',
                'customer_country' => 'United States',
                'title'            => 'Solo female traveler — felt 100% safe and welcomed',
                'rating'           => 5,
                'comment'          => 'As a solo traveler visiting Asia for the first time, safety was my highest priority. Xplor Lanka made me feel like family. Prompt communication on WhatsApp, fantastic hotel choices, and genuine respect. The Nine Arch Bridge train crossing is something you have to see in person!',
                'media_urls'       => [
                    'https://images.unsplash.com/photo-1590306122485-6db27f8a3791?auto=format&fit=crop&w=800&q=80',
                ],
                'is_approved'      => true,
            ],
        ];

        foreach ($reviews as $rev) {
            Review::create($rev);
        }
    }
}
