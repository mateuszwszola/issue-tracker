# Issue Tracker

Application to track the project work

## Server Setup

- Install Dependencies: `npm install`
- Run Postgresql database with Adminer (db client): `docker-compose up`
- Migrate the databse: `npm run migrate`
- Rollback migration: `npm run rollback`
- Seed the database: `npm run seed`
