import * as faker from 'faker';

const getUserData = (ctx = {}) => ({
  sub: ctx.sub || `auth0|${faker.random.uuid()}`,
  name: ctx.name || faker.name.findName(),
  email: ctx.email || faker.internet.email(),
  picture: ctx.picture || faker.image.avatar(),
  is_admin: !!ctx.isAdmin,
  blocked: !!ctx.blocked,
});

const getProjectData = (ctx = {}) => ({
  name: ctx.name || faker.company.companyName(),
  type_id: ctx.typeId || 1,
  manager_id: ctx.managerId || null,
  creator_id: ctx.creatorId || 1,
});

const getTicketData = (ctx = {}) => ({
  project_id: ctx.projectId || null,
  name: ctx.name || faker.lorem.words(5),
  description: ctx.description || faker.lorem.sentences(3),
  parent_id: ctx.parentId || null,
  type_id: ctx.typeId || 1,
  status_id: ctx.statusId || 1,
  priority_id: ctx.priorityId || 1,
  reporter_id: ctx.reporterId || null,
  assignee_id: ctx.assigneeId || null,
});

export { getUserData, getProjectData, getTicketData };
