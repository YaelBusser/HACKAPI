# HACKAPI

This repository contains a project developed as part of a practical assignment for my MDS program. The assignment details can be found in this [repository](https://github.com/kevinniel/M1-MDS-2425-API), created for an M1-level API course.

## Obligations

- <span style="color: green;">Control access to your API with a login system based on JWT.</span>
- <span style="color: red;">Set up a permissions system, manageable by administrators, which defines which features can be accessed by each user.</span>
- <span style="color: red;">Implement an internal logging system, accessible only to admins, to track:</span>
   - <span style="color: red;">the latest actions performed,</span>
   - <span style="color: red;">recent actions of a specific user,</span>
   - <span style="color: red;">recent actions related to a specific feature.</span>
- <span style="color: green;">Strict adherence to RESTful conventions.</span>
- <span style="color: red;">Integrate a `Swagger.json` file for documentation purposes, usable on "https://swagger.io/tools/swagger-ui/".</span>
- <span style="color: green;">Follow the Richardson Maturity Model.</span>
- <span style="color: green;">Test your API in POSTMAN, including:</span>
   - <span style="color: green;">Organizing your routes in collections and within a project</span>
   - <span style="color: green;">Automating the generation of the bearer token and its transmission in all requests (Bearer = JWT).</span>


## Conceptual Data Model

Below is Version 1 of the conceptual data model, which incorporates all required functionalities and specifications for the database.
![image](https://github.com/user-attachments/assets/f9bbe655-2f52-4d2d-bbf1-70066698c93d)

## Project Installation

1. Host the `hackapi` database (found in the `data-save` folder) on your local server (I personally use XAMPP).

2. Create and define the following variables in the `.env` file:
   - `DATABASE_URL=mysql://root:@localhost:3306/hackapi?schema=public`
   - `PORT=4000`
   - `JWT_SECRET=hackapiJWT`

## Usage Instructions

To interact with the API functionalities, you can use Postman, for instance, to set up the Bearer token.

OR

You can simply use the hosted application at this url:
