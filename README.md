# Student & Class Management API

This API implements basic functionality for managing students and classes. You can manage student and class through this API. 😄

To start testing the API, you can use the [Bruno collection](https://github.com/nellfs/super-test/tree/main/api-bru) file, which contains all endpoints

# How to Run
## Using Docker Compose


You can run the application and MySQL database together using Docker Compose:
```
docker compose up
```
The migrations will be automatically executed when the application starts, so you can begin testing the API at:
`http://localhost:3131/api/v1`

## Bare Metal (Development and Testing)

If you'd prefer to run the application locally for development or testing

```
$ git clone https://github.com/nellfs/super-test.git
```
```
$ cd super-test 
```
```
$ npm install
```
---

* To run all tests:
```
npm run test
```

* To run only integration tests:
```
npm run test:integration
```

* To run the application in development mode
```
npm run start:dev
``` 