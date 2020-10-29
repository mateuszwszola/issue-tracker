import { Project } from './project.model';
import { isEmpty } from 'lodash';
import { ErrorHandler } from '../../utils/error';

function getDefaultProjectGraphQuery(query, withGraph) {
  return query
    .allowGraph('[type, manager]')
    .withGraphFetched(withGraph)
    .modifyGraph('type', (builder) => {
      builder.select('id', 'name');
    })
    .modifyGraph('manager', (builder) => {
      builder.select('id', 'auth0_user_id', 'name', 'email', 'picture');
    });
}

const getProjects = async (req, res) => {
  const {
    cursor = 0,
    limit = 100,
    select,
    status,
    withGraph,
    orderBy,
  } = req.query;

  const query = Project.query().offset(parseInt(cursor)).limit(parseInt(limit));

  if (select) {
    query.select(select);
  }

  if (status) {
    if (status === 'archived') {
      query.whereNotNull('archived_at');
    } else {
      query.where('archived_at', null);
    }
  }

  if (orderBy) {
    query.orderBy(orderBy);
  }

  if (withGraph) {
    getDefaultProjectGraphQuery(query, withGraph);
  }

  return res.status(200).json({ projects: await query });
};

const getProject = async (req, res) => {
  const { projectId } = req.params;
  const { select, withGraph } = req.query;

  const query = Project.query().findById(projectId);

  if (select) {
    query.select(select);
  }

  if (withGraph) {
    getDefaultProjectGraphQuery(query, withGraph);
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
  const { projectId } = req.params;

  const result = await Project.query()
    .findById(projectId)
    .patch(req.body)
    .returning('*');

  return res.status(200).json({ project: result });
};

const deleteProject = async (req, res) => {
  const { projectId } = req.params;

  const result = await Project.query()
    .findById(projectId)
    .delete()
    .returning('*');

  return res.status(200).json({ project: result });
};

export { getProjects, getProject, createProject, updateProject, deleteProject };
