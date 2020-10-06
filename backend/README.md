## Model a SQL database

Entities:

- [x] User
- [x] Role
- [x] Ticket
- [x] Sub Ticket
- [x] Ticket Type (bug, task, feature_request, epic)
- [x] Ticket Status (to do, in progress, under review, done)
- [x] Project
- [x] Project Type (software)
- [x] Project State (active, archived)
- [x] Goal
- [x] Comment
- [x] Epic
- [x] Sprint
- [x] Attachment

- [] Pages (project docs in, maybe in markdown)
- [] Notification

Every record will have:
  - Created At
  - Updated At

We can implement soft delete instead of actual delete, that way we will archive the records instead of completely deleting it.
In case of deleting things, we can run into the issue where we will also be deleting related records, and we may don't want that.

