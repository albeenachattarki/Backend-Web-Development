'use strict';
// middleware/rateLimiter.js
//
// YOUR TASK: replace this pass-through with a real rate limiter.
//
// Right now this middleware lets EVERY request through, so the login route can be
// brute-forced without limit. Build a strict limiter with `express-rate-limit`
// (already in package.json) that is exported as the middleware used by the three
// auth routes in src/routes/auth.js.
//
// Requirements (checked by the tests):
//   - windowMs: 15 minutes
//   - max: 5 attempts per window per IP
//   - after the limit, respond with 429 and a `Retry-After` header
//   - standardHeaders: true, legacyHeaders: false
//   - (recommended) skipSuccessfulRequests: true so only FAILED attempts count
//
// Also add a COMMENT explaining how a Redis-backed store (rate-limit-redis) would
// replace the default in-memory store in a multi-instance deployment, and why the
// in-memory store is not enough when several instances run behind a load balancer.
//
// Hint: express-rate-limit returns a middleware function — export it directly:
//   const rateLimit = require('express-rate-limit');
//   module.exports = rateLimit({ ...options });

const rateLimit = require('express-rate-limit');

// The default MemoryStore keeps counters inside one Node.js process. In a
// multi-instance deployment behind a load balancer, each instance would have
// its own counter and a client could effectively get the limit once per
// instance. A Redis-backed store from rate-limit-redis would put the counter
// in shared Redis so every instance enforces the same limit.
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    const resetTime = req.rateLimit && req.rateLimit.resetTime;
    const retryAfter = resetTime instanceof Date
      ? Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 1000))
      : 15 * 60;

    res.set('Retry-After', String(retryAfter));
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  },
});
