# HACKAPI

This repository contains a project developed as part of a practical assignment for my MDS program. The assignment details can be found in this [repository](https://github.com/kevinniel/M1-MDS-2425-API), created for an M1-level API course.

## Features

- <span style="color: red;">Email existence verification tool.</span>
- <span style="color: red;">Email spammer (content + number of sends).</span>
- <span style="color: red;">Phishing service (create a custom phishing webpage - backed by AI!).</span>
- <span style="color: red;">Check if the password is on the list of most common passwords (https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10k-most-common.txt).</span>
- <span style="color: red;">Retrieve all domains & subdomains associated with a Domain Name (Adrien, this is also called "NDD" in the field 😁).</span>
- <span style="color: red;">DDoS.</span>
- <span style="color: red;">Random image change (find an API that does this ^^).</span>
- <span style="color: red;">Generate fake identity => use the Faker library!</span>
   - <span style="color: red;">faker JS: https://fakerjs.dev/</span>
   - <span style="color: red;">faker PHP: https://fakerphp.org/</span>
   - <span style="color: red;">faker Python: https://faker.readthedocs.io/en/master/</span>
   - <span style="color: red;">faker .NET: https://www.nuget.org/packages/Faker.Net/</span>
   - <span style="color: red;">faker JAVA: https://javadoc.io/doc/com.github.javafaker/javafaker/latest/com/github/javafaker/Faker.html</span>
   - <span style="color: red;">faker Ruby: https://github.com/faker-ruby/faker</span>
- <span style="color: red;">Information crawler about a person (from a first/last name).</span>
- <span style="color: red;">Secure password generator.</span>


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
