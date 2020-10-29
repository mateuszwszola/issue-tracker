import * as fetch from 'node-fetch';

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

export { getUserAccessToken };
