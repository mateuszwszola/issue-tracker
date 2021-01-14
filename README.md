# MW Issue Tracker

Application to track the project work and collaborate with the team

## Server Setup

```bash
  $ cd backend
```

- Install dependencies: `npm install`
- Run PostgreSQL database with Adminer (db client): `docker-compose up`
- Migrate the database: `npm run migrate`
- Seed the database: `npm run seed`

If you need to rollback the migration:

- Rollback migration: `npm run rollback`

## Running tests

To test the API endpoints with Jest, run `npm test`
