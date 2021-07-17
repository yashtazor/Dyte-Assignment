# Dyte Assignment

This project has been made as an assignment for Dyte's recruitment process. I chose the topic of **Backend** wherein we were required to build a **Webhooks Microservice**.

## Libraries Required

These libraries are needed to be installed to run this project successfully.

* Express
* Nodemon
* Molecular (Web, DB, and Mongo Adapter)
* Async
* Axios (Normal & Retry)

## Database & Schema Used

* MongoDB (Local Instance)
* The Collections store only the **ID** and the **URL**.

## How to run?

* Install all the above libraries. Use **``npm install --save LIBRARY_NAME``** command.
* Create a local MongoDB instance with a collection called **Test**.
* Navigate to the main directory and run the **```nodemon index.js```** command.
* Test the **Webhook Microservice** actions on the following routes using either **Postman** or **Browser**.


Action  | URL
------------- | -------------
Register  | http://localhost:3333/api/webhooks/register/?targetUrl=YOURURL
List  | http://localhost:3333/api/webhooks/list
Update | http://localhost:3333/api/webhooks/update?id=MongoDBIDTargetUrl=YOURNEWURL
Delete | http://localhost:3333/api/webhooks/delete?id=MongoDBID
Trigger | http://localhost:3333/api/webhooks/ip


Be sure to check the updations in **MongoDB** for the first four actions. The response status for the **Trigger** action can only be seen in the terminal.

## Tasks Achieved

* An Express backend with **register**, **list**, **update**, and **delete** which lets the admin do **CRUD** operations with stored webhooks.
* An **ip** route which captures the IP of the client and sends it the the **trigger** action.
* Complete Webhooks service with the following actions

  * **Register** - Which registers a webhook with a **targetUrl**.
  * **List** - Which lists all the stored webhook URLs and IDs from MongoDB.
  * **Update** - Which updates a webhook URL with an **id** with a **newTargetUrl**.
  * **Delete** - Which deletes a webhook URL with an **id**.
  * **Trigger** - Which retrieves a number of webhook URLs from the database and keeps sending them (IP, UNIX Timestamp) payloads to them parallely in batches of 5 requests.
  
## Bonus Tasks Achieved

* Retrying mechanism for **Trigger** service with a maximum of 5 tries.
* Dockerizing the backend. (Incomplete)

<p align="center">
<br> <br>
<b>Submitted by Yash Dekate.</b>
<p>
