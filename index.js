"use strict";


// Require all the needed packages.
let { ServiceBroker } 	= require("moleculer");
let ApiGatewayService 	= require("moleculer-web");
let express 			= require("express");


// Initialize the Service Broker.
let broker = new ServiceBroker({
	logger: console
});


// Load our webhooks microservice.
broker.loadService("./services/webhooks.service");


// Load API Gateway.
const svc = broker.createService({


	// Import all mixins.
	mixins: ApiGatewayService,


	// Set the settings.
	settings: {

		server: false,

		routes: [{

			// Whitelist all out actions in the webhooks service so that response from them can be captured.
			whitelist: [
				"webhooks.register",
                "webhooks.list",
                "webhooks.update",
                "webhooks.delete",
                "webhooks.trigger",
			],

			// Set alias for trigger action as it on /ip route in actual.
			aliases: {
                "webhooks/ip": "webhooks.trigger"
            },

			// Set proper mapping.
			mappingPolicy: "all"

		}]
	}
});


// Create Express application.
const app = express();


// Use ApiGateway as middleware. 
// This is essential! Otherwise, communications can't take place between the webhooks service and our Express app.
app.use("/api", svc.express());


// Listen on port 3333.
app.listen(3333, err => {
	if (err)
		return console.error(err);

	console.log("Open http://localhost:3333");
});


// Start the Broker Service.
broker.start();