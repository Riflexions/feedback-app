# API Authentication with JWT

This is a sample starting point for building API authenticated with JWT using Node, Express and MongoDB
## Pre Requisites
1. MongoDB instance

## Installation
1. Fork this repository
2. Install deps using ```npm install```
3. update ```/config/index.js``` with app secret and Mongo instance path
4. Run ```npm start``` to start the server

## Usage
### Sign Up
Used to create a new user
#### Request:
```POST /api/signup```
#### Sample Payload:
```json
{
    "user":{
        "email": "user@example.com",
        "password":"user@123",
        "firstname": "user",
        "lastname": "example"
    }
}
```
#### Sample Response:
```json
{
    "user": {
        "firstname": "user",
        "lastname": "example",
        "email": "user@example.com",
        "createdAt": "2016-04-16T17:13:40.979Z",
        "updatedAt": "2016-04-16T17:13:40.979Z"
    }
}
```

### Authenticate
Used to authenticate user and receive token
#### Request:
```POST /api/authenticate```
#### Sample Payload:
```json
{
  "email": "user@example.com",
  "password":"user@123"
}
```
#### Sample Response:
```json
{
    "user": {
        "firstname": "user",
        "lastname": "example",
        "email": "user@example.com",
        "createdAt": "2016-04-16T17:13:40.979Z",
        "updatedAt": "2016-04-16T17:13:40.979Z"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbG..." //Truncated for brevity
}
```

### Users
Lists all users. Token is required.
#### Request:
```GET /api/users?&token=<token_value>```

#### Sample Response:
```json
{
    "users": [
        {
            "firstname": "user",
            "lastname": "example",
            "email": "user@example.com",
            "createdAt": "2016-04-16T17:13:40.979Z",
            "updatedAt": "2016-04-16T17:13:40.979Z"
        },
        ...
    ]
}
```

## References:

Put this together by studying these great resources:

1. [Authenticate a Node.js API with JSON Web Tokens](https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens)
2. [oauth2-example](https://github.com/mekentosj/oauth2-example)