import cors from "cors";
import express from "express";
import helmet from "helmet";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";
import dotenv from 'dotenv';
import { services } from "./routes/routes";
import { INTERVAL_TIME } from "./constant/requests";
import { rateLimitAndTimeout } from "./middleware/middleware";

//For env File 
dotenv.config();

// Create an instance of Express app
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS
app.use(helmet()); // Add security headers
app.use(morgan("combined")); // Log HTTP requests
app.disable("x-powered-by"); // Hide Express server information

// Object to store request counts for each IP address
const requestCounts: any = {};

// Reset request count for each IP address every 'interval' milliseconds
setInterval(() => {
    Object.keys(requestCounts).forEach((ip) => {
        requestCounts[ip] = 0; // Reset request count for each IP address
    });
}, INTERVAL_TIME);

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

    // Apply rate limiting and timeout middleware before proxy
    app.use(route, rateLimitAndTimeout, createProxyMiddleware(proxyOptions));
});

// Define port for Express server
const PORT = process.env.PORT || 5002;

// Start Express server
app.listen(PORT, () => {
    console.log(`Gateway is running on port ${PORT}`);
});