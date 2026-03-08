import * as cheerio from 'cheerio';

/**
 * Scrapes a given URL for primary SEO tags and content markers.
 * Fails gracefully to avoid crashing the audit flow if the site blocks bots.
 */
export async function scrapeWebsiteMetrics(targetUrl) {
    if (!targetUrl || targetUrl === 'None') return null;

    try {
        // Ensure https scheme
        let validUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;

        // Add a 5 second timeout to avoid hanging the audit
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(validUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SelesteBot/1.0; +https://seleste.com)',
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.warn(`Scraper got non-200 response: ${response.status}`);
            return null;
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Core SEO Extraction
        const title = $('title').first().text()?.trim() || 'Missing';
        const metaDescription = $('meta[name="description"]').attr('content')?.trim() || 'Missing';
        const h1Count = $('h1').length;
        const mainH1 = $('h1').first().text()?.trim() || 'Missing';
        const phoneLinks = $('a[href^="tel:"]').length;
        const hasSchema = $('script[type="application/ld+json"]').length > 0;

        // DEEPER TECHNICAL AUDIT
        const missingAltTags = $('img:not([alt]), img[alt=""]').length;
        const totalImages = $('img').length;
        const hasMobileViewport = $('meta[name="viewport"]').length > 0;

        // Content Depth
        const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
        const wordCount = bodyText.split(' ').length;

        // Social / Trust Signals
        const links = $('a').map((i, el) => $(el).attr('href')).get();
        const hasFacebook = links.some(l => l && l.includes('facebook.com'));
        const hasInstagram = links.some(l => l && l.includes('instagram.com'));
        const hasYelp = links.some(l => l && l.includes('yelp.com'));

        return {
            title,
            title_length: title.length,
            metaDescription,
            meta_length: metaDescription.length,
            h1s: h1Count,
            primary_h1: mainH1,
            phone_links: phoneLinks,
            has_structured_data: hasSchema,
            technical: {
                images_missing_alt: missingAltTags,
                total_images: totalImages,
                has_mobile_viewport: hasMobileViewport
            },
            content_depth: {
                homepage_word_count: wordCount
            },
            trust_signals: {
                has_facebook: hasFacebook,
                has_instagram: hasInstagram,
                has_yelp: hasYelp
            }
        };
    } catch (error) {
        console.warn(`Failed to scrape ${targetUrl}:`, error.message);
        return null;
    }
}
