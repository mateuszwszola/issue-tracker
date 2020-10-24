import { Project } from './project.model';
import { isEmpty } from 'lodash';
import { ErrorHandler } from '../../utils/error';

function defaultProjectWithGraphQuery(query, withGraph) {
  return query
    .allowGraph('[type, owner, manager]')
    .withGraphFetched(withGraph)
    .modifyGraph('type', (builder) => {
      builder.select('id', 'name');
    })
    .modifyGraph('[owner, manager]', (builder) => {
      builder.select('id', 'auth0_user_id', 'name', 'email', 'picture');
    });
}

const getProjects = async (req, res) => {
  const { cursor = 0, limit = 100, select, status, withGraph } = req.query;

  const query = Project.query()
    .offset(+cursor)
    .limit(+limit);

  if (status) {
    if (status === 'archived') {
      query.whereNotNull('archived_at');
    } else if (status === 'active') {
      query.where('archived_at', null);
    }
  }

  if (select) {
    query.select(select);
  }

  if (withGraph) {
    defaultProjectWithGraphQuery(query, withGraph);
  }

  return res.status(200).json({ projects: await query });
};

const getProject = async (req, res) => {
  const { id } = req.params;
  const { select, withGraph, status } = req.query;

  const query = Project.query().findById(id);

  if (select) {
    query.select(select);
  }

  if (status && status === 'active') {
    query.where('archived_at', null);
  }

  if (withGraph) {
    defaultProjectWithGraphQuery(query, withGraph);
  }

  const result = await query;

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
    .findById(id)
    .patch(req.body)
    .returning('*');

  return res.status(200).json({ project: result });
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  const result = await Project.query().findById(id).delete().returning('*');

  return res.status(200).json({ project: result });
};

export { getProjects, getProject, createProject, updateProject, deleteProject };
