# FastBooks API

My first RESTful API!

It allows for CRUD operations on a MongoDB database, authentication and authorization using bcrypt and JWT, error handling with express and much more. 

# Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

# Prerequisites
Node.js, MongoDB and npm

# Installing
-Clone the repository to your local machine by running 'git clone https://github.com/henriquebuzon/FastBooks'

-Install the dependencies running 'npm install'

-Create a .env file in the root of the project and set the following variables:
NODE_ENV=development, PORT, DATABASE, DATABASE_PASSWORD, JWT_SECRET, JWT_EXPIRES_IN=100d, JWT_COOKIE_EXPIRES_IN=90, EMAIL_USERNAME=6a1f23923d5f47, EMAIL_PASSWORD=2d8824ec6ca8c0, EMAIL_HOST=smtp.mailtrap.io, EMAIL_PORT=25
  
-Start the development server by running 'npm start'.

The API will be running on http://localhost:3000

# Endpoints documentation
Books - https://documenter.getpostman.com/view/24272923/2s8ZDczfHc

Reviews - https://documenter.getpostman.com/view/24272923/2s8ZDczfN4

Users - https://documenter.getpostman.com/view/24272923/2s8ZDczfN5

# Built using
bcrypt

bcryptjs

compression

dotenv

express-mongo-sanitize

express-rate-limit

express

helmet

hpp

jsonwebtoken

mongoose

morgan

nodemailer

nodemon

prettier

pug

slugify

validator

xss-clean

# Author
Henrique Buzon - https://github.com/henriquebuzon
