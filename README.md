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

## Creating the initial database

You need to have the backend installed

```bash
( cd backend && npm install )
```

Run initial migrations to set up initial database tables

```bash
( cd backend && npm run migration:run )
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

## Running tests

# Further reading

# Artwork

Photo by JESHOOTS.COM on Unsplash.


