export const PROJECT_TYPES = {
  active: 'Active',
  archived: 'Archived',
};

export default Object.values(PROJECT_TYPES).map((name) => ({
  name,
}));
