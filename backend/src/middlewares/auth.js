import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { isEmpty } from 'lodash';
import { Project } from '../api/project/project.model';
import { User } from '../api/user/user.model';
import config from '../config';
import { ErrorHandler } from '../utils/error';

const checkJwt = () => {
  return jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${config.auth0.issuer}/.well-known/jwks.json`,
    }),

    // Validate the audience and the issuer.
    audience: config.auth0.audience,
    issuer: config.auth0.issuer,
    algorithms: ['RS256'],
  });
};

const isAdmin = () => {
  return async (req, res, next) => {
    if (!req.user || (req.user && !req.user.sub)) {
      return next(new ErrorHandler(401, 'Unauthorized'));
    } else {
      const user = await User.query().findOne({ auth0_user_id: req.user.sub });
      if (!user || isEmpty(user) || !user.is_admin) {
        return next(
          new ErrorHandler(
            403,
            'You do not have access rights to access the resource'
          )
        );
      }

      req.user.api_user_id = user.id;
      next();
    }
  };
};

const checkIfAdminOrProjectManager = () => async (req, res, next) => {
  const user = await User.query().findOne({ auth0_user_id: req.user.sub });
  const project = await Project.query().findById(req.params.projectId);

  console.log('req.params.projectId', req.params.projectId);
  console.log(user, project);

  if (!user || !project) {
    throw new ErrorHandler(404, 'Not found');
  }

  if (user.is_admin || project.manager_id === user.id) {
    return next();
  } else {
    throw new ErrorHandler(403, 'Unauthorized');
  }
};

export { checkJwt, isAdmin, checkIfAdminOrProjectManager };
