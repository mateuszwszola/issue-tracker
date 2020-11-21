import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { Project } from '../api/project/project.model';
import config from '../config';
import { ErrorHandler } from '../utils/error';
import { preloadApiUser } from './user';
import { preloadProject } from './project';
import { ROLES } from '../constants/roles';

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

const isAdmin = () => {
  return [
    checkJwt(),
    preloadApiUser(),
    async (req, res, next) => {
      if (!req.api_user.is_admin) {
        throw new ErrorHandler(
          403,
          'You do not have the access rights to access the resource'
        );
      }
      req.api_user.roles = req.api_user.roles || [];

      if (!req.api_user.roles.includes(ROLES.admin)) {
        req.api_user.roles = [...req.api_user.roles, ROLES.admin];
      }

      next();
    },
  ];
};

const isProjectManager = () => {
  return [
    checkJwt(),
    preloadApiUser(),
    preloadProject(),
    (req, res, next) => {
      const isAdmin = req.api_user && req.api_user.is_admin;
      const isProjectManager =
        req.api_user.id &&
        req.project.manager_id &&
        req.api_user.id === req.project.manager_id;

      req.api_user.roles = req.api_user.roles || [];

      if (isAdmin && !req.api_user.roles.includes(ROLES.admin)) {
        req.api_user.roles = [...req.api_user.roles, ROLES.admin];
      }

      if (
        isProjectManager &&
        !req.api_user.roles.includes(ROLES.project_manager)
      ) {
        req.api_user.roles = [...req.api_user.roles, ROLES.project_manager];
      }

      if (!(isAdmin || isProjectManager)) {
        return next(new ErrorHandler(403, 'Unauthorized'));
      }

      next();
    },
  ];
};

const isProjectEngineer = () => {
  return [
    checkJwt(),
    preloadApiUser(),
    preloadProject(),
    async (req, res, next) => {
      const isAdmin = req.api_user && req.api_user.is_admin;
      const isProjectManager =
        req.api_user.id &&
        req.project.manager_id &&
        req.api_user.id === req.project.manager_id;

      req.api_user.roles = req.api_user.roles || [];

      if (isAdmin && !req.api_user.roles.includes(ROLES.admin)) {
        req.api_user.roles = [...req.api_user.roles, ROLES.admin];
      }

      if (
        isProjectManager &&
        !req.api_user.roles.includes(ROLES.project_manager)
      ) {
        req.api_user.roles = [...req.api_user.roles, ROLES.project_manager];
      }

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

      if (!req.api_user.roles.includes(ROLES.project_engineer)) {
        req.api_user.roles = [...req.api_user.roles, ROLES.project_engineer];
      }

      next();
    },
  ];
};

export { checkJwt, isAdmin, isProjectManager, isProjectEngineer };
