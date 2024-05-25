import { Service } from "models/routes";

// Define routes and corresponding microservices
export const services: Service[] = [
	{
		route: "/stormbreaker",
		target: "http://stormbreaker:5001",
	},
	// Add more services as needed either deployed or locally.
];
