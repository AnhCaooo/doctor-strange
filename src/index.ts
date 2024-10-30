import cors from "cors";
import express from "express";
import helmet from "helmet";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";
import { services } from "./routes/routes";
import { INTERVAL_TIME } from "./constant/requests";
import { rateLimitAndTimeout } from "./middleware/middleware";
import { loadConfig } from "./handlers/config";

// Load env config file
const envConfig = loadConfig()

/**
 * Object to store request counts for each IP address
 */
const requestCounts: Record<string, number> = {};

// Create an instance of Express app
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS
app.use(helmet()); // Add security headers
app.use(morgan("combined")); // Log HTTP requests
app.disable("x-powered-by"); // Hide Express server information

// Reset request count for each IP address every 'interval' milliseconds
setInterval(() => {
    Object.keys(requestCounts).forEach((ip) => {
        requestCounts[ip] = 0; // Reset request count for each IP address
    });
}, INTERVAL_TIME);

// Set up proxy middleware for each microservice
services.forEach(({ path, target }) => {
    // Proxy options
    const proxyOptions = {
        target,
        changeOrigin: true,
        pathRewrite: {
            [`^${path}`]: "",
        },
    };

    // Apply middleware chain functions. 
    // 1. rate limiting and timeout middleware before proxy
    // 2. create proxy  middleware
    // 3. handle auth middleware
    app.use(path, 
        rateLimitAndTimeout(requestCounts), 
        createProxyMiddleware(proxyOptions)
    );
});

// Define port for Express server
const PORT = process.env.PORT || 5002;

// Start Express server
app.listen(PORT, () => {
    console.log(`Gateway is running on port ${PORT}`);
});