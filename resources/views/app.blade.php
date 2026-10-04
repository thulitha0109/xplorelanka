<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ config('seo.name') }} | Sri Lanka Tours, Transfers & Outdoor Experiences</title>
        <meta head-key="description" name="description" content="{{ config('seo.description') }}">
        <meta head-key="robots" name="robots" content="index, follow, max-image-preview:large">
        <meta name="theme-color" content="#ffffff">
        <meta name="author" content="{{ config('seo.name') }}">
        <link head-key="canonical" rel="canonical" href="{{ config('seo.url') . request()->getPathInfo() }}">
        <link rel="icon" type="image/png" sizes="256x256" href="{{ asset('favicon.png') }}">
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
        <link rel="apple-touch-icon" href="{{ asset('favicon.png') }}">
        <meta property="og:site_name" content="{{ config('seo.name') }}">
        <meta head-key="og:type" property="og:type" content="website">
        <meta property="og:locale" content="en_LK">
        <meta head-key="og:url" property="og:url" content="{{ config('seo.url') . request()->getPathInfo() }}">
        <meta head-key="og:title" property="og:title" content="{{ config('seo.name') }} | Sri Lanka Tours, Transfers & Outdoor Experiences">
        <meta head-key="og:description" property="og:description" content="{{ config('seo.description') }}">
        <meta head-key="og:image" property="og:image" content="{{ config('seo.url') . '/images/legacy/tour-1.jpg' }}">
        <meta head-key="twitter:card" name="twitter:card" content="summary_large_image">
        <meta head-key="twitter:title" name="twitter:title" content="{{ config('seo.name') }} | Sri Lanka Tours, Transfers & Outdoor Experiences">
        <meta head-key="twitter:description" name="twitter:description" content="{{ config('seo.description') }}">
        <meta head-key="twitter:image" name="twitter:image" content="{{ config('seo.url') . '/images/legacy/tour-1.jpg' }}">
        @php
            $seoSchema = [
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => ['TravelAgency', 'LocalBusiness'],
                    '@id' => config('seo.url') . '/#organization',
                    'name' => config('seo.name'),
                    'url' => config('seo.url'),
                    'logo' => config('seo.url') . config('seo.logo'),
                    'image' => config('seo.url') . config('seo.logo'),
                    'description' => config('seo.description'),
                    'telephone' => config('seo.phone'),
                    'email' => config('seo.email'),
                    'priceRange' => '$$',
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
                        'availableLanguage' => ['English'],
                    ],
                    'areaServed' => ['@type' => 'Country', 'name' => 'Sri Lanka'],
                ],
                [
                    '@type' => 'WebSite',
                    '@id' => config('seo.url') . '/#website',
                    'url' => config('seo.url'),
                    'name' => config('seo.name'),
                    'description' => config('seo.description'),
                    'publisher' => ['@id' => config('seo.url') . '/#organization'],
                    'inLanguage' => 'en',
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
