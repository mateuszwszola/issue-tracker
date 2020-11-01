import * as faker from 'faker';

const getUserData = (ctx = {}) => ({
  sub: ctx.sub || null,
  name: ctx.name || faker.name.findName(),
  email: ctx.email || faker.internet.email(),
  picture: ctx.picture || faker.image.avatar(),
  is_admin: !!ctx.isAdmin,
  blocked: !!ctx.blocked,
});

const getProjectData = (ctx = {}) => ({
  key: ctx.key || faker.random.alphaNumeric(5),
  name: ctx.name || faker.name.findName(),
  type_id: ctx.typeId || 1,
  manager_id: ctx.managerId || null,
  archived_at: ctx.archivedAt || null,
});

const getTicketData = (ctx = {}) => ({
  project_id: ctx.projectId || 1,
  key: ctx.key || faker.random.alphaNumeric(5),
  name: ctx.name || faker.name.findName(),
  description: ctx.description || faker.random.words(100),
  parent_id: ctx.parentId || null,
  type_id: ctx.typeId || 1,
  status_id: ctx.statusId || 1,
  priority_id: ctx.priorityId || 1,
  reporter_id: ctx.reporterId || 1,
  archived_at: ctx.archivedAt || null,
});

export { getUserData, getProjectData, getTicketData };
