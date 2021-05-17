## Model a SQL database

Entities:

- [x] User
- [x] Project
- [x] Project Type (software, ...)
- [x] Project Engineer
- [x] Ticket
- [x] Ticket Type (bug, task, feature, ...)
- [x] Ticket Status (open, closed, in progress, fixed, ...)
- [x] Ticket Priority
- [x] Ticket Comment
- [x] Epic
- [x] Epic Ticket
- [x] Sprint
- [x] Sprint Ticket
- [x] Goal
- [x] Attachment

- [ ] Pages (project docs, maybe in a markdown)
- [ ] Notification

Every record has these fields:

- Created At
- Updated At

## Authentication:

- Auth0 is used for authentication
- when user logins or signs up with Auth0 on the frontend it will call `/api/login` endpoint sending access_token, then
  the backend will check if the user with specific sub exists
  - if exists, it will simply respond with a user
  - if not exists, the backend will call Auth0 asking for profile information and will create and then respond with a
    new user

## Roles & Permissions:

- Admin:
  - manage projects
- Project Manager:
  - manage project engineers
- Project Engineer
  - work on tickets
- Authenticated User
  - submit tickets
  - add comments
