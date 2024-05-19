import cors from "cors";
import express from "express";
import helmet from "helmet";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";
import dotenv from 'dotenv';
import { services } from "./routes/routes";

//For env File 
dotenv.config();

// Create an instance of Express app
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS
app.use(helmet()); // Add security headers
app.use(morgan("combined")); // Log HTTP requests
app.disable("x-powered-by"); // Hide Express server information

// Define rate limit constants
const rateLimit = 20; // Max requests per minute
const interval = 60 * 1000; // Time window in milliseconds (1 minute)

// Object to store request counts for each IP address
const requestCounts: any = {};

// Reset request count for each IP address every 'interval' milliseconds
setInterval(() => {
    Object.keys(requestCounts).forEach((ip) => {
        requestCounts[ip] = 0; // Reset request count for each IP address
    });
}, interval);

// Middleware function for rate limiting and timeout handling
function rateLimitAndTimeout(req: any, res: any, next: any) {
    const ip = req.ip; // Get client IP address

    // Update request count for the current IP
    requestCounts[ip] = (requestCounts[ip] || 0) + 1;

    // Check if request count exceeds the rate limit
    if (requestCounts[ip] > rateLimit) {
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

// Apply the rate limit and timeout middleware to the proxy
app.use(rateLimitAndTimeout);

// Set up proxy middleware for each microservice
services.forEach(({ route, target }) => {
    // Proxy options
    const proxyOptions = {
        target,
        changeOrigin: true,
        pathRewrite: {
            [`^${route}`]: "",
        },
    };

    // Apply rate limiting and timeout middleware before proxying
    app.use(route, rateLimitAndTimeout, createProxyMiddleware(proxyOptions));
});

// Define port for Express server
const PORT = process.env.PORT || 8000;

// Start Express server
app.listen(PORT, () => {
    console.log(`Gateway is running on port ${PORT}`);
});