import { Project } from '../api/project/project.model';
import { ErrorHandler } from '../utils/error';

const preloadProject = ({ projectId }) => async (req, res, next) => {
  try {
    if (!projectId) {
      return next(new ErrorHandler(422, 'Project id is required'));
    }

    const project = await Project.query().findById(projectId);

    if (!project) {
      return next(
        new ErrorHandler(404, `Project with ${projectId} id not found`)
      );
    }

    req.project = project;
    next();
  } catch (err) {
    next(new ErrorHandler(404, `Project with ${projectId} id not found`));
  }
};

export { preloadProject };
