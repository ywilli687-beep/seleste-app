"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditSchema = void 0;
exports.isSafeUrl = isSafeUrl;
exports.checkRateLimit = checkRateLimit;
exports.getIp = getIp;
const zod_1 = require("zod");
// ── Zod schema ─────────────────────────────────────────────────────────────────
exports.AuditSchema = zod_1.z.object({
    url: zod_1.z.string().min(1, 'URL is required'),
    businessName: zod_1.z.string().max(120).optional(),
    location: zod_1.z.string().min(2, 'Location is required').max(120),
    vertical: zod_1.z.enum([
        'AUTO_REPAIR', 'CAR_WASH', 'RESTAURANT', 'HOME_SERVICES', 'LOCAL_SERVICE',
        'DENTAL', 'LEGAL', 'REAL_ESTATE', 'FITNESS', 'BEAUTY_SALON',
        'PLUMBING', 'HVAC', 'LANDSCAPING', 'CLEANING', 'PET_SERVICES',
    ]),
    monthlyRevenue: zod_1.z.number().positive().optional(),
    triggeredBy: zod_1.z.enum(['MANUAL', 'SCHEDULED', 'API', 'BULK_IMPORT']).default('MANUAL'),
});
// ── SSRF protection ────────────────────────────────────────────────────────────
function isSafeUrl(rawUrl) {
    try {
        let url = rawUrl.trim();
        if (!/^https?:\/\//i.test(url))
            url = 'https://' + url;
        const { hostname, protocol } = new URL(url);
        if (!['http:', 'https:'].includes(protocol))
            return false;
        const blocked = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '169.254.169.254'];
        if (blocked.some(b => hostname === b || hostname.endsWith('.' + b)))
            return false;
        if (/^10\./.test(hostname))
            return false;
        if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname))
            return false;
        if (/^192\.168\./.test(hostname))
            return false;
        if (/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(hostname))
            return false;
        return true;
    }
    catch (_a) {
        return false;
    }
}
// ── In-memory rate limiter ─────────────────────────────────────────────────────
// Resets on cold start. Replace with Upstash Redis for production scale.
const rateLimitMap = new Map();
const RATE_LIMIT = 10;
const WINDOW_MS = 60000;
function checkRateLimit(ip) {
    const now = Date.now();
    const record = rateLimitMap.get(ip);
    if (!record || now > record.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return true;
    }
    if (record.count >= RATE_LIMIT)
        return false;
    record.count++;
    return true;
}
function getIp(req) {
    var _a;
    return ((_a = req.headers.get('x-forwarded-for')) !== null && _a !== void 0 ? _a : '').split(',')[0].trim() || 'unknown';
}
