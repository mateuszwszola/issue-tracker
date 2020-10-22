const PROJECT_TYPES = {
  software: 'Software',
};

const projectTypes = Object.values(PROJECT_TYPES).map((name) => ({
  name,
}));

export { PROJECT_TYPES, projectTypes };
