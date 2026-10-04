import React from 'react';
import { Head, usePage } from '@inertiajs/react';

const DEFAULT_DESCRIPTION = 'Plan a Sri Lanka trip with Xplore Lanka: custom tours, local English-speaking guides, private transfers, cycling routes and camping experiences, based in Kandy.';
const DEFAULT_IMAGE = '/images/legacy/tour-1.jpg';

export default function SeoHead({
    title,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_IMAGE,
    type = 'website',
    canonical,
    keywords,
    schema,
    noIndex = false,
}) {
    const { site = {} } = usePage().props;
    const baseUrl = (site.url || 'https://xplorelanka.com').replace(/\/$/, '');
    const currentPath = typeof window === 'undefined' ? '/' : window.location.pathname;
    const canonicalUrl = canonical || `${baseUrl}${currentPath}`;
    const absoluteImage = image?.startsWith('http') ? image : `${baseUrl}${image || DEFAULT_IMAGE}`;
    const pageTitle = title || site.name || 'Xplore Lanka';
    const safeJsonLd = schema ? JSON.stringify(schema).replace(/</g, '\\u003c') : null;

    return (
        <Head>
            <title>{pageTitle}</title>
            <meta head-key="description" name="description" content={description} />
            {keywords && <meta head-key="keywords" name="keywords" content={keywords} />}
            <meta head-key="robots" name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
            <link head-key="canonical" rel="canonical" href={canonicalUrl} />
            <meta head-key="og:type" property="og:type" content={type} />
            <meta head-key="og:title" property="og:title" content={pageTitle} />
            <meta head-key="og:description" property="og:description" content={description} />
            <meta head-key="og:url" property="og:url" content={canonicalUrl} />
            <meta head-key="og:image" property="og:image" content={absoluteImage} />
            <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
            <meta head-key="twitter:title" name="twitter:title" content={pageTitle} />
            <meta head-key="twitter:description" name="twitter:description" content={description} />
            <meta head-key="twitter:image" name="twitter:image" content={absoluteImage} />
            {schema && <script head-key="jsonld" type="application/ld+json">{safeJsonLd}</script>}
        </Head>
    );
}
