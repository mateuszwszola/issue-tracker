import * as fetch from 'node-fetch';
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
      sub: 'auth0|123456789',
      api_user_id: 1,
    };
    next();
  };
};

const getUserAccessToken = () => {
  const body = {
    grant_type: 'password',
    username: process.env.AUTH0_TEST_USER_USERNAME,
    password: process.env.AUTH0_TEST_USER_PASSWORD,
    audience: process.env.AUTH0_AUDIENCE,
    scope: '',
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
  };

  return fetch(`${process.env.AUTH0_ISSUER}oauth/token`, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => res.json());
};

export { checkJwt, getUserAccessToken };
