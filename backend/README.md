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
  - Auth0 will handle user authentication
  - when user logins or signs up, created Auth0 rule will check if the api_user_id property exists on the user metadata object
    - if it exists it will be added as a claim to the access_token and proceeded 
    - if not the rule will call this api sending auth0_user_id along with some basic user information - name, email, picture, and user will be created, and api will send back local db user_id

## Role & Permissions Requirements:
- admin:
  everyting but these are the permissions specific to admin:
    - user and role management
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

That way the role entity is not needed, because a user permissions can vary per project.
But we need to know who is the admin so user has is_admin property in the database.
