# Introduction

This is a software development exercise for a FirstBlood Technologies full stack developer position.

- [See the open position description on StackOverflow](https://stackoverflow.com/jobs/393512/typescript-full-stack-developer-firstblood)

- [Read more about our hiring process](https://github.com/miohtama/how-to-hire-developers)

- [See stats of the previous hiring round](https://www.linkedin.com/pulse/experiences-hiring-remote-flutter-developers-mikko-ohtamaa/?trackingId=iUNtzRWoSsq9xX4Jq%2BMkRA%3D%3D)

# Exercise

## Your task

Your task is to create a registration form for Angular 9 + NestJS application. We estimate this will take 3-4 hours for a person who is familiar with the technology stack. The stack is the same that you would be using in your work.

- Add a registration screen to an existing Angular application skeleton
  - We need to input the following from the new users:
    - Email
    - Password
    - Display name
    - Phone number in an international plus prefixed format, like `+1 555 1231234`
  - Use your best practices and Clarity Design System examples to come up
    a basic layout form this screen

- Add a phone number to the dashboard screen, so that users can see their registered phone number

- Add server-side entity validation for the registration data using NestJS backend
  - Validation must catch basic error cases
  - Saved phone numbers must be normalized by removing any spaces or dashes or other
    special characters users may use when entering a phone number, like `+15551231234`
  - The registration screen must be user friendly and correctly
    reflect any given input error back to the user

- Add TypeORM migrations for all of the above
  - The phone number column does not yet exist in the database
  - Migration is applied on the existing database with existing records,
    so you need to make a decision how to handle existing users without phone number

- Add end-to-end tests for the new registration functionality
  - Registration success and a user can log in
    - Note that there is an email verification mechanism present,
      you may shortcut this for this exercise and consider all emails automatically valid
  - Cannot register the same email twice
  - Cannot register invalid password - must be at least 6 characters
  - Cannot register invalid phone number
  - Phone number is correctly normalized
  - The dashboard displays the registered phone number of the user

- Pull request which will be reviewed
  - Contains screenshots of changed screens
  - Contains instructions how to apply TypeORM migrations
  - Contains instructions for an internal QA team (the exercise author, or me) how to manually test your pull request
    assuming they run the application locally on their computer

## How to submit the exercise

- [ ] Create a private copy of this Github repository
- [ ] Complete the task above
- [ ] Create a new pull request against your private repository
- [ ] In the PR, write down number of hours you spent on this exercise (we do not use this to rank you, we use it to adjust the laborisity of future exercises)
- [ ] Invite a Github user `miohtama` to your repository
- [ ] Send email to `mikko@fb.io` that you have completed the exercise

## How you will be ranked

We will look

- If the task was correctly completed
- Visual quality of the user interface changes - the layouts must look professional, not broken
- If the instructions were properly followed
- All tests pass
- Code comment quality - if your code lacks helpful comments you will be negatively scored for it
- Pull request description quality - the pull request must look like a professional

# Project description

The project contains

- `frontend` folder that includes Angular 9 application with [Clarity Design System](https://clarity.design/) components and theme

- `backend` folder that includes [NestJS application](https://nestjs.com/)

- `database` contains docker files to ramp up the PostgreSQL instance needed for the exercise

# Features

- ORM: TypeORM on PostgreSQL

- UI toolkit: Clarity Design System

- Authentication: JWT tokens based on NestJS tutorial

- User: Email and password flow with confirming the email address by a verification link

- Frontend logging: ngx-logger

- API documentation: Swagger

- Integration testing: Protractor

# Installation

## Prerequisites

* Linux or macOS

* Node v12 LTS

* Globally installed `ng` command for Angular 9

* Docker

## Setting up PostgreSQL database

This is will make a new PostgreSQL running in the standard port 5432.
Please shutdown any previous conflicting PostgreSQL instances before starting this.

```bash
( cd database && docker-compose up -d )
```

Check the database is up

```bash
docker logs -f local_db
```

Check that you can log into a database with `psql`

```bash
docker exec -it local_db psql -U local_dev local_db
```

View tables

```psql
\dt
```

## Creating the initial database

You need to have the backend installed

```bash
( cd backend && npm install )
```

Run initial migrations to set up initial database tables

```bash
( cd backend && npm run migration:run )
```

Create a user you can use for the initial login

```bash
( cd backend && ts-node src/scripts/addUser.ts --email=admin@example.com --displayName=ImperatorFuriosa --password=admin )
```

# Development

## Running frontend

You can start the frontend as:

```sh
( cd frontend && ng server )
```

The frontend will open without the backend being up, but as soon as you start working with you need to have the backend up'n'running.

## Running backend

You can start the backend as:

```sh
( cd backend && npm run start:dev )
```

Backend is mapped to the frontend application in `http://localhost:4200/api` through Angular proxy configuration.

Swagger UI is available at http://localhost:3000/swagger/ to directly test API calls against the backend.

## Running tests

### Creating tests database

Only integration tests are supported. Backend is spun up on a special database.
Frontend then exercises tests against this backend and database using Protractor.
Protractor calls special API functions in `testing` module to fix backend state between tests.

Tests use their own database. To create it:

```sh
docker exec -it local_db psql -U local_dev -c "create database local_db_test" local_db
```

Note that in `backend/config/ormConfig.ts` the `local_db_test` database
is configured to synchronize TypeORM migrations automatically, unlike
the dvelopment database.

### Running tests

To run tests - first spin up the backend:

```sh
( cd backend && NODE_ENV=testing npm run start:dev )
```

Then in another terminal you can run Protractor test:

```sh
( cd frontend && ng e2e )
```

### Debugging tests

[Angular end-to-end testing is in a bad shape](https://github.com/angular/angular-cli/issues/16683).
Currently Visual Studio Code debugger does not work directly with `ng e2e`.

To debug tests

- Turn on the debugger auto attach in Visual Studio Code through the command palette
- Start `ng serve` in one terminal to have Angular frontend running for Protractor
- In another terminal, run `node --inspect-brk node_modules/.bin/protractor e2e/protractor.conf.js`
  and now Visual Studio Code will stop in breakpoints set in the test files
- You can use Web Console Inspector in Protractor's Chrome instance to figure out state of the forms and buttons for the e2e tests

What does not work

- `node --inspect-brk node_modules/.bin/ng`: For some reason breakpoints get ignored if `ng e2e` is run directly
- Running Protractor without starting a frontend manually: `ng e2e` is responsible for doing Angular setup

## Migrations

### Automatically generating migrations

You can generate migration files

1) After updating entity source code

2) You have an up-to-date local development database

```bash

# Rebuild transpilation
npm run build

# You need to start and stop the dev server to generate dist/migrations
# NestJS bug https://github.com/nrwl/nx/issues/1393
npm run start

# Create a file under migration/
npm run migration:generate -- -n CreateUsers
```

## Run migrations against a local db

```bash
npm run migration:run
```

Check the result of migrations - new tables should be now in the database
```bash
docker exec -it local_db psql -U local_dev -c "\dt" local_db
```

# Further reading

[NestJS and TypeORM migration example](https://github.com/ambroiseRabier/typeorm-nestjs-migration-example)

[NestJS and TypeORM in 30 minutes](https://blog.theodo.com/2019/05/an-overview-of-nestjs-typeorm-release-your-first-application-in-less-than-30-minutes/)

[Another NestJS and TypeORM tutorial](https://blog.echobind.com/up-and-running-nextjs-and-typeorm-2c4dff5d7250)

[PostgreSQL on Dockerhub](https://hub.docker.com/_/postgres)

[class-validator](https://github.com/typestack/class-validator)

[Cats NestJS + Swagger sample full example code](https://github.com/nestjs/nest/tree/master/sample/11-swagger)

[Testing database interaction with TypeORM](https://medium.com/@salmon.3e/integration-testing-with-nestjs-and-typeorm-2ac3f77e7628) and [related source code](https://github.com/p-salmon/nestjs-typeorm-integration-tests)

# Artwork

Photo by JESHOOTS.COM on Unsplash.


