# HACKAPI

This repository contains a project developed as part of a practical assignment for my MDS program. The assignment
details can be found in this [repository](https://github.com/kevinniel/M1-MDS-2425-API), created for an M1-level API
course.

## Features

- <code style="color: green;">Email existence verification tool.</code>
- <code style="color: green;">Email spammer (content + number of sends).</code>
- <code style="color: green;">Phishing service (create a custom phishing webpage - backed by AI!).</code>
- <code style="color: green;">Check if the password is on the list of most common
  passwords (https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10k-most-common.txt).</code>
- <code style="color: green;">Retrieve all domains & subdomains associated with a Domain Name.</code>
- <code style="color: green;">DDoS.</code>
- <code style="color: green;">Random image generator (this person does not exist).</code>
- <code style="color: green;">Generate fake identity => use the Faker library! (faker JS: https://fakerjs.dev/)</code>
- <code style="color: green;">Information crawler about a person (from a first/last name).</code>
- <code style="color: green;">Secure password generator.</code>

## Obligations

- <code style="color: green;">Control access to your API with a login system based on JWT.</code>
- <code style="color: green;">Set up a permissions system, manageable by administrators, which defines which features
  can
  be accessed by each user.</code>
- <code style="color: green;">Implement an internal logging system, accessible only to admins, to track:</code>
    - <code style="color: green;">the latest actions performed,</code>
    - <code style="color: green;">recent actions of a specific user,</code>
    - <code style="color: green;">recent actions related to a specific feature.</code>
- <code style="color: green;">Strict adherence to RESTful conventions.</code>
- <code style="color: green;">Integrate a `Swagger.json` file for documentation purposes, usable
  on "https://swagger.io/tools/swagger-ui/". </code>
- <code style="color: green;">Follow the Richardson Maturity Model.</code>
- <code style="color: green;">Test your API in POSTMAN, including:</code>
    - <code style="color: green;">Organizing your routes in collections and within a project</code>
    - <code style="color: green;">Automating the generation of the bearer token and its transmission in all requests (
      Bearer = JWT).</code>

## Conceptual Data Model

Below is Version 1 of the conceptual data model, which incorporates all required functionalities and specifications for
the database.
![image](https://github.com/user-attachments/assets/f9bbe655-2f52-4d2d-bbf1-70066698c93d)

## Project Installation

1. Installation

```bash
git clone https://github.com/YaelBusser/HACKAPI.git
cd HACKAPI
npm install
```

2. Host the `hackapi` database (found in the `data-save` folder) on your local server (I personally use XAMPP).

3. Create and define the following variables in the `.env` file:
    - `DATABASE_URL=mysql://root:@localhost:3306/hackapi?schema=public`
    - `PORT=4000`
    - `JWT_SECRET=hackapiJWT`
    - `API_KEY_HUNTER_IO="f8a019855c4d19fb06628c03578695f3bb0a56e0"`
    - `SECURITY_TRAILS_API_KEY="ib9ERgLgT2LVGKs2fwmB122cRmKB1afG"`
    - `EMAIL_APP_DEVMDS="developpermds@gmail.com"`
    - `PASSWORD_APP_DEVMDS="ncfe ldrg aofx zcod"`
    - `SECURITY_TRAILS_API_KEY="ib9ERgLgT2LVGKs2fwmB122cRmKB1afG"`

4. To launch the API, simply run the following command:
   ```bash
   npm run dev

5. To view the logs, you can execute this request (requirement: logged in as an admin): http://localhost:4000/logs

## Usage Instructions

You can easily access the hosted application at the following URL:

OR

To interact with the API functionalities, you can use Postman, for example, to set up the Bearer token.

Next, open Postman and import the collection (`HACKAPI.postman_collection.json`) located in the Postman folder.

View the routes:
To access the Swagger UI, visit this link: http://localhost:4000/api-docs
Alternatively, you can download the `swagger/swagger.json` file and import it at this
link: https://swagger.io/tools/swagger-ui/

### Features

To use the features, refer to the Postman collection and then the "features" folder.

### Id_features

- **1** - Email address verification tool
- **2** - Spam mail (content + number of sends)
- **3** - Phishing service (creation of a customized phishing...)
- **4** - Is my password protected?
- **5** - Retrieve all domains & subdomains associated with...
- **6** - DDoS
- **7** - Random image person generator (thispersondoesntexists)
- **8** - Fictitious identity generation
- **9** - Person information crawler (based on first / last name...)
- **10** - Secured password generator
