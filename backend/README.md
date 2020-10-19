## Model a SQL database

Entities:

- [x] User
- [x] Role
- [x] Project
- [x] Project Type (software)
- [x] Project Status (active, archived)
- [x] Project Engineer
- [x] Ticket
- [x] Sub Ticket
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

Entities like Project and Ticket will also have deleted_at column (archive)

## Authentication Requirements:

  - every user has a role in the app
  - and every role has its set of permissions
  - some actions requires permissions to perform them
  - the app will store user information - email, name, avatar, etc...
    - to be able to query users and data by specific fields
    - and display them with resource without the need to call auth0 api

- user and role management can be done with auth0
  - I can interact with auth0 to manage users
  - auth0 has additional information about users
- when user sign in / sign up I will talk to my API and store / update user info and map local database user id with auth0 user id
  - then, I will include local db userId in access token so I can then easily do lookups on the backend
  - I can modify the access token to put a user role to it after talking to my api server

  - Auth0 will manage users and roles
  - Generated access_token can contain local db user id and role