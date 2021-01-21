import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { Project } from '../api/project/project.model';
import config from '../config';
import { ErrorHandler } from '../utils/error';
import { preloadApiUser } from './user';
import { ROLES } from '../constants/roles';

const checkJwt = jwt({
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

const authenticate = () => [checkJwt, preloadApiUser()];

const authorize = (...permittedRoles) => (req, res, next) => {
  const { api_user } = req;

  if (api_user && api_user.role && permittedRoles.includes(api_user.role)) {
    next();
  } else {
    next(
      new ErrorHandler(403, 'You are not authorized to access this resource')
    );
  }
};

const checkAdmin = () => (req, res, next) => {
  const { api_user } = req;

  if (api_user && api_user.is_admin) {
    api_user.role = ROLES.admin;
  }

  next();
};

const checkProjectEngineer = () => async (req, res, next) => {
  const { api_user, project } = req;

  if (api_user && project) {
    const engineer = await Project.relatedQuery('engineers')
      .for(project.id)
      .findById(api_user.id);

    if (engineer) {
      api_user.role = ROLES.project_engineer;
    }
  }

  next();
};

const checkProjectManager = () => (req, res, next) => {
  const { api_user, project } = req;

  if (api_user && project && project.manager_id === api_user.id) {
    api_user.role = ROLES.project_manager;
  }

  next();
};

export {
  checkJwt,
  authenticate,
  authorize,
  checkAdmin,
  checkProjectManager,
  checkProjectEngineer,
};
