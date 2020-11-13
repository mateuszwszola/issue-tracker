import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { Project } from '../api/project/project.model';
import { User } from '../api/user/user.model';
import config from '../config';
import { ErrorHandler } from '../utils/error';

const checkJwt = () =>
  jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${config.auth0.issuer}.well-known/jwks.json`,
    }),

    // Validate the audience and the issuer.
    audience: config.auth0.audience,
    issuer: config.auth0.issuer,
    algorithms: ['RS256'],
  });

const preloadApiUser = () => async (req, res, next) => {
  const { sub } = req.user;

  const user = await User.query().findOne({ sub });

  req.api_user = user;

  next();
};

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

const isAdmin = () => {
  return [
    preloadApiUser(),
    async (req, res, next) => {
      if (!(req.api_user && req.api_user.is_admin)) {
        return next(
          new ErrorHandler(
            403,
            'You do not have access rights to access the resource'
          )
        );
      }

      next();
    },
  ];
};

const isProjectManager = () => {
  return [
    preloadApiUser(),
    preloadProject(),
    (req, res, next) => {
      const isAdmin = req.api_user && req.api_user.is_admin;
      const isProjectManager =
        req.api_user.id &&
        req.project.manager_id &&
        req.api_user.id === req.project.manager_id;

      if (!(isAdmin || isProjectManager)) {
        return next(new ErrorHandler(403, 'Unauthorized'));
      }

      next();
    },
  ];
};

const isProjectEngineer = () => {
  return [
    preloadApiUser(),
    preloadProject(),
    async (req, res, next) => {
      const isAdmin = req.api_user && req.api_user.is_admin;
      const isProjectManager =
        req.api_user.id &&
        req.project.manager_id &&
        req.api_user.id === req.project.manager_id;

      if (isAdmin || isProjectManager) {
        return next();
      }

      const engineer = await Project.relatedQuery('engineers')
        .for(req.project.id)
        .findById(req.api_user.id);

      if (!engineer) {
        throw new ErrorHandler(
          403,
          'You are not authorized to access this resource'
        );
      }

      next();
    },
  ];
};

export {
  checkJwt,
  preloadApiUser,
  preloadProject,
  isAdmin,
  isProjectManager,
  isProjectEngineer,
};
