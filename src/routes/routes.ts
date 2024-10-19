import { Service } from "models/routes";

// Define routes and corresponding microservices
export const services: Service[] = [
	// Add more services as needed either deployed or locally.
	{
		route: "/stormbreaker",
		target: "http://stormbreaker:5001",
	}, 
	{
		route: "/electric-notifications",
		target: "http://electric-notifications:5003"
	},
	{
		route: "/electric-mongo",
		target: "http://electric-mongo:27017"
	}

];
