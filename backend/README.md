## Model a SQL database

Entities:

- [x] User
- [x] Project
- [x] Project Type (software, ...)
- [x] Project Engineer
- [x] Ticket
- [x] Ticket Type (bug, task, feature_request, epic)
- [x] Ticket Status (to do, in progress, under review, done)
- [x] Ticket Priority
- [x] Ticket Comment
- [x] Ticket Engineer
- [x] Epic
- [x] Epic Ticket
- [x] Sprint
- [x] Sprint Ticket
- [x] Goal
- [x] Attachment

- [ ] Pages (project docs, maybe in markdown)
- [ ] Notification

Every record will have:
  - Created At
  - Updated At

- Project entity will have archived_at column (in this case we will do soft delete)

## Authentication Requirements:

  - the app will store some user information like auth0_user_id, email, name, avatar, but the auth0 will handle authentication
  - when user sign in / sign up, created Auth0 rule will call this API, and the user info along with auth0 user id will be stored / updated in the local db.
  
## Role & Permissions Requirements:
- admin:
  everyting but these are the permissions specific to admin:
    - manage projects
    - assign project manager
- project manager:
  - add project engineers
  - add ticket engineers
  - manage tickets, epics, sprints
  ...engineer permissions
- engineer
  - change ticket status
  - submit new tickets
  ...user permissions
- user
  - just manage their own profile and wait till manager add them to a project to be able to colaborate

API routes authorization will rely on checking if:
  - user is an admin
  - user is a manager of a project
  - user is engineer within a project

That way the role entity is not needed, because a user role depends on a project.
But of course we need to know who is the admin so I added the column named is_admin in user table.
