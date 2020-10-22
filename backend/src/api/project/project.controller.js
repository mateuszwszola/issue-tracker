import { Project } from './project.model';

const getProjects = async (req, res) => {
  const results = await Project.query()
    .allowGraph('[type, owner, manager]')
    .where('archived_at', null)
    .limit(100)
    .withGraphFetched(req.query.eager)
    .modifyGraph('type', (builder) => {
      builder.select('id', 'name');
    })
    .modifyGraph('[owner, manager]', (builder) => {
      builder.select('auth0_user_id', 'name', 'email', 'avatar_url');
    })
    .debug();

  res.status(200).json({ projects: results });
};

const createProject = async (req, res) => {
  // TODO: validate req.body
  const insertedGraph = await Project.transaction(async (trx) => {
    const insertedGraph = Project.query(trx)
      .allowGraph('[owner, manager, type]')
      .insertGraph(req.body);

    return insertedGraph;
  });

  res.status(200).json({ project: insertedGraph });
};

export { getProjects, createProject };
