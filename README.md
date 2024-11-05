<div align="center">
  <img width="250" src="https://nestjs.com/img/logo-small.svg" alt="NestJS Logo">
  <br>
  <h2>nestjs-auth-backend</h2>
  <hr>
</div>

# Getting started

## Installation

Clone the repository

    git clone https://github.com/phuonghieuto/nestjs-auth-backend.git

Switch to the repo folder

    cd nestjs-auth-backend

Install dependencies

    npm install

Create a `.env` file and write it as follows

    MONGODB_URI='your-mongodb-uri'
    JWT_SECRET='jwt-secret'
    JWT_EXPIRATION='1h'
 
----------

## Database

The example codebase uses [Mongoose](https://mongoosejs.com/).

----------

## NPM scripts
- `npm run start` - Start application
- `npm run start:dev` - Start application in development mode

----------

# Authentication

This application uses JSON Web Token (JWT) to handle authentication.

----------

# Swagger API docs

Visit http://127.0.0.1:8080/api in your browser

This example repo uses the NestJS swagger module for API documentation. [NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)

# :link: Demo

-   <a target="_blank" href="https://nestjs-auth-backend.vercel.app/api"> Click Here </a> to checkout how this api works.