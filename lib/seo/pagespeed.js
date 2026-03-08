/**
 * Pings the Google PageSpeed Insights API.
 * Uses the GOOGLE_CLOUD_API_KEY from .env if available, otherwise runs unauthenticated (rate limits apply).
 */
export async function getPageSpeedMetrics(targetUrl) {
    if (!targetUrl || targetUrl === 'None') return null;

    try {
        let validUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
        const encodedUrl = encodeURIComponent(validUrl);
        const apiKey = process.env.GOOGLE_CLOUD_API_KEY ? `&key=${process.env.GOOGLE_CLOUD_API_KEY}` : '';

        // Target mobile specifically as that's what Google indexes
        const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&strategy=mobile${apiKey}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Allow 10s for page speed

        const response = await fetch(endpoint, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            console.warn(`PageSpeed API failed: ${response.status}`);
            return null;
        }

        const data = await response.json();

        // Extract the core vitals
        const performanceScore = data.lighthouseResult?.categories?.performance?.score * 100;
        const fcp = data.lighthouseResult?.audits['first-contentful-paint']?.displayValue;
        const lcp = data.lighthouseResult?.audits['largest-contentful-paint']?.displayValue;
        const tti = data.lighthouseResult?.audits['interactive']?.displayValue;

        return {
            mobile_score: performanceScore ? Math.round(performanceScore) : 'Unknown',
            first_contentful_paint: fcp || 'Unknown',
            largest_contentful_paint: lcp || 'Unknown',
            time_to_interactive: tti || 'Unknown'
        };

    } catch (error) {
        console.warn(`Failed to get PageSpeed for ${targetUrl}:`, error.message);
        return null;
    }
}
