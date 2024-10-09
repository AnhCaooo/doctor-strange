import { Service } from "models/routes";

// Define routes and corresponding microservices
export const services: Service[] = [
	// Add more services as needed either deployed or locally.
	{
		route: "/stormbreaker",
		target: "http://stormbreaker:5001",
	}, 
	{
		route: "/electric-push-notifications",
		target: "http://electric-push-notifications:5003"
	}

];
