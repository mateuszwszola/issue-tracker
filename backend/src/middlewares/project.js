import { Project } from '../api/project/project.model';
import { ErrorHandler } from '../utils/error';

const preloadProject = (required = true) => async (req, res, next) => {
  const { projectId: projectIdParam } = req.params;
  const { projectId: projectIdQuery } = req.query;

  const projectId = projectIdParam || projectIdQuery;

  if (!projectId && required) {
    return next(new ErrorHandler(400, 'Project id is required'));
  }

  let project;

  if (projectId) {
    project = await Project.query().findById(projectId);
  }

  if (!project && required) {
    return next(
      new ErrorHandler(404, `Project with ${projectId} id not found`)
    );
  }

  if (project) {
    req.project = project;
  }

  next();
};

export { preloadProject };