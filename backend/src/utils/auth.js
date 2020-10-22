import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import config from '../config';

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
      name: config.adminUserName,
      email: config.adminUserEmail,
    };
    next();
  };
};

export { checkJwt };
