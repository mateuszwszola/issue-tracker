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
  - Auth0 will handle user authentication
  - when user logins or signs up with Auth0 on the frontend it will call `/api/v1/login` endpoint sending access_token, then the backend will check if the user with specific sub exists
    - if exists, it will simply respond with a user
    - if not exists, the backend will call Auth0 asking for profile information and will create and then respond with a new user

## Roles & Permissions:
- Admin:
    - users and roles management
    - assigns project manager
- Project Manager:
    - manage a project
    - add and remove project engineers
- Project Engineer
    - work on the tickets
- User
  - manage their own profile

API's endpoints authorization will rely on checking if:
  - user is an admin
  - user is a manager of a project
  - user is engineer within a project
  