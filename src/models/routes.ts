/**
 * Interface representing a service configuration for routing.
 */
export interface Service {
    /**
     * The URL path segment used by the API gateway to route requests to specific backend service.
     * When a user accesses `http://localhost/<path>`, 
     * the API gateway will route the request to the corresponding backend service.
     * 
     * Example: "/stormbreaker"
     */
    path: string;
    /**
     * The actual destination of the backend service, 
     * constructed from the container name and its port.
     * 
     * Example: "http://stormbreaker:5001"
     */
    target: string;
}