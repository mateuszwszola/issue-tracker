import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { isEmpty } from 'lodash';
import { User } from '../api/user/user.model';
import config from '../config';
import { ErrorHandler } from '../utils/error';

const checkJwt = () => {
  if (config.isProd) {
    return jwt({
      // Dynamically provide a signing key
      // based on the kid in the header and
      // the signing keys provided by the JWKS endpoint.
      secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://dev-6th2ninz.eu.auth0.com/.well-known/jwks.json`,
      }),

      // Validate the audience and the issuer.
      audience: config.auth0Audience,
      issuer: config.auth0Issuer,
      algorithms: ['RS256'],
    });
  }

  return (req, res, next) => {
    req.user = {
      sub: 'auth0|123456789',
      api_user_id: 1,
    };
    next();
  };
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

export { checkJwt, isAdmin };
