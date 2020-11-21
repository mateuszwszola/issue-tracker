import { Project } from './project.model';
import { ErrorHandler } from '../../utils/error';
import { getProjectGraphQuery } from '../../utils/project';

const getProjects = async (req, res) => {
  const { skip, limit, orderBy = 'id', withGraph } = req.query;

  const query = Project.query()
    .offset(skip)
    .limit(limit)
    .where('archived_at', null)
    .orderBy(orderBy);

  if (withGraph) {
    getProjectGraphQuery(query, withGraph);
  }

  const projects = await query;

  return res.status(200).json({ projects });
};

const createProject = async (req, res) => {
  const createdBy = req.api_user.id;
  const projectData = { ...req.body, created_by: createdBy };

  const project = await Project.query().insert(projectData).returning('*');

  return res.status(201).json({ project });
};

const getProject = async (req, res) => {
  const { projectId } = req.params;
  const { withGraph } = req.query;

  const query = Project.query().findById(projectId);

  if (withGraph) {
    getProjectGraphQuery(query, withGraph);
  }

  const project = await query;

  if (!project) {
    throw new ErrorHandler(404, 'Project not found');
  }

  return res.status(200).json({ project });
};

const updateProject = async (req, res) => {
  const { projectId } = req.params;
  const newProjectData = { ...req.body };

  const project = await Project.query()
    .findById(projectId)
    .patch(newProjectData)
    .returning('*');

  return res.status(200).json({ project });
};

const deleteProject = async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.query()
    .findById(projectId)
    .delete()
    .returning('*');

  return res.status(200).json({ project });
};

export { getProjects, getProject, createProject, updateProject, deleteProject };
