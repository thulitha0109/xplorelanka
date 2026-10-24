import React, { useEffect, useRef, useState } from 'react';

// Safety Guard: Patch Node.prototype.insertBefore so Elfsight's React reconciliation
// never throws NotFoundError when branding elements are purged from the DOM.
if (typeof window !== 'undefined' && !window.__safeInsertBeforePatched) {
    window.__safeInsertBeforePatched = true;
    const origInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function (newNode, refNode) {
        if (refNode && refNode.parentNode !== this) {
            // Reference node is not a child of this node (detached / removed)
            // Gracefully fallback to appendChild instead of crashing
            return this.appendChild(newNode);
        }
        return origInsertBefore.call(this, newNode, refNode);
    };
}

export default function ElfsightReviews({ className = '' }) {
    const containerRef = useRef(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        // ── 1. Preload after scroll or near viewport ──
        const loadScript = () => {
            if (window.__elfsightScriptLoaded) {
                setScriptLoaded(true);
                return;
            }

            const existingScript = document.querySelector('script[src*="elfsightcdn.com/platform.js"]');
            if (existingScript) {
                window.__elfsightScriptLoaded = true;
                setScriptLoaded(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://elfsightcdn.com/platform.js';
            script.async = true;
            script.onload = () => {
                window.__elfsightScriptLoaded = true;
                setScriptLoaded(true);
            };
            document.body.appendChild(script);
        };

        const onScroll = () => {
            if (window.scrollY > 30) {
                loadScript();
                window.removeEventListener('scroll', onScroll);
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        let observer = null;
        if (containerRef.current && 'IntersectionObserver' in window) {
            observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        loadScript();
                        if (observer) observer.disconnect();
                    }
                });
            }, { rootMargin: '600px 0px' });

            observer.observe(containerRef.current);
        }

        const fallbackTimer = setTimeout(() => {
            loadScript();
        }, 4000);

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (observer) observer.disconnect();
            clearTimeout(fallbackTimer);
        };
    }, []);

    // ── 2. Debranding Script: Purge Elfsight branding, watermark, and "Free Reviews Widget" link ──
    useEffect(() => {
        // Inject global stylesheet to hide elements even before DOM purge
        const styleId = 'elfsight-global-debrand-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                a[href*="elfsight.com"],
                a[href*="elfsight"],
                [class*="Badge"],
                [class*="badge"],
                [class*="eapps-link"],
                [class*="eapps-badge"],
                [class*="eapps-watermark"],
                [class*="watermark"],
                [class*="Ribbon"],
                [class*="CloseButton"],
                [class*="widget-toolbar"],
                [class*="Floating"],
                .elfsight-app-21ad5328-89e0-432c-89b4-9307f7301e81 a[target="_blank"],
                .elfsight-app-21ad5328-89e0-432c-89b4-9307f7301e81 a[href*="elfsight"] {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    height: 0 !important;
                    width: 0 !important;
                    position: absolute !important;
                    clip: rect(0, 0, 0, 0) !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    border: none !important;
                    overflow: hidden !important;
                }
            `;
            document.head.appendChild(style);
        }

        const purgeElfsightBranding = () => {
            // Find all Elfsight promotional links and badges
            const targets = document.querySelectorAll(
                'a[href*="elfsight.com"], a[href*="elfsight"], [class*="eapps-link"], [class*="Badge__BadgeComponent"], [class*="Badge__Container"], [class*="badge-container"]'
            );

            targets.forEach((el) => {
                try {
                    // Empty text and SVG contents immediately
                    el.innerHTML = '';
                    el.textContent = '';
                    // Apply hidden styles
                    el.style.setProperty('display', 'none', 'important');
                    el.style.setProperty('opacity', '0', 'important');
                    el.style.setProperty('visibility', 'hidden', 'important');
                    el.style.setProperty('height', '0', 'important');
                    el.style.setProperty('width', '0', 'important');
                    el.style.setProperty('position', 'absolute', 'important');
                    el.style.setProperty('pointer-events', 'none', 'important');
                    
                    // Safely remove the element from DOM (safe because insertBefore is patched)
                    el.remove();
                } catch (e) {
                    // Ignore DOM removal errors
                }
            });

            // Target any remaining "Free Reviews Widget" or pink circular button containers
            const widget = document.querySelector('.elfsight-app-21ad5328-89e0-432c-89b4-9307f7301e81') || containerRef.current;
            if (widget) {
                const candidates = widget.querySelectorAll('*');
                candidates.forEach((node) => {
                    const txt = (node.textContent || '').trim().toLowerCase();
                    if (
                        txt === 'free reviews widget' ||
                        txt === 'free reviews' ||
                        txt === 'free google reviews' ||
                        (txt.includes('free') && txt.includes('widget') && txt.length < 40)
                    ) {
                        try {
                            node.innerHTML = '';
                            node.remove();
                        } catch (e) {}
                    }

                    // Check for pink/circular dismiss icon
                    if (node.tagName === 'BUTTON' || node.tagName === 'SVG') {
                        const aria = (node.getAttribute('aria-label') || '').toLowerCase();
                        if (aria.includes('close') || aria.includes('dismiss')) {
                            try {
                                node.remove();
                            } catch (e) {}
                        }
                    }
                });
            }

            // Handle shadow DOM if applicable
            if (containerRef.current) {
                const checkShadow = (node) => {
                    if (!node) return;
                    if (node.shadowRoot) {
                        try {
                            const shadowLinks = node.shadowRoot.querySelectorAll('a[href*="elfsight"]');
                            shadowLinks.forEach((l) => {
                                l.innerHTML = '';
                                l.remove();
                            });
                        } catch (e) {}
                    }
                    if (node.children) {
                        Array.from(node.children).forEach(checkShadow);
                    }
                };
                checkShadow(containerRef.current);
            }
        };

        // Purge immediately
        purgeElfsightBranding();

        // Observe DOM mutations to remove branding as soon as Elfsight injects it
        const mutationObserver = new MutationObserver(() => {
            purgeElfsightBranding();
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Run interval checks every 200ms for 15 seconds to catch delayed widget renders
        const intervalId = setInterval(purgeElfsightBranding, 200);
        const stopTimer = setTimeout(() => {
            clearInterval(intervalId);
        }, 15000);

        return () => {
            mutationObserver.disconnect();
            clearInterval(intervalId);
            clearTimeout(stopTimer);
        };
    }, []);

    return (
        <div ref={containerRef} className={`w-full overflow-hidden ${className}`}>
            {/* Elfsight All-in-One Reviews | Untitled All-in-One Reviews */}
            <div
                className="elfsight-app-21ad5328-89e0-432c-89b4-9307f7301e81"
                data-elfsight-app-lazy
            />
        </div>
    );
}
