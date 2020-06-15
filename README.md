# Introduction

This is a software development exercise for a FirstBlood Technologies full stack developer position.

- [See the open position description on StackOverflow](https://stackoverflow.com/jobs/393512/typescript-full-stack-developer-firstblood)

- [Read more about our hiring process](https://github.com/miohtama/how-to-hire-developers)

- [See stats of the previous hiring round](https://www.linkedin.com/pulse/experiences-hiring-remote-flutter-developers-mikko-ohtamaa/?trackingId=iUNtzRWoSsq9xX4Jq%2BMkRA%3D%3D)

# Exercise

## Your task

Your task is to create a registration form for Angular 9 + NestJS application. We estimate this will take 3-4 hours for a person who is familiar with the technology stack. The stack is the same that you would be using in your work.

- Add a registration screen to an existing Angular application skeleton

- Server-side entity and validation for the registration data using NestJS backend

- PostgreSQL migrations for all of the above
  - Must be applied on the existing database with existing records,
    so understand this when designing null keys and unique value constrains

- End-to-end tests that exercises both frontend and backend
  - Registrating user and confirming the the registration via sent confirmation link success
  - Registrating user and confirming the the registration via sent confirmation fails due to a link timeout
  - Cannot register same email twice
  - Cannot register invalid email
  - Cannot register with invalid password - see repo for the valid password rules

- Pull request which will be reviewed
  - Contains screenshots detailing the changes
  - Contains migration instructions
  - Contains instructions for an internal QA team how to manually test the application,
    assuming they can run the application locally on their PC

## How to submit the exercise

- [ ] Create a private copy of this Github repository
- [ ] Complete the task above
- [ ] Create a new pull request against your private repository
- [ ] In the PR, write down number of hours you spent on this exercise (we do not use this to rank you, we use it to adjust the laborisity of future exercises)
- [ ] Invite a Github user `miohtama` to your repository
- [ ] Send email to `dev-careers@fb.io` that you have completed the exercise

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
( cd backend && npm run start )
```

Swagger UI is available at http://localhost:3000/api/ to directly test API calls against the backend.

## Running tests

TODO

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


