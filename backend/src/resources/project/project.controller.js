import db from '../../db';
import tableNames from '../../constants/tableNames';

const getProjects = async (req, res) => {
  const results = await db.select('*').from(tableNames.project).limit(100);

  res.status(200).json({ projects: results });
};

const createProject = async (req, res) => {
  // TODO: secure this route
  // TODO: validate req.body
  const newProject = await db(tableNames.project).insert(req.body);

  res.status(200).json({ project: newProject });
};

export { getProjects, createProject };
