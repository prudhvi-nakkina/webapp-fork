# Assignment - 2

## GOAL

### The goal of this assignment is to implement a backend server with multiple Api's and implement CI with github actions

## Features

- As a developer, I should be able to add a product for a user by providing all the details
- As a developer, I should be able to update an user's product by providing all the details
- As a developer, I should be able to delete an user's product by providing product ID
- As a developer, I should be able to fetch an user's product by providing product ID
- As a developer, I should implement authorization for PUT,POST,PATCH and GET calls using basic authorization

## Requirements

- Node.js
- Express.js
- Sequelize
- Mocha
- Chai
- Supertest
- Postman

## Steps to run the project

- Clone the repository
- Run npm install
- Run npm test
- Run npm start
- Open postman and test

## API's

- add new product
  POST /v1/product

- fetch product by id
  GET /v1/product/:id

- update product by id
  PUT/PATCH /v1/product/:id

- delete product by id
  DELETE /v1/product/:id
