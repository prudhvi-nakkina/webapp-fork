# Assignment - 1

## GOAL

### The goal of this assignment is to implement a backend server with multiple Api's and implement CI with github actions

## Features

- As a developer, I should be able to create an user by providing all the details
- As a developer, I should be able to update update an user by providing all the details
- As a developer, I should be able to fetch an user by providing his ID
- As a developer, I should implement authorization for PUT and GET calls using basic authorization

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

- create new user
  POST /v1/user

- fetch user by id
  GET /v1/user/:id

- update user by id
  PUT /v1/user/:id

- Health check
  GET /healthz
