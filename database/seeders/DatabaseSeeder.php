<?php

namespace Database\Seeders;

use App\Models\Accommodation;
use App\Models\BlogPost;
use App\Models\Partner;
use App\Models\Review;
use App\Models\Tour;
use App\Models\User;
use App\Models\Vehicle;
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
                'phone' => '+94763762763',
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
        $partnerUser = User::firstOrCreate(
            ['email' => 'partner@xplorelanka.com'],
            [
                'name' => 'Chathura Fernando',
                'password' => Hash::make('password'),
                'role' => 'staff',
                'phone' => '+94771234567',
            ]
        );

        // 2. Partners
        Partner::truncate();

        $partner1 = Partner::create([
            'name'                        => 'Ceylon Royal Chauffeurs & Fleets',
            'email'                       => 'fleet@ceylonroyal.lk',
            'phone'                       => '+94771234567',
            'partner_type'                => 'vehicle_owner',
            'location'                    => 'Colombo / Kandy',
            'vehicle_or_property_details' => 'Fleet of 18 AC Sedans, KDH Vans, Prado SUVs, and 4x4 Jeeps',
            'rate_lkr'                    => 120.00,
            'rating'                      => 4.95,
            'message'                     => 'Top-tier licensed tourist drivers with English fluency and GPS tracking.',
            'status'                      => 'approved',
        ]);

        $partner2 = Partner::create([
            'name'                        => 'Ella Vista Eco Hospitality Group',
            'email'                       => 'stay@ellavista.lk',
            'phone'                       => '+94572234567',
            'partner_type'                => 'accommodation_owner',
            'location'                    => 'Ella & Nuwara Eliya',
            'vehicle_or_property_details' => 'Boutique mountain retreats & luxury tea estate bungalows',
            'rate_lkr'                    => 24000.00,
            'rating'                      => 4.90,
            'message'                     => 'Eco-certified luxury lodges with panoramic valley and waterfall views.',
            'status'                      => 'approved',
        ]);

        $partner3 = Partner::create([
            'name'                        => 'Southern Coastal Escapes Ltd',
            'email'                       => 'info@southernescapes.lk',
            'phone'                       => '+94912234567',
            'partner_type'                => 'accommodation_owner',
            'location'                    => 'Galle & Mirissa',
            'vehicle_or_property_details' => 'Heritage Dutch mansions and beachfront boutique villas',
            'rate_lkr'                    => 35000.00,
            'rating'                      => 4.88,
            'message'                     => 'Bespoke colonial and tropical modern villas along the southern coast.',
            'status'                      => 'approved',
        ]);

        $partner4 = Partner::create([
            'name'                        => 'Yala Wild Trails & Safaris',
            'email'                       => 'safari@yalawildtrails.lk',
            'phone'                       => '+94472234567',
            'partner_type'                => 'vehicle_owner',
            'location'                    => 'Yala / Tissamaharama / Udawalawe',
            'vehicle_or_property_details' => 'Customized open-top Toyota Land Cruiser 4x4 Safari Jeeps',
            'rate_lkr'                    => 180.00,
            'rating'                      => 4.98,
            'message'                     => 'Expert naturalists and wildlife trackers with high-suspension safari jeeps.',
            'status'                      => 'approved',
        ]);

        // 3. Tours
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

        // 4. Accommodations
        Accommodation::truncate();

        $accommodations = [
            [
                'partner_id'    => $partner2->id,
                'name'          => 'Ella Cloud Forest Eco Resort & Chalets',
                'category'      => 'Eco Lodge',
                'location'      => 'Ella, Hill Country',
                'latitude'      => 6.8667,
                'longitude'     => 81.0466,
                'price_lkr'     => 28500.00,
                'period'        => 'night',
                'rating'        => 4.92,
                'reviews_count' => 34,
                'image'         => 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop',
                'gallery'       => [
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop'
                ],
                'amenities'     => ['Mountain View', 'Infinity Pool', 'Free Breakfast', 'High-Speed Wi-Fi', 'Balcony / Terrace', 'Eco Friendly'],
                'room_types'    => ['Deluxe Mountain View Chalet', 'Panoramic Valley Suite', 'Family Eco Treehouse'],
                'description'   => 'Perched on the misty slopes of Ella Gap, this eco-certified retreat offers breathtaking 180-degree valley vistas, farm-to-table organic dining, and direct access to hiking trails leading to Little Adam\'s Peak and the Nine Arch Bridge.',
                'contact_phone' => '+94 57 223 4567',
                'contact_email' => 'booking@ellacloudforest.lk',
                'is_available'  => true,
                'is_featured'   => true,
            ],
            [
                'partner_id'    => $partner3->id,
                'name'          => 'Galle Fort Colonial Heritage Villa',
                'category'      => 'Boutique Villa',
                'location'      => 'Galle Fort, Southern Province',
                'latitude'      => 6.0329,
                'longitude'     => 80.2168,
                'price_lkr'     => 42000.00,
                'period'        => 'night',
                'rating'        => 4.95,
                'reviews_count' => 52,
                'image'         => 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop',
                'gallery'       => [
                    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop'
                ],
                'amenities'     => ['Private Courtyard Pool', 'Air Conditioning', 'Butler Service', 'Historic Architecture', 'Free Wi-Fi', 'Gourmet Breakfast'],
                'room_types'    => ['Governor Suite', 'Dutch Colonial King Room', 'Courtyard Garden Suite'],
                'description'   => 'An exquisite 18th-century Dutch colonial townhouse meticulously restored into a 5-star boutique sanctuary inside the UNESCO World Heritage Galle Fort. Features antique four-poster teak beds, shaded frangipani courtyards, and gourmet Ceylon fusion cuisine.',
                'contact_phone' => '+94 91 223 9988',
                'contact_email' => 'concierge@galleheritagevilla.lk',
                'is_available'  => true,
                'is_featured'   => true,
            ],
            [
                'partner_id'    => $partner4->id,
                'name'          => 'Yala Leopard Valley Glamping Safari Lodge',
                'category'      => 'Safari Glamping',
                'location'      => 'Yala National Park Border',
                'latitude'      => 6.3725,
                'longitude'     => 81.3340,
                'price_lkr'     => 38000.00,
                'period'        => 'night',
                'rating'        => 4.88,
                'reviews_count' => 27,
                'image'         => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
                'gallery'       => [
                    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop'
                ],
                'amenities'     => ['Luxury Canvas Tents', 'Open-Air Jungle Showers', 'Bush BBQs & Bonfires', 'Air Conditioning', 'All Meals Included', '4x4 Game Drives'],
                'room_types'    => ['Luxury Safari Tent', 'Family Wilderness Suite', 'Stargazer Safari Pod'],
                'description'   => 'Immerse yourself in the untamed wilderness bordering Yala National Park. Sleep in air-conditioned luxury canvas suites with private decks, enjoy lantern-lit dinners under starlit skies, and embark on thrilling leopard tracking game drives with resident naturalists.',
                'contact_phone' => '+94 47 223 7711',
                'contact_email' => 'safari@yalaglamping.lk',
                'is_available'  => true,
                'is_featured'   => true,
            ],
            [
                'partner_id'    => $partner2->id,
                'name'          => 'Nuwara Eliya Heritage Tea Bungalow 1892',
                'category'      => 'Heritage Bungalow',
                'location'      => 'Nuwara Eliya, Central Highlands',
                'latitude'      => 6.9497,
                'longitude'     => 80.7828,
                'price_lkr'     => 32000.00,
                'period'        => 'night',
                'rating'        => 4.90,
                'reviews_count' => 41,
                'image'         => 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop',
                'gallery'       => [
                    'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1200&auto=format&fit=crop'
                ],
                'amenities'     => ['Fireplace in Rooms', 'High Tea Lawn', 'Tea Garden Walks', 'Butler Service', 'Heating', 'Fine Dining'],
                'room_types'    => ['Planters Master Suite', 'Rose Garden Room', 'Highland View Chalet'],
                'description'   => 'Experience the timeless romance of British colonial Ceylon. Surrounded by rolling emerald tea plantations and manicured rose gardens, enjoy roaring open log fireplaces, authentic afternoon high teas, and master tea tasting tours.',
                'contact_phone' => '+94 52 222 3344',
                'contact_email' => 'stay@nuwaraeliyaheritagetea.lk',
                'is_available'  => true,
                'is_featured'   => false,
            ],
            [
                'partner_id'    => $partner3->id,
                'name'          => 'Mirissa Oceanfront Palm Villa & Beach Club',
                'category'      => 'Beach Resort',
                'location'      => 'Mirissa Beach, Southern Province',
                'latitude'      => 5.9482,
                'longitude'     => 80.4560,
                'price_lkr'     => 36000.00,
                'period'        => 'night',
                'rating'        => 4.87,
                'reviews_count' => 48,
                'image'         => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
                'gallery'       => [
                    'https://images.unsplash.com/photo-1616110903822-1d70a448d3db?q=80&w=1200&auto=format&fit=crop'
                ],
                'amenities'     => ['Direct Beach Access', 'Ocean View Pool', 'Seafood Bar', 'Surfboard Rentals', 'AC', 'Spa'],
                'room_types'    => ['Sunset Ocean View Suite', 'Deluxe Beachfront King', 'Palm Garden Villa'],
                'description'   => 'Step directly onto the golden sands of Mirissa. Featuring modern bohemian architecture, a beachfront infinity pool overlooking the surf break, and daily whale-watching yacht charters departing from the nearby harbor.',
                'contact_phone' => '+94 41 225 6677',
                'contact_email' => 'beach@mirissaoceanfront.lk',
                'is_available'  => true,
                'is_featured'   => true,
            ]
        ];

        foreach ($accommodations as $acc) {
            Accommodation::create($acc);
        }

        // 5. Vehicles
        Vehicle::truncate();

        $vehicles = [
            [
                'partner_id'       => $partner1->id,
                'vehicle_key'      => 'sedan_car',
                'vehicle_category' => 'Sedan / Car',
                'name'             => 'Premium AC Sedan (Toyota Axio / Prius)',
                'seats'            => '1 - 3 Passengers',
                'luggage_capacity' => 3,
                'transmission'     => 'Automatic',
                'fuel_type'        => 'Hybrid / Petrol',
                'rate_per_km'      => 'Rs. 110 / km',
                'base_rate_lkr'    => 12000.00,
                'daily_rate_lkr'   => 15000.00,
                'pricing_tiers'    => [
                    ['tier' => 'Short Transfer (< 100km)', 'rate' => 'Rs. 130 / km'],
                    ['tier' => 'Multi-Day Island Tour (> 3 days)', 'rate' => 'Rs. 110 / km + daily chauffeur allowance'],
                    ['tier' => 'Airport Express Drop / Pickup', 'rate' => 'Fixed Rs. 14,000 (CMB Airport)']
                ],
                'icon'             => 'Car',
                'image'            => 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop',
                'gallery'          => [
                    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop'
                ],
                'description'      => 'Ideal for solo travelers and couples seeking smooth, fuel-efficient, and comfortable travel across Sri Lanka with a polite, licensed English-speaking chauffeur.',
                'driver_included'  => true,
                'ac_available'     => true,
                'is_available'     => true,
                'fleet_count'      => 8,
            ],
            [
                'partner_id'       => $partner1->id,
                'vehicle_key'      => 'luxury_suv',
                'vehicle_category' => 'Luxury SUV',
                'name'             => 'Luxury 4x4 SUV (Toyota Prado / Fortuner)',
                'seats'            => '1 - 4 Passengers',
                'luggage_capacity' => 4,
                'transmission'     => 'Automatic 4WD',
                'fuel_type'        => 'Diesel',
                'rate_per_km'      => 'Rs. 185 / km',
                'base_rate_lkr'    => 25000.00,
                'daily_rate_lkr'   => 32000.00,
                'pricing_tiers'    => [
                    ['tier' => 'Hill Country & Rough Terrain Tour', 'rate' => 'Rs. 195 / km'],
                    ['tier' => 'VIP Chauffeur Island Package', 'rate' => 'Rs. 185 / km + Rs. 5,000 / day allowance'],
                ],
                'icon'             => 'ShieldCheck',
                'image'            => 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop',
                'gallery'          => [
                    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop'
                ],
                'description'      => 'The pinnacle of travel luxury and rugged hill-country stability. Features leather seating, panoramic climate control, dual sunroofs, and high ground clearance for mountain climbs.',
                'driver_included'  => true,
                'ac_available'     => true,
                'is_available'     => true,
                'fleet_count'      => 4,
            ],
            [
                'partner_id'       => $partner1->id,
                'vehicle_key'      => 'passenger_van',
                'vehicle_category' => 'Passenger Van',
                'name'             => 'Spacious Tourist Van (Toyota KDH High-Roof)',
                'seats'            => '4 - 9 Passengers',
                'luggage_capacity' => 8,
                'transmission'     => 'Automatic',
                'fuel_type'        => 'Diesel',
                'rate_per_km'      => 'Rs. 140 / km',
                'base_rate_lkr'    => 18000.00,
                'daily_rate_lkr'   => 22000.00,
                'pricing_tiers'    => [
                    ['tier' => 'Family & Group Round Island', 'rate' => 'Rs. 140 / km'],
                    ['tier' => 'Airport Group Transfer', 'rate' => 'Fixed Rs. 20,000 (CMB Airport)'],
                ],
                'icon'             => 'Users',
                'image'            => 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1200&auto=format&fit=crop',
                'gallery'          => [
                    'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop'
                ],
                'description'      => 'Sri Lanka’s most popular vehicle choice for families and small groups. Features high-roof cabin space, reclining velvet seats, dual air conditioning, and ample room for 8+ large suitcases.',
                'driver_included'  => true,
                'ac_available'     => true,
                'is_available'     => true,
                'fleet_count'      => 12,
            ],
            [
                'partner_id'       => $partner4->id,
                'vehicle_key'      => 'safari_jeep',
                'vehicle_category' => '4x4 Safari Jeep',
                'name'             => 'Custom Wildlife Safari 4x4 Jeep (Toyota Land Cruiser)',
                'seats'            => '1 - 6 Passengers',
                'luggage_capacity' => 2,
                'transmission'     => 'Manual 4x4 Heavy Duty',
                'fuel_type'        => 'Diesel',
                'rate_per_km'      => 'Rs. 220 / km',
                'base_rate_lkr'    => 22000.00,
                'daily_rate_lkr'   => 28000.00,
                'pricing_tiers'    => [
                    ['tier' => 'Half-Day Safari Drive (4 Hours)', 'rate' => 'Fixed Rs. 22,000 + Park Entrance'],
                    ['tier' => 'Full-Day Wildlife Safari with Naturalist', 'rate' => 'Fixed Rs. 38,000 + Park Entrance'],
                ],
                'icon'             => 'Compass',
                'image'            => 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop',
                'gallery'          => [
                    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop'
                ],
                'description'      => 'Equipped specifically for national park wildlife viewing in Yala, Udawalawe, and Wilpattu. Raised tiered seats for 360-degree photography, sun canopy, and an experienced wildlife tracker.',
                'driver_included'  => true,
                'ac_available'     => false,
                'is_available'     => true,
                'fleet_count'      => 6,
            ],
            [
                'partner_id'       => $partner1->id,
                'vehicle_key'      => 'mini_coach',
                'vehicle_category' => 'Mini Coach / Bus',
                'name'             => 'Executive Mini Coach (Toyota Coaster 22-Seater)',
                'seats'            => '10 - 22 Passengers',
                'luggage_capacity' => 20,
                'transmission'     => 'Manual',
                'fuel_type'        => 'Diesel',
                'rate_per_km'      => 'Rs. 240 / km',
                'base_rate_lkr'    => 35000.00,
                'daily_rate_lkr'   => 45000.00,
                'pricing_tiers'    => [
                    ['tier' => 'Large Tour Delegation (> 5 Days)', 'rate' => 'Rs. 240 / km'],
                    ['tier' => 'Corporate Event Transfer', 'rate' => 'Rs. 280 / km'],
                ],
                'icon'             => 'Bus',
                'image'            => 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop',
                'gallery'          => [],
                'description'      => 'Tailored for large delegations, wedding parties, and group excursions. Complete with microphone PA sound system, overhead luggage racks, underfloor luggage bays, and panoramic tinted windows.',
                'driver_included'  => true,
                'ac_available'     => true,
                'is_available'     => true,
                'fleet_count'      => 3,
            ],
            [
                'partner_id'       => $partner1->id,
                'vehicle_key'      => 'tuk_tuk',
                'vehicle_category' => 'Tuk-Tuk / Three-Wheeler',
                'name'             => 'Authentic Sri Lankan Tuk-Tuk Experience',
                'seats'            => '1 - 2 Passengers',
                'luggage_capacity' => 2,
                'transmission'     => 'Manual 4-Speed',
                'fuel_type'        => 'Petrol 4-Stroke',
                'rate_per_km'      => 'Rs. 80 / km',
                'base_rate_lkr'    => 5000.00,
                'daily_rate_lkr'   => 8000.00,
                'pricing_tiers'    => [
                    ['tier' => 'City Street Food Tour (3 Hours)', 'rate' => 'Fixed Rs. 6,500'],
                    ['tier' => 'Daily Rental for Self-Driving (IDP Required)', 'rate' => 'Rs. 8,000 / day'],
                ],
                'icon'             => 'Zap',
                'image'            => 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1200&auto=format&fit=crop',
                'gallery'          => [],
                'description'      => 'The most iconic way to explore lively local towns, spice villages, tea estates, and beachside coastal roads. Fun, agile, and culturally authentic.',
                'driver_included'  => true,
                'ac_available'     => false,
                'is_available'     => true,
                'fleet_count'      => 5,
            ]
        ];

        foreach ($vehicles as $v) {
            Vehicle::create($v);
        }

        // 6. Blog Posts (SEO-Friendly)
        BlogPost::truncate();

        $blogs = [
            [
                'title'            => 'The Ultimate 14-Day Sri Lanka Travel Itinerary (2026 Edition)',
                'slug'             => 'ultimate-14-day-sri-lanka-travel-itinerary-2026',
                'category'         => 'Travel Guides',
                'meta_title'       => 'Ultimate 14-Day Sri Lanka Travel Itinerary (2026 Guide) | Xplor Lanka',
                'meta_description' => 'Planning a trip to Sri Lanka? Follow our comprehensive 2-week itinerary covering Sigiriya, Kandy, Nuwara Eliya, Ella, Yala safari, and Galle Fort with practical travel tips.',
                'meta_keywords'    => 'Sri Lanka 14 day itinerary, 2 weeks Sri Lanka, Sri Lanka travel guide 2026, Sigiriya to Galle tour',
                'canonical_url'    => 'https://xplorelanka.com/blog/ultimate-14-day-sri-lanka-travel-itinerary-2026',
                'image'            => 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1200&auto=format&fit=crop',
                'excerpt'          => 'From the ancient rock fortress of Sigiriya to misty tea trails in Ella and leopard safaris in Yala, here is the quintessential 2-week travel blueprint.',
                'content'          => '<h2>Why Sri Lanka is 2026’s #1 Island Destination</h2>
<p>Sri Lanka packs an unbelievable diversity of landscapes into a compact island: UNESCO ancient royal capitals, misty highlands blanketed in emerald Ceylon tea, dense wildlife jungles teeming with leopards and elephants, and golden palm-fringed coastlines.</p>

<h3>Day 1-3: The Cultural Triangle & Sigiriya Lion Rock</h3>
<p>Land at Bandaranaike International Airport (CMB) and head straight to Sigiriya. Start your morning with an early sunrise climb to the summit of the 5th-century Lion Rock fortress, followed by an afternoon safari in Minneriya National Park to witness hundreds of wild Asian elephants grazing at the ancient reservoir.</p>

<h3>Day 4-6: Kandy & The Sacred Hill Country</h3>
<p>Travel south to Kandy, the spiritual heart of the island. Pay homage at the Temple of the Tooth Relic, wander through the Royal Botanical Gardens at Peradeniya, and savor authentic spicy kottu roti in local street cafes.</p>

<h3>Day 7-9: Ella & The Scenic Blue Train</h3>
<p>Board the legendary blue train from Nuwara Eliya (Nanu Oya) to Ella. It is universally recognized as one of the world\'s most scenic train rides, winding through endless cascades, mountain passes, and tea estates. While in Ella, don’t miss photographing the Nine Arch Bridge and trekking Little Adam’s Peak at dawn.</p>

<h3>Day 10-11: Yala Safari & Leopard Tracking</h3>
<p>Descend into the dry southern lowlands for private 4x4 open-top game drives in Yala National Park, home to the world\'s highest leopard density alongside sloth bears, crocodiles, and wild peacocks.</p>

<h3>Day 12-14: Historic Galle Fort & Mirissa Coast</h3>
<p>Conclude your journey strolling cobblestone alleys in UNESCO Galle Dutch Fort, watching stilt fishermen in Weligama, and sipping fresh king coconuts on Mirissa Beach.</p>',
                'author'           => 'Kasun Jayawardena',
                'published_at'     => now()->subDays(2),
                'is_published'     => true,
                'views_count'      => 1420,
                'reading_time_min' => 7,
                'tags'             => ['Itineraries', 'Sigiriya', 'Ella', 'Safaris', 'Cultural Triangle'],
            ],
            [
                'title'            => 'Complete Guide to the Kandy to Ella Scenic Train: Tickets, Timings & Tips',
                'slug'             => 'kandy-to-ella-scenic-train-guide-tickets-timings',
                'category'         => 'Highland & Trains',
                'meta_title'       => 'Kandy to Ella Train: Complete Guide to Tickets, Classes & Tips | Xplor Lanka',
                'meta_description' => 'Everything you need to know about booking and riding the world-famous Kandy to Ella train in Sri Lanka: best seat sides, 1st vs 2nd class, and timetable tips.',
                'meta_keywords'    => 'Kandy to Ella train, Sri Lanka scenic train, Nanu Oya train, Ella train tickets 2026',
                'canonical_url'    => 'https://xplorelanka.com/blog/kandy-to-ella-scenic-train-guide-tickets-timings',
                'image'            => 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop',
                'excerpt'          => 'Riding the blue train through Sri Lanka\'s highlands is an unforgettable bucket-list journey. Here is how to book tickets, choose your class, and get the best photography vantage points.',
                'content'          => '<h2>The World’s Most Beautiful Train Ride</h2>
<p>The 7-hour railway stretch between Kandy and Ella takes passengers through lush emerald tea estates, mist-shrouded mountain ridges, plunging valleys, and dramatic viaduct bridges.</p>

<h3>1st Class vs 2nd Class vs 3rd Class</h3>
<ul>
<li><strong>1st Class AC:</strong> Comfortable, reserved seating with air conditioning, but sealed windows that prevent hanging out of doorways or taking clear photos.</li>
<li><strong>2nd Class Reserved (Recommended):</strong> Cushioned reserved seats with openable windows and open doorways, ideal for breeze and photography.</li>
<li><strong>3rd Class Reserved:</strong> Budget-friendly with great local ambiance, but can be bustling and lively.</li>
</ul>

<h3>Which Side to Sit On?</h3>
<p>From Kandy to Nuwara Eliya (Nanu Oya), the right-side seats offer the best views of waterfalls. From Nanu Oya to Ella, switch to the left-side seats for sweeping tea plantations and valley drop-offs!</p>',
                'author'           => 'Elena Rost',
                'published_at'     => now()->subDays(5),
                'is_published'     => true,
                'views_count'      => 2180,
                'reading_time_min' => 5,
                'tags'             => ['Trains', 'Ella', 'Nuwara Eliya', 'Photography', 'Budget Tips'],
            ],
            [
                'title'            => 'Yala vs Udawalawe vs Wilpattu: Which Sri Lanka Safari is Best?',
                'slug'             => 'yala-vs-udawalawe-vs-wilpattu-safari-comparison',
                'category'         => 'Wildlife & Safaris',
                'meta_title'       => 'Yala vs Udawalawe vs Wilpattu Safari Comparison | Xplor Lanka',
                'meta_description' => 'Comparing Sri Lanka\'s top wildlife national parks. Find out whether Yala, Udawalawe, or Wilpattu is best for seeing leopards, elephant herds, and rare birds.',
                'meta_keywords'    => 'Yala safari vs Udawalawe, Wilpattu national park, best safari in Sri Lanka, Sri Lanka leopards elephants',
                'canonical_url'    => 'https://xplorelanka.com/blog/yala-vs-udawalawe-vs-wilpattu-safari-comparison',
                'image'            => 'https://images.unsplash.com/photo-1563200922-db3e47012b18?q=80&w=1200&auto=format&fit=crop',
                'excerpt'          => 'Trying to choose between Sri Lanka’s national parks? We compare leopards in Yala, huge elephant gatherings in Udawalawe, and serene wilderness in Wilpattu.',
                'content'          => '<h2>Sri Lanka: The Safari Capital of Asia</h2>
<p>Sri Lanka has the highest biodiversity density in Asia. Depending on what wildlife encounters you value most, here is a detailed breakdown of each major park:</p>

<h3>1. Yala National Park: Best for Elusive Leopards</h3>
<p>Yala Block 1 holds the highest concentration of leopards in the world. It also features coastal lagoons, spotted deer, mugger crocodiles, and sloth bears.</p>

<h3>2. Udawalawe National Park: Guaranteed Elephant Herds</h3>
<p>With open grasslands resembling an East African savannah, Udawalawe offers almost 100% guaranteed sightings of wild elephant herds, playful calves, and water buffaloes grazing around the large reservoir.</p>

<h3>3. Wilpattu National Park: Dense Jungles & Serenity</h3>
<p>Sri Lanka’s largest park is famous for natural lakes ("villus") where wildlife comes to drink. It offers a much quieter, less crowded safari experience with great chances of spotting sloth bears and leopards.</p>',
                'author'           => 'Rohan Samarasinghe',
                'published_at'     => now()->subDays(8),
                'is_published'     => true,
                'views_count'      => 980,
                'reading_time_min' => 6,
                'tags'             => ['Wildlife', 'Yala', 'Udawalawe', 'Wilpattu', 'Safaris'],
            ],
            [
                'title'            => 'Best Time to Visit Sri Lanka: Climate, Seasons & Weather Guide',
                'slug'             => 'best-time-to-visit-sri-lanka-weather-guide',
                'category'         => 'Practical Tips',
                'meta_title'       => 'Best Time to Visit Sri Lanka: Month-by-Month Weather Guide | Xplor Lanka',
                'meta_description' => 'Discover the best season to visit Sri Lanka. Understand the dual monsoons and learn when to visit the South Coast vs East Coast for perfect sunshine.',
                'meta_keywords'    => 'Best time to visit Sri Lanka, Sri Lanka weather seasons, Sri Lanka monsoon guide, when to go to Sri Lanka',
                'canonical_url'    => 'https://xplorelanka.com/blog/best-time-to-visit-sri-lanka-weather-guide',
                'image'            => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
                'excerpt'          => 'Sri Lanka is a year-round destination thanks to its dual monsoon system. Learn which coast is sunny at any time of the year.',
                'content'          => '<h2>Understanding Sri Lanka’s Dual Monsoon Microclimates</h2>
<p>Because Sri Lanka experiences two distinct monsoon systems, there is always a sunny, dry coast waiting for you at any given month of the year!</p>

<h3>December to April: The West & South Coast Season</h3>
<p>Ideal for Galle, Mirissa, Weligama, Bentota, Colombo, and the Hill Country (Kandy & Ella). Expect clear blue skies, calm waters for whale watching, and dry hiking trails.</p>

<h3>May to September: The East Coast Season</h3>
<p>While the south experiences southwest monsoon rains, the East Coast (Arugam Bay, Trincomalee, Passikudah) enjoys calm turquoise oceans, world-class surf point breaks, and sunny skies.</p>',
                'author'           => 'Kasun Jayawardena',
                'published_at'     => now()->subDays(12),
                'is_published'     => true,
                'views_count'      => 3120,
                'reading_time_min' => 4,
                'tags'             => ['Weather', 'Seasons', 'Beaches', 'Surfing', 'Planning'],
            ]
        ];

        foreach ($blogs as $b) {
            BlogPost::create($b);
        }

        // 7. Verified Reviews & Testimonials
        Review::truncate();
        $tour1 = Tour::where('slug', '14-day-ultimate-sri-lanka-explorer')->first() ?? Tour::first();
        $tour2 = Tour::where('slug', '8-day-east-coast-surf-and-sun')->first() ?? Tour::first();
        $tour3 = Tour::where('slug', '5-day-hill-country-romantic-getaway')->first() ?? Tour::first();
        $tour4 = Tour::where('slug', '6-day-wild-safari-and-udawalawe-wildlife')->first() ?? Tour::first();

        $acc1 = Accommodation::first();
        $acc2 = Accommodation::skip(1)->first();
        $veh1 = Vehicle::first();
        $veh2 = Vehicle::skip(1)->first();

        $reviews = [
            [
                'tour_id'          => $tour1 ? $tour1->id : null,
                'accommodation_id' => $acc1 ? $acc1->id : null,
                'vehicle_id'       => $veh1 ? $veh1->id : null,
                'user_id'          => $customer->id,
                'customer_name'    => 'Marcus & Elena Rost',
                'customer_country' => 'Germany',
                'title'            => 'Exceptional 14-day journey — our guide Nuwan was world-class!',
                'rating'           => 5,
                'comment'          => 'We booked the 14-day ultimate tour through Xplor Lanka and it exceeded every expectation. Our private driver and guide Nuwan was attentive, safe, punctual, and shared incredible knowledge of Sri Lankan history. The sunrise climb at Sigiriya and spotting two leopards in Yala will stay in our memories forever! Every boutique stay was clean, charming, and hospitable.',
                'media_urls'       => [
                    'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1590306122485-6db27f8a3791?auto=format&fit=crop&w=800&q=80',
                ],
                'is_approved'      => true,
            ],
            [
                'tour_id'          => $tour3 ? $tour3->id : null,
                'accommodation_id' => $acc2 ? $acc2->id : null,
                'vehicle_id'       => $veh2 ? $veh2->id : null,
                'user_id'          => null,
                'customer_name'    => 'Charlotte & James Davies',
                'customer_country' => 'United Kingdom',
                'title'            => 'Dream honeymoon in the Hill Country & Ceylon Tea Trails',
                'rating'           => 5,
                'comment'          => 'From the moment we were picked up at Bandaranaike Airport in a spotless luxury Prado, Xplor Lanka took care of every detail. The heritage planters bungalow in Nuwara Eliya felt like stepping back in time, and the scenic train ride to Ella had reserved first-class seats arranged flawlessly. Truly 5-star service with authentic local warmth.',
                'media_urls'       => [
                    'https://images.unsplash.com/photo-1623126908029-58cb08a2b0fa?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
                ],
                'is_approved'      => true,
            ],
            [
                'tour_id'          => $tour4 ? $tour4->id : null,
                'accommodation_id' => null,
                'vehicle_id'       => null,
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
                'tour_id'          => $tour2 ? $tour2->id : null,
                'accommodation_id' => null,
                'vehicle_id'       => null,
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
                'tour_id'          => $tour1 ? $tour1->id : null,
                'accommodation_id' => null,
                'vehicle_id'       => null,
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
                'tour_id'          => $tour1 ? $tour1->id : null,
                'accommodation_id' => null,
                'vehicle_id'       => null,
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
