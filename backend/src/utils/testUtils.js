import * as faker from 'faker';

const createProjectFactory = (ctx = {}) => ({
  key: ctx.key || faker.random.alphaNumeric(5),
  name: ctx.name || faker.name.findName(),
  type_id: ctx.typeId || 1,
  manager_id: ctx.managerId || 1,
});

export { createProjectFactory };
