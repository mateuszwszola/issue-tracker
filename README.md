# MW Issue Tracker

Application to track projects, tasks and collaborate with the team.

![dashboard](https://github.com/mateuszwszola/issue-tracker/blob/master/assets/admin-dashboard.png?raw=true)

## Tech Stack

- Frontend
    - Next.js / React.js
    - Chakra UI
- Backend
    - Node.js / Express.js
    - PostgreSQL
- Login
    - Auth0
- Images storage
    - AWS S3
    
## Database Entities Diagram

![DB diagram](https://github.com/mateuszwszola/issue-tracker/blob/master/assets/db-diagram.png?raw=true)

## Running Locally

### Server

```shell
$ cd backend
```

- Copy the [backend/.env.sample](backend/.env.sample) file to `backend/.env` and update the values
- Install dependencies: `npm install`
- Run PostgreSQL along with Adminer (DB client) and a test database: `docker-compose up`
- Migrate a database: `npm run db:migrate`
- Seed a database: `npm run db:seed`

To rollback migration, run:

```shell
$ npm run db:rollback
```

### Client

```shell
$ cd frontend
```

- Copy the [frontend/.env](frontend/.env) file to `frontend/.env.local` and update the values
- Install dependencies: `npm install`


## Running tests

To test the API endpoints with Jest, run `npm test` within backend folder
