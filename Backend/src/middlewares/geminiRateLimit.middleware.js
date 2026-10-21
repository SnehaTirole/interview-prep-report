const windows = new Map();

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 2;

function geminiRateLimit(req, res, next) {
    const userId = req.user.id;
    const now = Date.now();
    let window = windows.get(userId);

    if (!window || now >= window.resetAt) {
        window = { count: 0, resetAt: now + WINDOW_MS };
        windows.set(userId, window);
    }

    if (window.count >= MAX_REQUESTS) {
        
        return res.status(429).json({
            message: "AI request limit reached. Please try again later.",
            retryAfter: Math.ceil((window.resetAt - now) / 1000)
        });
    }

    window.count += 1;
    res.set("X-RateLimit-Limit", String(MAX_REQUESTS));
    res.set("X-RateLimit-Remaining", String(MAX_REQUESTS - window.count));
    res.set("X-RateLimit-Reset", String(Math.ceil(window.resetAt / 1000)));
    next();
}

module.exports = geminiRateLimit;
