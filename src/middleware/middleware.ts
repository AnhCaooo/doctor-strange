import { RATE_LIMIT } from "../constant/requests";

// TODO: optimize this function
// rate limiting and timeout handling
export function rateLimitAndTimeout(req: any, res: any, next: any, requestCounts: any) {
    const ip = req.ip; // Get client IP address

    // Update request count for the current IP
    requestCounts[ip] = (requestCounts[ip] || 0) + 1;

    // Check if request count exceeds the rate limit
    if (requestCounts[ip] > RATE_LIMIT) {
        // Respond with a 429 Too Many Requests status code
        return res.status(429).json({
            code: 429,
            status: "Error",
            message: "Rate limit exceeded.",
            data: null,
        });
    }

    // Set timeout for each request (example: 10 seconds)
    req.setTimeout(15000, () => {
        // Handle timeout error
        res.status(504).json({
            code: 504,
            status: "Error",
            message: "Gateway timeout.",
            data: null,
        });
        req.abort(); // Abort the request
    });

    next(); // Continue to the next middleware
}
