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

