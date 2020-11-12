function createProjectKey(projectName, projectId) {
  let key = '';
  let acronym = projectName
    .match(/\b(\w)/g)
    .join('')
    .substr(0, 2);

  if (acronym.length < 2) {
    acronym = projectName.substr(0, 2);
  }
  key = acronym.toUpperCase() + projectId;
  return key;
}

function getDefaultProjectGraphQuery(query, withGraph) {
  return query
    .allowGraph('[type, manager, engineers]')
    .withGraphFetched(withGraph)
    .modifyGraph('type', (builder) => {
      builder.select('id', 'name');
    })
    .modifyGraph('manager', (builder) => {
      builder.select('id', 'sub', 'name', 'email', 'picture');
    });
}

const validProjectOrders = new Set([
  'id',
  'key',
  'name',
  'type_id',
  'manager_id',
  'created_at',
  'updated_at',
]);

export { createProjectKey, getDefaultProjectGraphQuery, validProjectOrders };
