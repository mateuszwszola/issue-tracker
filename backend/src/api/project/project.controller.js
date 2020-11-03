import { Project } from './project.model';
import { isEmpty } from 'lodash';
import { ErrorHandler } from '../../utils/error';
import { pickExistingProperties } from '../../utils/helpers';
import {
  getDefaultProjectGraphQuery,
  validProjectOrders,
} from '../../utils/project';

const getProjects = async (req, res) => {
  let { cursor, limit, select, withGraph, orderBy = 'id' } = req.query;

  cursor = cursor ? Number(cursor) : 0;
  limit = cursor ? Number(limit) : 100;
  orderBy = orderBy ?? orderBy.toLowerCase();

  if (!validProjectOrders.has(orderBy)) {
    throw new ErrorHandler(400, 'Invalid orderBy param');
  }

  const query = Project.query()
    .offset(cursor)
    .limit(limit)
    .where('archived_at', null)
    .orderBy(orderBy);

  if (select) {
    query.select(select);
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
  const { name, type_id, manager_id } = req.body;

  const result = await Project.query()
    .insert({ name, type_id, manager_id })
    .returning('*');

  return res.status(201).json({ project: result });
};

const updateProject = async (req, res) => {
  const { projectId } = req.params;

  const newProjectData = pickExistingProperties(
    ['name', 'type_id', 'manager_id'],
    req.body
  );

  const result = await Project.query()
    .findById(projectId)
    .patch(newProjectData)
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
