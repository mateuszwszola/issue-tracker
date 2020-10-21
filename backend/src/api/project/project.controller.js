import db from '../../db';
import tableNames from '../../constants/tableNames';
import { Project } from './project.model';

const getProjects = async (req, res) => {
  // const results = await db
  //   .select(['Project.*', 'Project_status.name as status'])
  //   .from('Project')
  //   .leftJoin('Project_status', 'Project.status_id', 'Project_status.id');

  const results = await Project.query().joinRelated('statusId');

  res.status(200).json({ projects: results });
};

const createProject = async (req, res) => {
  // TODO: secure this route
  // TODO: validate req.body
  const result = await db
    .insert(req.body)
    .into(tableNames.project)
    .returning('*');

  res.status(200).json({ project: result });
};

export { getProjects, createProject };
