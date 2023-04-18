# Assignment - 9

## GOAL

### The goal of this assignment is to implement a backend server with multiple Api's and implement CI with github actions

## Features

## Assignment-1 features

- As a developer, I should be able to create an user by providing all the details
- As a developer, I should be able to update update an user by providing all the details
- As a developer, I should be able to fetch an user by providing his ID
- As a developer, I should implement authorization for PUT and GET calls using basic authorization

## Assignment-2 features

- As a developer, I should be able to add a product for a user by providing all the details
- As a developer, I should be able to update an user's product by providing all the details
- As a developer, I should be able to delete an user's product by providing product ID
- As a developer, I should be able to fetch an user's product by providing product ID
- As a developer, I should implement authorization for PUT,POST,PATCH and GET calls using basic authorization

## Assignment-4 features

- As a developer, I should be able to build an AMI image post merge

## Assignment-5 features

- As a User, I should be able to upload images to the products I have created
- As a User, I should be able to delete only my own images from the products they I created
- As a User, I should not be able to delete images uploaded by other users or from products created by other users.
- As a developer, I must ensure the partitioning user's images in the object storage bucket.

## Assignment-7 features

- As a user, I want all application log data to be available in CloudWatch.
- As a user, I want metrics on API usage available in CloudWatch.
- As a developer, I can log metrics using statsd

## Assignment-8 features

- As a developer, I can implement continuous delivery by refreshing launch template
- As a developer, I can implement ssl encryption for website

## Requirements

- Node.js
- Express.js
- Sequelize
- Mocha
- Chai
- Supertest
- Postman
- Packer

## Steps to run the project

- Clone the repository
- Run npm install
- Run npm test
- Run npm start
- Open postman and test
-

## Assignment-5 API's

- upload new Image
  POST /v1/product/:id/image

- get all images
  GET /v1/product/:id/image

- get image by id
  GET /v1/product/:pid/image/:id

- delete image by id
  DELETE /v1/product/:pid/image/:id

## Assignment-2 API's

- add new product
  POST /v1/product

- fetch product by id
  GET /v1/product/:id

- update product by id
  PUT/PATCH /v1/product/:id

- delete product by id
  DELETE /v1/product/:id

## Assignment-1 API's

- create new user
  POST /v1/user

- fetch user by id
  GET /v1/user/:id

- update user by id
  PUT /v1/user/:id

- Health check
  GET /healthz

## import certificate

aws acm import-certificate --certificate fileb:///mnt/c/prod_prudhvinakkina_me/Certificate.crt --private-key fileb:///mnt/c/prod_prudhvinakkina_me/PrivateKey.pem --certificate-chain fileb:///mnt/c/prod_prudhvinakkina_me/CertificateChain.pem
