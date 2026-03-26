"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPage = fetchPage;
exports.extractHardSignals = extractHardSignals;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
function fetchPage(rawUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = rawUrl.trim();
        if (!/^https?:\/\//i.test(url))
            url = 'https://' + url;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);
        try {
            const res = yield fetch(url, {
                signal: controller.signal,
                headers: {
                    'User-Agent': UA,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache',
                },
                redirect: 'follow',
            });
            clearTimeout(timer);
            const html = yield res.text();
            const headers = {};
            res.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
            return { html, finalUrl: res.url || url, status: res.status, isSSL: (res.url || url).startsWith('https://'), headers };
        }
        catch (err) {
            clearTimeout(timer);
            if (url.startsWith('https://')) {
                try {
                    const c2 = new AbortController();
                    const t2 = setTimeout(() => c2.abort(), 10000);
                    const res2 = yield fetch(url.replace('https://', 'http://'), { signal: c2.signal, headers: { 'User-Agent': UA }, redirect: 'follow' });
                    clearTimeout(t2);
                    const html = yield res2.text();
                    return { html, finalUrl: res2.url, status: res2.status, isSSL: false, headers: {} };
                }
                catch ( /* fall through */_a) { /* fall through */ }
            }
            const msg = err instanceof Error ? err.message : String(err);
            return { html: '', finalUrl: url, status: 0, isSSL: false, headers: {}, error: msg.includes('abort') ? 'Request timed out' : msg };
        }
    });
}
function extractHardSignals(page) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const { html, headers } = page;
    if (!html)
        return emptyHardSignals(page);
    const lo = html.toLowerCase();
    // Title
    const titleMatch = html.match(/<title[^>]*>([^<]{1,200})<\/title>/i);
    const pageTitle = (_b = (_a = titleMatch === null || titleMatch === void 0 ? void 0 : titleMatch[1]) === null || _a === void 0 ? void 0 : _a.trim().replace(/\s+/g, ' ')) !== null && _b !== void 0 ? _b : '';
    // Meta description
    const metaM = (_c = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{10,500})["']/i)) !== null && _c !== void 0 ? _c : html.match(/<meta[^>]+content=["']([^"']{10,500})["'][^>]+name=["']description["']/i);
    const metaDescription = (_e = (_d = metaM === null || metaM === void 0 ? void 0 : metaM[1]) === null || _d === void 0 ? void 0 : _d.trim()) !== null && _e !== void 0 ? _e : '';
    // H1
    const h1Match = html.match(/<h1[^>]*>([^<]{3,200})<\/h1>/i);
    const h1Text = (_g = (_f = h1Match === null || h1Match === void 0 ? void 0 : h1Match[1]) === null || _f === void 0 ? void 0 : _f.replace(/<[^>]+>/g, '').trim()) !== null && _g !== void 0 ? _g : '';
    // Word count
    const stripped = html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const wordCount = stripped.split(/\s+/).filter(w => w.length > 2).length;
    // Schema
    const hasSchema = lo.includes('application/ld+json') || lo.includes('itemtype="https://schema.org') || lo.includes('itemtype="http://schema.org');
    const schemaTypes = [];
    const schemaMatches = html.matchAll(/"@type"\s*:\s*"([^"]+)"/g);
    for (const m of schemaMatches) {
        if (!schemaTypes.includes(m[1]))
            schemaTypes.push(m[1]);
    }
    // Analytics
    const hasGA = lo.includes('google-analytics.com/analytics.js') || lo.includes('gtag.js') || /ga\s*\(\s*['"]send['"]/.test(lo);
    const hasGA4 = /['"]G-[A-Z0-9]{4,}['"]/.test(html) || lo.includes("gtag('config'");
    const hasPixel = lo.includes('connect.facebook.net') || lo.includes('fbq(') || lo.includes('fbevents.js');
    const hasGTM = lo.includes('googletagmanager.com/gtm.js') || /['"]GTM-[A-Z0-9]{4,}['"]/.test(html);
    let analyticsPlatform = null;
    if (hasGA4)
        analyticsPlatform = 'GA4';
    else if (hasGA)
        analyticsPlatform = 'Universal Analytics';
    else if (lo.includes('plausible.io')) {
        analyticsPlatform = 'Plausible';
    }
    else if (lo.includes('mixpanel.com')) {
        analyticsPlatform = 'Mixpanel';
    }
    else if (lo.includes('segment.com') || lo.includes('analytics.js')) {
        analyticsPlatform = 'Segment';
    }
    else if (lo.includes('heap.io')) {
        analyticsPlatform = 'Heap';
    }
    else if (lo.includes('posthog.com')) {
        analyticsPlatform = 'PostHog';
    }
    // Mobile
    const isMobileOptimized = lo.includes('width=device-width') && lo.includes('viewport');
    const hasLazyLoad = lo.includes('loading="lazy"') || lo.includes("loading='lazy'") || lo.includes('data-src=') || lo.includes('lazysizes');
    // Images
    const hasWebP = lo.includes('.webp') || lo.includes('image/webp');
    const hasOptimizedImages = hasWebP || lo.includes('srcset=') || lo.includes('picture');
    // CDN
    const serverH = ((_h = headers['server']) !== null && _h !== void 0 ? _h : '').toLowerCase();
    const hasCDN = !!headers['cf-ray'] || serverH.includes('cloudflare') || serverH.includes('fastly') || serverH.includes('akamai') || lo.includes('cloudfront.net');
    // Caching
    const cc = (_j = headers['cache-control']) !== null && _j !== void 0 ? _j : '';
    const hasCaching = cc.includes('max-age') || cc.includes('s-maxage') || lo.includes('service-worker');
    // CMS
    let detectedCMS = null;
    if (lo.includes('wp-content') || lo.includes('wp-includes') || lo.includes('wp-json'))
        detectedCMS = 'WordPress';
    else if (lo.includes('squarespace.com') || lo.includes('squarespace-cdn'))
        detectedCMS = 'Squarespace';
    else if (lo.includes('wix.com') || lo.includes('wixstatic.com'))
        detectedCMS = 'Wix';
    else if (lo.includes('shopify') || lo.includes('myshopify.com'))
        detectedCMS = 'Shopify';
    else if (lo.includes('webflow'))
        detectedCMS = 'Webflow';
    else if (lo.includes('ghost'))
        detectedCMS = 'Ghost';
    else if (lo.includes('drupal'))
        detectedCMS = 'Drupal';
    else if (lo.includes('joomla'))
        detectedCMS = 'Joomla';
    else if (lo.includes('duda') || lo.includes('dudaone'))
        detectedCMS = 'Duda';
    else if (lo.includes('godaddy') || lo.includes('websitebuilder.com'))
        detectedCMS = 'GoDaddy';
    else if (lo.includes('jimdo.com'))
        detectedCMS = 'Jimdo';
    // Tech stack
    const techStack = [];
    if (detectedCMS)
        techStack.push(detectedCMS);
    if (lo.includes('react') || lo.includes('__react'))
        techStack.push('React');
    if (lo.includes('vue') || lo.includes('__vue'))
        techStack.push('Vue');
    if (lo.includes('jquery'))
        techStack.push('jQuery');
    if (lo.includes('bootstrap'))
        techStack.push('Bootstrap');
    if (lo.includes('tailwind'))
        techStack.push('Tailwind');
    if (lo.includes('cloudflare'))
        techStack.push('Cloudflare');
    if (lo.includes('stripe'))
        techStack.push('Stripe');
    if (lo.includes('paypal'))
        techStack.push('PayPal');
    if (lo.includes('hubspot'))
        techStack.push('HubSpot');
    if (lo.includes('salesforce') || lo.includes('pardot'))
        techStack.push('Salesforce');
    if (lo.includes('intercom'))
        techStack.push('Intercom');
    if (lo.includes('zendesk'))
        techStack.push('Zendesk');
    if (lo.includes('hotjar'))
        techStack.push('Hotjar');
    if (lo.includes('clarity.ms'))
        techStack.push('Microsoft Clarity');
    if (hasGTM)
        techStack.push('Google Tag Manager');
    return {
        isSSL: page.isSSL,
        hasMetaDescription: metaDescription.length > 10,
        metaDescription,
        hasH1: h1Text.length > 2,
        h1Text,
        hasSchema,
        schemaTypes: [...new Set(schemaTypes)].slice(0, 8),
        hasAnalytics: hasGA || hasGA4,
        analyticsPlatform,
        hasPixel,
        hasTagManager: hasGTM,
        hasCDN,
        hasCaching,
        hasLazyLoad,
        isMobileOptimized,
        hasOptimizedImages,
        hasCMS: detectedCMS !== null,
        detectedCMS,
        techStack: [...new Set(techStack)],
        hasXMLSitemap: lo.includes('sitemap.xml') || lo.includes('<sitemap>'),
        pageTitle,
        wordCount,
    };
}
function emptyHardSignals(page) {
    return {
        isSSL: page.isSSL, hasMetaDescription: false, metaDescription: '', hasH1: false,
        h1Text: '', hasSchema: false, schemaTypes: [], hasAnalytics: false, analyticsPlatform: null,
        hasPixel: false, hasTagManager: false, hasCDN: false, hasCaching: false, hasLazyLoad: false,
        isMobileOptimized: false, hasOptimizedImages: false, hasCMS: false, detectedCMS: null,
        techStack: [], hasXMLSitemap: false, pageTitle: '', wordCount: 0,
    };
}
