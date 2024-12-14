import { Service } from "models/routes";

// Define routes and corresponding microservices
export const services: Service[] = [
	// Add more services as needed either deployed or locally.
	{
		path: "/stormbreaker",
		target: "http://stormbreaker:5001",
	}, 
	{
		path: "/electric-notifications",
		target: "http://electric-notifications:5003"
	},
	{
		path: "/electric-auth",
		target: "http://electric-auth:5004"
	},
	{
		path: "/electric-mongo",
		target: "http://electric-mongo:27017"
	},
	{
		path: "/electric-rabbitmq-ui",
		target: "http://electric-rabbitmq:15672"
	},
	{
		path: "/electric-rabbitmq",
		target: "http://electric-rabbitmq:5672"
	},

];


// Define public routes (route to specific service) that do not require authentication
export const nonAuthRequiredPaths = ['/electric-auth', '/electric-rabbitmq-ui'];
