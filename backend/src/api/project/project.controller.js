import { Project } from './project.model';
import { isEmpty } from 'lodash';
import { ErrorHandler } from '../../utils/error';

const getProjects = async (req, res) => {
  const { cursor = 0, limit = 100, eager } = req.query;

  const results = await Project.query()
    .allowGraph('[type, owner, manager]')
    .withGraphFetched(eager)
    .modifyGraph('type', (builder) => {
      builder.select('id', 'name');
    })
    .modifyGraph('[owner, manager]', (builder) => {
      builder.select('id', 'auth0_user_id', 'name', 'email', 'picture');
    })
    .where('archived_at', null)
    .offset(+cursor)
    .limit(+limit);

  return res.status(200).json({ projects: results });
};

const getProject = async (req, res) => {
  const { id, eager } = req.params;

  const result = await Project.query()
    .findById(id)
    .allowGraph('[type, owner, manager]')
    .withGraphFetched(eager)
    .modifyGraph('type', (builder) => {
      builder.select('id', 'name');
    })
    .modifyGraph('[owner, manager]', (builder) => {
      builder.select('id', 'auth0_user_id', 'name', 'email', 'picture');
    })
    .where('archived_at', null);

  if (isEmpty(result)) {
    throw new ErrorHandler(404, 'Project not found');
  }

  return res.status(200).json({ project: result });
};

const createProject = async (req, res) => {
  const result = await Project.query().insert(req.body).returning('*');

  return res.status(201).json({ project: result });
};

const updateProject = async (req, res) => {
  const { id } = req.params;

  const result = await Project.query()
    .update(req.body)
    .where('id', id)
    .returning('*');

  return res.status(200).json({ project: result });
};

const deleteProject = async (req, res) => {
  // TODO: check if user is an Admin
  const { id } = req.params;

  const result = await Project.query().delete().where('id', id).returning('*');

  return res.status(200).json({ project: result });
};

export { getProjects, getProject, createProject, updateProject, deleteProject };
