// src/middleware/errorHandler.js

/**
 * Central Express error-handling middleware.
 * Mount LAST in app.js: app.use(errorHandler)
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal server error.";

    // Don't leak stack traces in production
    const payload = { success: false, error: message };
    if (process.env.NODE_ENV !== "production" && err.stack) {
        payload.stack = err.stack;
    }

    console.error(`[ErrorHandler] ${status} — ${message}`);
    res.status(status).json(payload);
}

/**
 * Async wrapper — eliminates try/catch boilerplate in controllers.
 * Usage: router.post("/start", asyncWrap(startInterview))
 */
export function asyncWrap(fn) {
    return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
