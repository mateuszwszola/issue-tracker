## Model a SQL database

Entities:

- [x] User
- [x] Project
- [x] Project Type (software)
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

  - every user has a role in the app
  - and every role has its set of permissions
  - some actions requires permissions to perform them
  - admin will be interacting with Auth0 to manage users and roles through the dashboard
  - the app will store user information - auth0_user_id, email, name, avatar, but the auth0 will handle authentication and authorization
    - why store user data also in the local db? To be able to display it on the frontend without the need to also call auth0 api
  - auth0 has additional information about users
  - when user sign in / sign up auth0 rule will call this API, and the API will store / update user info along with auth0 user id