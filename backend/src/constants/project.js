const PROJECT_TYPES = {
  software: 'Software',
};

const PROJECT_STATUSES = {
  active: 'Active',
  archived: 'Archived',
};

const projectTypes = Object.values(PROJECT_TYPES).map((name) => ({
  name,
}));

const projectStatuses = Object.values(PROJECT_STATUSES).map((name) => ({
  name,
}));

export { PROJECT_TYPES, PROJECT_STATUSES, projectTypes, projectStatuses };
