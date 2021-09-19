# Webvoke

Webvoke is a simple **Webhooks Microservice** made using **Molecular JS and Express JS**.

## Libraries Required

The following libraries were used

* Express
* Nodemon
* Molecular (Web, DB, and Mongo Adapter)
* Async
* Axios (Normal & Retry)

## Database & Schema Used

The following database and schema were used

* MongoDB (Local Instance)
* The Collections store only the **ID** and the **URL**

## How to run?

Follow these steps to run or test this project

* Clone this repository and navigate inside the project directory.
* Install all the required dependancies using **``npm install``** command.
* Create a local MongoDB instance with a collection called **Test**.
* Navigate to the main directory and run the **```nodemon index.js```** command.
* Test the **Webhook Microservice** actions on the following routes using either **Postman** or **Browser**.


Action  | URL
------------- | -------------
Register  | http://localhost:3333/api/webhooks/register/?targetUrl=YOURURL
List  | http://localhost:3333/api/webhooks/list
Update | http://localhost:3333/api/webhooks/update?id=MongoDBObjectID&newTargetUrl=YOURNEWURL
Delete | http://localhost:3333/api/webhooks/delete?id=MongoDBObjectID
Trigger | http://localhost:3333/api/webhooks/ip


All updates take place in **MongoDB** and the response status for the **Trigger** action can only be seen in the terminal.

## Features

The following tasks were achieved

* An Express backend with **register**, **list**, **update**, and **delete** which lets the admin do **CRUD** operations with stored webhooks.
* An **ip** route which captures the IP of the client and sends it the the **trigger** action.
* Complete Webhooks service with the following actions

  * **Register** - Which registers a webhook with a **targetUrl**.
  * **List** - Which lists all the stored webhook URLs and IDs from MongoDB.
  * **Update** - Which updates a webhook URL with an **id** with a **newTargetUrl**.
  * **Delete** - Which deletes a webhook URL with an **id**.
  * **Trigger** - Which retrieves a number of webhook URLs from the database and keeps sending them (IP, UNIX Timestamp) payloads to them parallely in batches of 5 requests.

* Retrying mechanism for **Trigger** service with a maximum of 5 tries.

<b> <p align = "center"> Created by Yash Dekate. </p> </b>
