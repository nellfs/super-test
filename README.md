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

# Endpoints

Assuming localhost

## Classes
List Classes with Pagination and Filter:

Pagination:

GET -> http://localhost:3131/api/v1/classes?limit=5&page=1

Filtering:

GET -> http://localhost:3131/api/v1/classes?name=startOfName

Delete Class:

DELETE -> http://localhost:3131/api/v1/classes/id

Get Class by ID:

GET -> http://localhost:3131/api/v1/classes/id

Create Class:

POST ->  http://localhost:3131/api/v1/classes

Body Example:
```
{
  "name": "Class 101",
  "description": "Welcome to class",
  "start_date": "2020-10-10",
  "end_date": "2025-10-10"
}
```

Update Class:

PATCH -> http://localhost:3131/api/v1/classes/id

Body Example:
```
{
  "name": "Class edited",
  "description": "This class is edited",
}
```

Enroll a list of students in a Class:

POST -> http://localhost:3131/api/v1/classes/{{class_id}}/enroll

Body Example
```
{
  "students": [
    16,
    17,
    18
  ]
}
```

---

## Students

Get Student by ID:

GET -> http://localhost:3131/api/v1/students/id

List Students with Pagination and Filter

Pagination:

GET -> http://localhost:3131/api/v1/students?limit=5&page=1

Filter:

GET -> http://localhost:3131/api/v1/students?limit=5&page=1&name=firstNameStart

Create Student:

POST -> http://localhost:3131/api/v1/students

Body Example:

```
{
  "first_name": "Name",
  "last_name": "Last Name",
  "email": "test@email.com",
  "date_of_birth": "1990-12-28"
}
``` 

Delete Student:

DELETE -> http://localhost:3131/api/v1/students/id

Update Student:

PATCH -> http://localhost:3131/api/v1/students/id

Body Example:
```
{
  "first_name": "Edited",
  "last_name": "Last Name",
}
```

Get All Classes of a Student:

GET -> http://localhost:3131/api/v1/students/id/classes

---

Simple Hello World (Test)

GET -> http://localhost:3131/api/v1/
