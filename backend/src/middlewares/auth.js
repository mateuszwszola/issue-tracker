import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { isEmpty } from 'lodash';
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

const isAdmin = () => async (req, res, next) => {
  const { sub } = req.user;

  const user = await User.query().findOne({ sub });

  if (!(user && user.is_admin)) {
    return next(
      new ErrorHandler(
        403,
        'You do not have access rights to access the resource'
      )
    );
  }

  req.user.api_user_id = user.id;

  next();
};

const isProjectManager = () => async (req, res, next) => {
  const { sub } = req.user;
  const { projectId } = req.params;

  const user = await User.query().findOne({ sub });
  const project = await Project.query().findById(projectId);

  if ((user && user.is_admin) || (project && project.manager_id === user.id)) {
    return next();
  } else {
    throw new ErrorHandler(403, 'Unauthorized');
  }
};

const isProjectEngineer = () => async (req, res, next) => {
  const { projectId } = req.params;
  const { sub } = req.user;

  const user = await User.query().findOne({ sub });
  const project = await Project.query().findById(projectId);

  if (user.is_admin || user.id === project.manager_id) {
    return next();
  }

  const result = await Project.relatedQuery('engineers')
    .for(projectId)
    .first()
    .where('sub', sub);

  if (!result || isEmpty(result)) {
    throw new ErrorHandler(
      403,
      'You are not authorized to access this resource'
    );
  }

  next();
};

export { checkJwt, isAdmin, isProjectManager, isProjectEngineer };
