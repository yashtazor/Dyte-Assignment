"use strict";

let { ServiceBroker } 	= require("moleculer");
let ApiGatewayService 	= require("moleculer-web");
let express 			= require("express");

// Create broker
let broker = new ServiceBroker({
	logger: console
});

// Load other services
broker.loadService("./services/webhooks.service");

// Load API Gateway
const svc = broker.createService({
	mixins: ApiGatewayService,

	settings: {
		server: false,
		routes: [{

			whitelist: [
				"webhooks.register",
                "webhooks.list",
                "webhooks.update",
                "webhooks.delete",
                "webhooks.trigger",
			],

			mappingPolicy: "all"
		}]
	}
});

// Create Express application
const app = express();

// Use ApiGateway as middleware
app.use("/api", svc.express());

// Listening
app.listen(3333, err => {
	if (err)
		return console.error(err);

	console.log("Open http://localhost:3333/api");
});

// Start server
broker.start();