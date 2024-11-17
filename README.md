# HACKAPI

This repository contains a project developed as part of a practical assignment for my MDS program. The assignment
details can be found in this [repository](https://github.com/kevinniel/M1-MDS-2425-API), created for an M1-level API
course.

## Features

- <code style="color: green;">Email existence verification tool.</code>
- <code style="color: green;">Email spammer (content + number of sends).</code>
- <code style="color: orange;">Phishing service (create a custom phishing webpage - backed by AI!).</code>
- <code style="color: red;">Check if the password is on the list of most common
  passwords (https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10k-most-common.txt).</code>
- <code style="color: red;">Retrieve all domains & subdomains associated with a Domain Name.</code>
- <code style="color: red;">DDoS.</code>
- <code style="color: red;">Random image change (find an API that does this ^^).</code>
- <code style="color: red;">Generate fake identity => use the Faker library!</code>
    - <code style="color: red;">faker JS: https://fakerjs.dev/ </code>
- <code style="color: red;">Information crawler about a person (from a first/last name).</code>
- <code style="color: red;">Secure password generator.</code>

## Obligations

- <code style="color: green;">Control access to your API with a login system based on JWT.</code>
- <code style="color: green;">Set up a permissions system, manageable by administrators, which defines which features can
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

1. Host the `hackapi` database (found in the `data-save` folder) on your local server (I personally use XAMPP).

2. Create and define the following variables in the `.env` file:
    - `DATABASE_URL=mysql://root:@localhost:3306/hackapi?schema=public`
    - `PORT=4000`
    - `JWT_SECRET=hackapiJWT`
    - `API_KEY_HUNTER_IO="youApiKey"` => créer votre compte sur https://hunter.io et mettez votre clé d'api.
    - `EMAIL_APP_DEVMDS="developpermds@gmail.com"`
    - `PASSWORD_APP_DEVMDS="ncfe ldrg aofx zcod""`

3. To launch the API, simply run the following command:
   ```bash
   npm run dev

4. To view the logs, you can execute this request (requirement: logged in as an admin): http://localhost:4000/logs

## Usage Instructions

You can easily access the hosted application at the following URL:

OR

To interact with the API functionalities, you can use Postman, for instance, to set up the Bearer token.

Next, open Postman and import the collection (`HACKAPI.postman_collection.json`) located in the Postman folder.

Voir les routes :
Pour voir le swagger, rendez-vous sur ce lien : http://localhost:4000/api-docs
Vous pouvez sinon récupérer le fichier swagger/swagger.json et l'importer sur ce
lien : https://swagger.io/tools/swagger-ui/

- Features
Pour utiliser les fonctionnalités, référez-vous au fichier postman dans le dossier "features".

