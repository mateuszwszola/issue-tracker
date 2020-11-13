import { Project } from '../api/project/project.model';
import { ErrorHandler } from '../utils/error';

const preloadProject = () => async (req, res, next) => {
  const projectId =
    req.params.projectId || req.query.projectId || req.body.projectId;

  if (!projectId) {
    return next(new ErrorHandler(400, 'Project id is required'));
  }

  const project = await Project.query().findById(projectId);

  if (!project) {
    return next(
      new ErrorHandler(404, `Project with ${projectId} id not found`)
    );
  }

  req.project = project;

  next();
};

export { preloadProject };
