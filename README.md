---
"": ""
---

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /><a>
</p>

<div align="center">
  <a href="#i-setup">Setup</a> |
  <a href="#ii-testing">Testing</a> |
  <a href="#iii-code-structure">Code Structure</a> |
  <a href="#iv-design-choices">Design Choices</a>
</div>

***

Welcome to the perspective-test repository!

Here you will find everything you need to run, test and understand this project.

# **I. Setup**

## 1. Clone the repository:

* Using HTTPS:

`git clone `[`https://github.com/SteevePere/perspective-test.git`](https://github.com/SteevePere/perspective-test.git)

* Using SSH:

`git clone git@github.com:SteevePere/perspective-test.git`

## 2. Navigate to the root of the project:

`cd perspective-test`

Now you have two options: You can either 1) run the project on your OS directly, or 2) use my Docker Compose setup to run everything in Docker (recommended!).

## 3. Run the project:

**3.a. Using Docker Compose (recommended)**

`docker-compose up`

> [!NOTE]
This may take a little while the first time you build the images. Should take about 3 minutes. I haven't had the time to look into build optimization :').

That's it! You can now go directly to 4).

**3.b. On your OS**

* 3.b.1. Dependencies

From the root of the repository, run the following command to install all dependencies:

`yarn`


> [!WARNING]
This repository is a Lerna + Yarn Workspaces monorepo. Using npm instead of yarn to install packages may create errors.


* 3.b.2. Library

Next, we want to build the shared library (see "Code Structure" section for more details).

`cd libs/shared && yarn build`

* 3.b.3. Database

Before we can run the API, we need a database server running. This API uses PostgreSQL. I recommend running a Docker container that you can just discard once you're done:

> [!WARNING]
If you already have a Postgres server running, please edit the port mapping in the command below to use a different port than 5432 (edit the left value "5432" after "-p").
Alternatively, feel free to shut down your server!


`docker run --name postgres -e POSTGRES_PASSWORD=root -e POSTGRES_DB=perspective-test -d -p 5432:5432 postgres`

This runs a fully-configured PostgreSQL container with a "perspective-test" database already created for you.&#x20;

If you prefer to use your own PostgreSQL server, please create a "perspective-test" database manually.

Next, we want to make sure the .env file in the API (apps/services/.env) is correctly configured for this setup:

> [!CAUTION]
I have pushed my .env file (with values) to make testing this project easier, but this should never be done with actual repositories.


Edit the `DATABASE_URL` variable so that the connection string matches your database server. If you've ran the Docker container above, use "localhost" as a host (ports are mapped). If you're using your own Postgres server, please simply edit the username and password to match your own config. In apps/services/.env:

`DATABASE_URL=postgresql://postgres:root@localhost:5432/perspective-test`

> [!TIP]
The default host name "postgres" in the .env file is the name of the Docker service defined in my Docker Compose. If you modify it and wish to test the compose later on, please reset the host to "postgres".


* 3.b.3. Running the API

We can now run the API.

`cd services && yarn start:dev`

If all steps above have been done correctly, the API should start and listen on port 8080.

## 4. Open the live OpenAPI (Swagger) Documentation:

Open your browser, and go to [http://localhost:8080/swagger](http://localhost:8080/swagger).

Now you can play around with the API :).

***

# II. Testing

I have written both unit tests and end-to-end tests for the Users module . See the "Code structure" section to locate them easily.

## 1. Unit tests

From the root of the repo, run:

`cd apps/services && yarn test:controllers`

## 2. End-to-end tests

To run the tests, you must first build the shared library. From the root of the project, run:

`cd libs/shared && yarn build`

Next, you will need to make sure that the mocked API has a working connection with a PostgreSQL database.

If initially you decided to run the project using Docker Compose, see section 3.b.3. "Database" of the Setup procedure.

> [!NOTE]
Please note that I haven't had the time to setup an in-memory db for testing purposes, so even though I am mocking the whole app, end-to-end tests will use the main db configured in the .env file.


Then, run this command to run the e2e tests:

`yarn test:e2e`

## 3. Running all tests in sequence

I have created a script to run all tests (unit and e2e) in sequence. Make sure your database connection is correctly setup (and database server is running). See section 2. "End-to-end tests."

The command to run all tests is the following:

`yarn test:all`

***

# III. Code structure

This repository is a Lerna monorepo, which leverages Yarn workspaces.

At the root of the repo, you'll find:

* apps: the applications themselves. For now we only have one, an API, called "services".
* libs: the code libraries. These can easily be shared between apps (and other libs). Great when you have an API and a frontend app in the repo. Our only lib is called "shared".
* lerna.json: Lerna configuration
* package.json: the root packages and scripts

### 1. /apps/services (API)

This API is a typical NestJS application.

In /test/users, you'll find the unit & e2e tests.

In /src, you'll find:

* config: config objects to wrap env variables and inject them into modules
* core: an internal code library, to share code between modules
* modules: our business logic. In this app we only have the "users" module.
  * controllers: where the routes are defined. This is where we leverage the business logic in our services with DI, handle auth, etc.
  * services: the business logic in itself. Typically injects a repository to talk with a DB.
  * entities: our business entities / tables
  * dtos: internal DTOs relevant to the current module (not to be confused with external business objects that live in the shared library)
  * transformers: used to transform entities into business objects
* the app module: imports all other modules, and defines config of top-level modules / providers /etc.
* the main file&#x20;

### 2. /libs/shared (main library)

Here you will find business objects and DTOs that need to be shared between apps, or even to the outside world (e.g. publish the lib on npm along with a SDK and third-party apps can use it in their project).

From the root of /src, you'll find:

* decorators: these are meant to be share between modules within the library
* modules: ideally these should mirror our modules in the API&#x20;
  * shared: DTOs, enums, etc. shared between modules
  * users: our only module here
    * enums: self-explanatory
    * objects: business objects that provide an abstraction layer from the crude db entities
    * requests: DTO classes for API / SDK input
    * responses: DTO classes that define the API / SDK output contract

***

# IV. Design Choices

## 1. Lerna & Yarn Workspaces

I have a fair bit of experience using Lerna monorepos, and I find they make your life super easy at various stages of the development cycle.&#x20;

Most notably:&#x20;

* Code sharing: dependencies between projects are super easy to manage
* Centralized configuration prevents (some) errors
* Versioning & publishing is handled very well
* Insanely scalable while being relatively straightforward to setup

[The Docs](https://lerna.js.org).

## 2. NestJS

In my opinion, Nest is hands down the best Node.js framework out there. I could go on for hours about why it is the best, however here are some key points that justify my choice here:

* I have 5 years experience with the framework
* Nest makes sense for tiny applications like this one, but is also hugely scalable
* Built in Typescript, for Typescript
* A ton of features out of the box
* Modular design, heavy reliance on decorators and dependency injection (great for decoupling code... and testing)
* A huge community
* etc. etc.

In a nutshell, Nest is like the child of Spring Boot (DI, scalability) and Angular (decorators, modules)... on steroids.

[The Docs](https://nestjs.com).
