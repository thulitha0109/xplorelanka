import React from 'react';
import { Head, usePage } from '@inertiajs/react';

const DEFAULT_DESCRIPTION = 'Top-rated Sri Lanka tour operator (5.0★ on Google) based in Kandy. Custom tour packages, licensed English-speaking chauffeur guides, reliable private transfers, tea trail cycling and authentic stays.';
const DEFAULT_IMAGE = '/images/legacy/tour-1.jpg';

export default function SeoHead({
    title,
    description,
    image = DEFAULT_IMAGE,
    type = 'website',
    canonical,
    keywords,
    schema,
    breadcrumbs,
    noIndex = false,
}) {
    const { site = {} } = usePage().props;
    const baseUrl = (site.url || 'https://xplorelanka.com').replace(/\/$/, '');
    const currentPath = typeof window === 'undefined' ? '/' : window.location.pathname;
    const canonicalUrl = canonical || `${baseUrl}${currentPath}`;
    const absoluteImage = image?.startsWith('http') ? image : `${baseUrl}${image || DEFAULT_IMAGE}`;
    const pageTitle = title || (site.name ? `${site.name} | Sri Lanka Tours & Private Transfers` : 'Xplore Lanka Tours');
    const pageDescription = description || site.description || DEFAULT_DESCRIPTION;
    const pageKeywords = keywords || site.keywords || 'Sri Lanka tours, Sri Lanka tour packages, private driver Sri Lanka, chauffeur guide Sri Lanka, Kandy tour operator';

    // Build BreadcrumbList schema if breadcrumbs array is passed: [{ name: 'Home', url: '/' }, { name: 'Tours', url: '/tours' }]
    const breadcrumbSchema = Array.isArray(breadcrumbs) && breadcrumbs.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.map((crumb, idx) => ({
            '@type': 'ListItem',
            'position': idx + 1,
            'name': crumb.name,
            'item': crumb.url.startsWith('http') ? crumb.url : `${baseUrl}${crumb.url}`
        }))
    } : null;

    const fullSchema = schema 
        ? (breadcrumbSchema ? { '@context': 'https://schema.org', '@graph': [schema, breadcrumbSchema] } : schema)
        : breadcrumbSchema;

    const safeJsonLd = fullSchema ? JSON.stringify(fullSchema).replace(/</g, '\\u003c') : null;

    return (
        <Head>
            <title>{pageTitle}</title>
            <meta head-key="description" name="description" content={pageDescription} />
            <meta head-key="keywords" name="keywords" content={pageKeywords} />
            <meta head-key="robots" name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
            <link head-key="canonical" rel="canonical" href={canonicalUrl} />
            
            {/* Geo tags for Local SEO in Kandy, Sri Lanka */}
            <meta name="geo.region" content="LK-2" />
            <meta name="geo.placename" content="Kandy" />
            <meta name="geo.position" content="7.2637058;80.6116434" />
            <meta name="ICBM" content="7.2637058, 80.6116434" />

            {/* Open Graph */}
            <meta head-key="og:type" property="og:type" content={type} />
            <meta head-key="og:site_name" property="og:site_name" content={site.name || 'Xplore Lanka Tours'} />
            <meta head-key="og:title" property="og:title" content={pageTitle} />
            <meta head-key="og:description" property="og:description" content={pageDescription} />
            <meta head-key="og:url" property="og:url" content={canonicalUrl} />
            <meta head-key="og:image" property="og:image" content={absoluteImage} />
            <meta head-key="og:locale" property="og:locale" content="en_US" />

            {/* Twitter Card */}
            <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
            <meta head-key="twitter:title" name="twitter:title" content={pageTitle} />
            <meta head-key="twitter:description" name="twitter:description" content={pageDescription} />
            <meta head-key="twitter:image" name="twitter:image" content={absoluteImage} />

            {/* Structured Data */}
            {safeJsonLd && <script head-key="jsonld" type="application/ld+json">{safeJsonLd}</script>}
        </Head>
    );
}
