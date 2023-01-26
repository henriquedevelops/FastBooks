# FastBooks API

My first RESTful API!

This is a RESTful API built using Node.js, Express, MongoDB, Mongoose, JWT, and other Node.js libraries. The API allows for CRUD operations on a MongoDB database, authentication and authorization using bcrypt and JWT, error handling with express and much more. 

# Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

# Prerequisites
Node.js
MongoDB
npm

# Installing
Clone the repository to your local machine

git clone https://github.com/yourusername/your-repo-name.git
Install the dependencies

npm install (or yarn install)
Create a .env file in the root of the project and set the following variables:

MONGO_URI=mongodb://<username>:<password>@<host>:<port>/<database>
JWT_SECRET=<yoursecret>
Start the development server

npm run start 
The API will be running on http://localhost:3000

# API Endpoints
GET /api/resources - Retrieve all resources
GET /api/resources/:id - Retrieve a single resource
POST /api/resources - Create a new resource
PUT /api/resources/:id - Update a resource
DELETE /api/resources/:id - Delete a resource

# Built With
Node.js - JavaScript runtime
Express - Web framework for Node.js
MongoDB - NoSQL database
Mongoose - Object modeling for MongoDB
JWT - JSON Web Tokens for authentication and authorization

# Author
Henrique Buzon - https://github.com/henriquebuzon
