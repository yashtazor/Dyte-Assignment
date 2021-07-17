"use strict";


// Require all the needed packages.
const { ServiceBroker } 	= require("moleculer");
const ApiGatewayService 	= require("moleculer-web");
const DbService 			= require("moleculer-db");
const MongoDBAdapter 		= require("moleculer-db-adapter-mongo");
const asynclib 				= require("async");
const axios 				= require("axios");
const axiosRetry 			= require('axios-retry');


// Define Axios Retry's conditions for retrying requests.
axiosRetry(axios, {

  retries: 5,
  shouldResetTimeout: true,
  retryCondition: () => true

});


// Initialize the Service Broker.
let broker = new ServiceBroker({

	logger: console,
	logLevel: "debug"

});


// Make a MongoDB adapter service.
broker.createService({

	name: "posts",
	mixins: [DbService],
	adapter: new MongoDBAdapter("mongodb://localhost/local"),
	collection: "Test",

});


// Make the main module for webhooks microservice.
module.exports = {


	// Set the name.
    name: "webhooks",


	// Set the settings.
	settings: {
		
		// Fields in responses. We need only IDs or URLs.
		fields: [
			"_id",
			"url",
		],
	},


	// Define all the actions along with their routes.
    actions: {
		

		// Action to register a URL.
		// Gets targetUrl and saves it to MongoDB.
		// POST Request.
		register: {

			// Define the REST information along with routes.
			rest: {
				method: "POST",
				path: "/register/:targetUrl"
			},

			// Define the parameters.
			params: {
				targetUrl: "string"
			},

			// Define the finctionality of this action.
			async handler(ctx) {

				let ans;

				await broker.start().then(() => broker.call("posts.create", { url: ctx.params.targetUrl,}).then(response => {
					ans = JSON.stringify(response._id);
				}));

				// Returns the ID of the just stored targetUrl in JSON format.
				return (JSON.parse(ans));
			}			
		},


		// Action to list all webhook URLs.
		// GET Request.
        list: {

			// Define the REST information along with routes.
			rest: {
				method: "GET",
				path: "/list"
			},

			// Define the finctionality of this action.			
			async handler() {

				let ans;

				await broker.start().then(() => broker.call("posts.find").then(response => {
					ans = JSON.stringify(response);
				}));			

				// Returns all the stored webhook IDs and URLs in JSON format.
				return(JSON.parse(ans));

			}
		},


		// Action to update an URLs.
		// Gets id of the URL to be changed and changes it with newTargetUrl.
		// PUT Request.
		update: {

			// Define the REST information along with routes.
			rest: {
				method: "PUT",
				path: "/update/:id/:newTargetUrl"
			},

			// Define the parameters.
			params: {
				id: "string",
				newTargetUrl: "string"
			},

			// Define the finctionality of this action.
			async handler(ctx) {

				let ans;

				await broker.start().then(() => broker.call("posts.update", { id: ctx.params.id, url: ctx.params.newTargetUrl }))
				.then((response) => { ans = JSON.stringify(response); })
				.catch(err => { ans = JSON.stringify(err.code); });

				// Return appropriate response status after updation.
				if(ans == "404")
					return("Unable to update in the database! Response Status Code: " + ans);
				else
					return("Updated in the database! Response Status Code: 200");
			}
		},


		// Action to delete a user.
		// Gets id of the URL to be deleted and deleted it from the database.
		// DELETE Request.
		delete: {

			// Define the REST information along with routes.
			rest: {
				method: "DELETE",
				path: "/delete/:id"
			},

			// Define the parameters.
			params: {
				id: "string",
			},

			// Define the finctionality of this action.
			async handler(ctx) {

				let ans;

				await broker.start().then(() => broker.call("posts.remove", { id: ctx.params.id }))
				.then((response) => { ans = JSON.stringify(response); })
				.catch(err => { ans = JSON.stringify(err.code); });

				// Return appropriate response status after deletion.
				if(ans == "404")
					return("Unable to delete from the database due to invalid ID! Response Status Code: " + ans);
				else
					return("Deleted from the database! Response Status Code: 200");
			}
		},


		// Webhook Trigger Action.
		// Retrieves some URLs from the database makes a (URL, UNIX Timestamp) payload and send multiple requests parallely.
		// DELETE Request.
		trigger: {

			// Define the REST information along with routes.
			rest: {
				method: "GET",
				path: "/ip"
			},

			// Define the finctionality of this action.
			async handler() {

				let ans, ipadd, urls = [];

				// Extract some URLs from database by posts.list service and store in an array.
				// This limit can be changed as per how many URLs have to be retrieved.
				await broker.start().then(() => broker.call("posts.find", { limit: 5 }).then((response) => {					

					ans = JSON.parse(JSON.stringify(response));
					ans.forEach((x, i) => urls.push(x.url));

				}));
				
				// Get the exposed IP address of the client.
				ipadd = ApiGatewayService.settings.ip;

				// Make parallelized HTTP POST requests 5 at a time. (Can be customized)
				asynclib.mapLimit(urls, 5, function(url, callback) {

					// Make a pair(ipAddress, Timestamp) on the fly to send as a payload to requests.
					const payload = {
						ip: url,
						time: new Date()
					};

					// Make an Axios HTTP POST request with our payload data.
					// Keeps retrying for a maximum of 5 attempts.
					axios.post(url, payload)
					.then((res) => {

						console.log(`Status: ${res.status}`);

					}).catch((err) => {

						console.log(err);

					});

					}, function(err, results) {

						console.log(err);

				});

				// Return the list of all URLs sent request parallely.
				return("The following URLs were sent request parallely. " + JSON.stringify(ans));
			}
		},
}};