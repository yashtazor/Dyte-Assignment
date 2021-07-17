"use strict";

const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");
const MongoDBAdapter = require("moleculer-db-adapter-mongo");

let broker = new ServiceBroker({
	logger: console,
	logLevel: "debug"
});

// Intialize the MongoDB adapter service.
broker.createService({

	name: "posts",
	mixins: [DbService],
	adapter: new MongoDBAdapter("mongodb://localhost/local"),
	collection: "Test",

});

module.exports = {
    name: "webhooks",

	settings: {
		// Available fields in the responses.
		fields: [
			"_id",
			"url",
		],
	},

    actions: {
		
		// Action to register a URL. (POST)
		register: {

			rest: {
				method: "POST",
				path: "/register/:url"
			},

			params: {
				url: "string"
			},

			async handler(ctx) {

				let ans;

				await broker.start().then(() => broker.call("posts.create", { url: ctx.params.url,}).then(response => {
					ans = JSON.stringify(response._id);
				}));

				return (JSON.parse(ans));
			}			
		},

		// Action to list all users. (GET)
        list: {

			rest: {
				method: "GET",
				path: "/list"
			},

			async handler() {

				let ans;

				await broker.start().then(() => broker.call("posts.find").then(response => {
					ans = JSON.stringify(response);
				}));			

				return(JSON.parse(ans));

			}
		},

		// Action to update a user. (PUT)
		update: {

			rest: {
				method: "PUT",
				path: "/update/:id/:newTargetUrl"
			},

			params: {
				id: "string",
				newTargetUrl: "string"
			},

			async handler(ctx) {

				let ans;

				await broker.start().then(() => broker.call("posts.update", { id: ctx.params.id, url: ctx.params.newTargetUrl }))
				.then((response) => { ans = JSON.stringify(response); })
				.catch(err => { ans = JSON.stringify(err.code); });

				if(ans == "404")
					return("Unable to update in the database! Response Status Code: " + ans);
				else
					return("Updated in the database! Response Status Code: 200");
			}
		},

		// Action to delete a user. (DELETE)
		delete: {

			rest: {
				method: "DELETE",
				path: "/delete/:id"
			},

			params: {
				id: "string",
			},

			async handler(ctx) {

				let ans;

				await broker.start().then(() => broker.call("posts.remove", { id: ctx.params.id }))
				.then((response) => { ans = JSON.stringify(response); })
				.catch(err => { ans = JSON.stringify(err.code); });

				if(ans == "404")
					return("Unable to delete from the database due to invalid ID! Response Status Code: " + ans);
				else
					return("Deleted from the database! Response Status Code: 200");

			}
		},

		// Trigger action.
		trigger: {

			rest: {
				method: "GET",
				path: "/ip"
			},

			async handler() {

				// Extract some URLs from database by posts.list and store in an array.
				let ans;
				var urls = [];

				await broker.start().then(() => broker.call("posts.find", { limit: 5 }).then((response) => {

					ans = JSON.parse(JSON.stringify(response));
					ans.forEach((x, i) => urls.push(x._id));

				}));		
				
				//console.log(urls);

				return(ans);

				// Inside the calling function,

					// Make a pair(ipAdress, UNIX Timestamp) on the fly.

					// Send this pair to all the URLs in the array parallelly by a combination of broker.call 
					// and asunc.parallelLimit or map.
			}
		},
}};