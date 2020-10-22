import { Project } from './project.model';

const getProjects = async (req, res) => {
  const { cursor = 0, limit = 100, eager } = req.query;

  const results = await Project.query()
    .allowGraph('[type, owner, manager]')
    .where('archived_at', null)
    .offset(+cursor)
    .limit(+limit)
    .withGraphFetched(eager)
    .modifyGraph('type', (builder) => {
      builder.select('id', 'name');
    })
    .modifyGraph('[owner, manager]', (builder) => {
      builder.select('auth0_user_id', 'name', 'email', 'avatar_url');
    })
    .debug();

  return res.status(200).json({ projects: results });
};

const getProject = async (req, res) => {
  const { id } = req.params;

  const result = await Project.query().findById(id);

  return res.status(200).json({ project: result });
};

const createProject = async (req, res) => {
  // TODO: validate req.body
  const insertedGraph = await Project.transaction(async (trx) => {
    const insertedGraph = Project.query(trx)
      .allowGraph('[owner, manager, type]')
      .insertGraph(req.body);

    return insertedGraph;
  });

  return res.status(201).json({ project: insertedGraph });
};

const updateProject = async (req, res) => {
  const { id } = req.body;

  const result = await Project.query()
    .patch(req.body)
    .where('id', id)
    .returning('*');

  return res.status(200).json({ project: result });
};

const deleteProject = async (req, res, next) => {
  // TODO: check if user is an Admin
  const { id } = req.body;

  const result = await Project.query().delete().where('id', id).returning('*');

  return res.status(200).json({ project: result });
};

export { getProjects, getProject, createProject, updateProject, deleteProject };
