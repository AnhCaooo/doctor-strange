import { Request, Response, NextFunction } from "express";
import { RATE_LIMIT } from "../constant/requests";
import jwt from "jsonwebtoken";
import { nonAuthRequiredPaths } from "../routes/routes";

/**
 * rate limiting and timeout handling middleware
 * @param requestCounts Object to store request counts for each IP address
 */
export function rateLimitAndTimeoutMiddleware(
    requestCounts: Record<string, number>
) {
    return (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip; // Get client IP address

        if (!ip) {
            console.error("No IP address from request");
            return;
        }
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
            console.error(`Request from IP ${ip} timed out`);
            // Handle timeout error
            res.status(504).json({
                code: 504,
                status: "Error",
                message: "Gateway timeout.",
                data: null,
            });
            req.destroy(); // Destroy the request to release resources
        });

        next(); // Continue to the next middleware
    };
}

/**
 * verify access token to decide whether allows requests go through or not
 * @param jwt_secret 
 */
export function authMiddleware(jwt_secret: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        // Allow access to public routes without authentication
        if (nonAuthRequiredPaths.includes(req.baseUrl)) {
            return next();
        }
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("Permission Denied: No token provided")
            return res
                .status(403)
                .json({ message: "Permission Denied: No token provided" });
        }

        const token = authHeader.split(" ")[1];

        try {
            const _ = jwt.verify(token, jwt_secret); // Verify the token
            next(); // Proceed if the token is valid
        } catch (error) {
            console.error("Permission Denied: Invalid token", error)
            return res
                .status(403)
                .json({ message: "Permission Denied: Invalid token" });
        }
    };
}
