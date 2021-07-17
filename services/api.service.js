"use strict";

const ApiGateway = require("moleculer-web");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {

	name: "api",

	mixins: [ApiGateway],

	settings: {

		// Exposed port
		port: process.env.PORT || 3000,

		// Exposed IP
		ip: "0.0.0.0",

		// Global Express middlewares.
		use: [],

		routes: [
			{
				path: "/api",

				whitelist: [
					"**"
				],

				// Route-level Express middlewares.
				use: [],

				// Enable/disable parameter merging method.
				mergeParams: true,

				// Enable authentication.
				authentication: false,

				// Enable authorization.
				authorization: false,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				autoAliases: true,

				aliases: {

				},

				/** 
				 * Before call hook. You can check the request.
				 * @param {Context} ctx 
				 * @param {Object} route 
				 * @param {IncomingRequest} req 
				 * @param {ServerResponse} res 
				 * @param {Object} data
				 * 
				onBeforeCall(ctx, route, req, res) {
					// Set request headers to context meta
					ctx.meta.userAgent = req.headers["user-agent"];
				}, */

				/**
				 * After call hook. You can modify the data.
				 * @param {Context} ctx 
				 * @param {Object} route 
				 * @param {IncomingRequest} req 
				 * @param {ServerResponse} res 
				 * @param {Object} data
				onAfterCall(ctx, route, req, res, data) {
					// Async function which return with Promise
					return doSomething(ctx, res, data);
				}, */

				// Calling options.
				callingOptions: {},

				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB"
					},
					urlencoded: {
						extended: true,
						limit: "1MB"
					}
				},

				// Mapping policy setting. 
				mappingPolicy: "all",

				// Enable/disable logging.
				logging: true
			}
		],

		// Do not log client side errors.
		log4XXResponses: false,
		// Logging the request parameters.
		logRequestParams: null,
		// Logging the response data.
		logResponseData: null,


		// Serve assets from "public" folder.
		assets: {
			folder: "public",

			// Options to `server-static` module
			options: {}
		}
	}
};