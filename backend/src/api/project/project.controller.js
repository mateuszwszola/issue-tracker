import { Project } from './project.model';
import { getProjectGraphQuery } from '../../utils/project';
import { User } from '../user/user.model';

const getProjects = async (req, res) => {
  const {
    skip,
    limit,
    orderBy,
    withGraph,
    search,
    engineer_id,
    manager_id,
  } = req.query;

  let query = Project.query();

  if (engineer_id) {
    query = User.relatedQuery('engineeredProjects').for(engineer_id);
  }

  query.offset(skip).limit(limit).where('archived_at', null).orderBy(orderBy);

  if (search) {
    query.modify('search', search);
  }

  if (manager_id) {
    query.where('manager_id', manager_id);
  }

  if (withGraph) {
    getProjectGraphQuery(query, withGraph);
  }

  return res.status(200).json({ projects: await query });
};

const createProject = async (req, res) => {
  const { id: createdById } = req.api_user;
  const projectData = { ...req.body, created_by: createdById };

  const project = await Project.query().insert(projectData).returning('*');

  return res.status(201).json({ project });
};

const getProject = async (req, res) => {
  const { id: projectId } = req.project;
  const { withGraph } = req.query;

  let project;

  if (withGraph) {
    const query = Project.query().findById(projectId);
    getProjectGraphQuery(query, withGraph);
    project = await query;
  } else {
    project = req.project;
  }

  return res.status(200).json({ project });
};

const updateProject = async (req, res) => {
  const { id: projectId } = req.project;
  const newProjectData = { ...req.body };

  const project = await Project.query()
    .findById(projectId)
    .patch(newProjectData)
    .returning('*');

  return res.status(200).json({ project });
};

const deleteProject = async (req, res) => {
  const { id: projectId } = req.project;

  const project = await Project.query()
    .findById(projectId)
    .delete()
    .returning('*');

  return res.status(200).json({ project });
};

export { getProjects, getProject, createProject, updateProject, deleteProject };
