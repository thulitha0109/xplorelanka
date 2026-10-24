<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ config('seo.name') }} | Sri Lanka Tour Packages, Private Driver & Local Experiences</title>
        <meta head-key="description" name="description" content="{{ config('seo.description') }}">
        <meta head-key="keywords" name="keywords" content="{{ config('seo.keywords') }}">
        <meta head-key="robots" name="robots" content="index, follow, max-image-preview:large">
        <meta name="theme-color" content="#ffffff">
        <meta name="author" content="{{ config('seo.name') }}">
        <link head-key="canonical" rel="canonical" href="{{ config('seo.url') . request()->getPathInfo() }}">
        
        <!-- Favicons & Touch Icons -->
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
        <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('x_plore_lanka_favicons/favicon-32x32.png') }}">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('x_plore_lanka_favicons/favicon-16x16.png') }}">
        <link rel="icon" type="image/png" sizes="48x48" href="{{ asset('x_plore_lanka_favicons/favicon-48x48.png') }}">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('x_plore_lanka_favicons/apple-touch-icon.png') }}">
        <link rel="apple-touch-icon" sizes="152x152" href="{{ asset('x_plore_lanka_favicons/apple-touch-icon-152x152.png') }}">
        <link rel="apple-touch-icon" sizes="120x120" href="{{ asset('x_plore_lanka_favicons/apple-touch-icon-120x120.png') }}">
        <link rel="manifest" href="{{ asset('site.webmanifest') }}">
        <meta name="msapplication-TileImage" content="{{ asset('x_plore_lanka_favicons/mstile-150x150.png') }}">
        <meta name="msapplication-TileColor" content="#059669">
        <meta name="theme-color" content="#059669">

        <meta property="og:site_name" content="{{ config('seo.name') }}">
        <meta head-key="og:type" property="og:type" content="website">
        <meta property="og:locale" content="en_US">
        <meta head-key="og:url" property="og:url" content="{{ config('seo.url') . request()->getPathInfo() }}">
        <meta head-key="og:title" property="og:title" content="{{ config('seo.name') }} | Sri Lanka Tour Packages, Private Driver & Local Experiences">
        <meta head-key="og:description" property="og:description" content="{{ config('seo.description') }}">
        <meta head-key="og:image" property="og:image" content="{{ config('seo.url') . '/x_plore_lanka_favicons/android-chrome-512x512.png' }}">
        <meta head-key="twitter:card" name="twitter:card" content="summary_large_image">
        <meta head-key="twitter:title" name="twitter:title" content="{{ config('seo.name') }} | Sri Lanka Tour Packages, Private Driver & Local Experiences">
        <meta head-key="twitter:description" name="twitter:description" content="{{ config('seo.description') }}">
        <meta head-key="twitter:image" name="twitter:image" content="{{ config('seo.url') . '/x_plore_lanka_favicons/android-chrome-512x512.png' }}">
        @php
            $seoSchema = [
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => ['TravelAgency', 'TourOperator', 'LocalBusiness'],
                    '@id' => config('seo.url') . '/#organization',
                    'name' => config('seo.name'),
                    'alternateName' => config('seo.short_name'),
                    'url' => config('seo.url'),
                    'logo' => [
                        '@type' => 'ImageObject',
                        'url' => config('seo.url') . config('seo.icon', '/x_plore_lanka_favicons/android-chrome-512x512.png'),
                        'width' => 512,
                        'height' => 512,
                    ],
                    'image' => config('seo.url') . config('seo.icon', '/x_plore_lanka_favicons/android-chrome-512x512.png'),
                    'description' => config('seo.description'),
                    'telephone' => config('seo.phone'),
                    'email' => config('seo.email'),
                    'hasMap' => config('seo.google_maps_url'),
                    'sameAs' => array_filter([config('seo.google_maps_url')]),
                    'priceRange' => config('seo.price_range', '$$'),
                    'openingHours' => config('seo.opening_hours', 'Mo-Su 00:00-24:00'),
                    'currenciesAccepted' => implode(', ', config('seo.currencies_accepted', ['USD', 'EUR', 'GBP', 'LKR', 'AUD'])),
                    'paymentAccepted' => 'Cash, Credit Card, Bank Transfer, Online Payment',
                    'aggregateRating' => [
                        '@type' => 'AggregateRating',
                        'ratingValue' => config('seo.rating_value', '5.0'),
                        'reviewCount' => config('seo.review_count', 39),
                        'bestRating' => '5',
                        'worstRating' => '1',
                    ],
                    'address' => [
                        '@type' => 'PostalAddress',
                        'streetAddress' => config('seo.address.street'),
                        'addressLocality' => config('seo.address.locality'),
                        'addressRegion' => config('seo.address.region'),
                        'postalCode' => config('seo.address.postal_code'),
                        'addressCountry' => config('seo.address.country'),
                    ],
                    'geo' => [
                        '@type' => 'GeoCoordinates',
                        'latitude' => config('seo.geo.latitude'),
                        'longitude' => config('seo.geo.longitude'),
                    ],
                    'contactPoint' => [
                        '@type' => 'ContactPoint',
                        'telephone' => config('seo.phone'),
                        'email' => config('seo.email'),
                        'contactType' => 'customer service',
                        'availableLanguage' => ['English', 'German', 'Russian'],
                    ],
                    'areaServed' => [
                        ['@type' => 'Country', 'name' => 'Sri Lanka'],
                        ['@type' => 'City', 'name' => 'Kandy'],
                        ['@type' => 'City', 'name' => 'Colombo'],
                        ['@type' => 'City', 'name' => 'Sigiriya'],
                        ['@type' => 'City', 'name' => 'Ella'],
                        ['@type' => 'City', 'name' => 'Galle'],
                    ],
                ],
                [
                    '@type' => 'WebSite',
                    '@id' => config('seo.url') . '/#website',
                    'url' => config('seo.url'),
                    'name' => config('seo.name'),
                    'alternateName' => config('seo.short_name'),
                    'description' => config('seo.description'),
                    'publisher' => ['@id' => config('seo.url') . '/#organization'],
                    'inLanguage' => 'en',
                    'potentialAction' => [
                        '@type' => 'SearchAction',
                        'target' => config('seo.url') . '/tours?search={search_term_string}',
                        'query-input' => 'required name=search_term_string',
                    ],
                ],
            ],
            ];
        @endphp
        <script head-key="site-jsonld" type="application/ld+json">@json($seoSchema)</script>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

        <!-- Scripts and Styles -->
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased h-full bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
        @inertia
    </body>
</html>
