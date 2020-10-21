import { Project } from './project.model';

const getProjects = async (req, res) => {
  const results = await Project.query().limit(100);

  res.status(200).json({ projects: results });
};

const createProject = async (req, res) => {
  // TODO: secure this route
  // TODO: validate req.body
  const insertedGraph = await Project.transaction(async (trx) => {
    const insertedGraph = Project.query(trx)
      .allowGraph('[owner, manager, type, status]')
      .insertGraph(req.body);

    return insertedGraph;
  });

  res.status(200).json({ project: insertedGraph });
};

export { getProjects, createProject };
