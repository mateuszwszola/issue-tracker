import * as fetch from 'node-fetch';

const getTestUserAccessToken = async () => {
  const body = {
    grant_type: 'password',
    username: process.env.AUTH0_TEST_USER_USERNAME,
    password: process.env.AUTH0_TEST_USER_PASSWORD,
    audience: process.env.AUTH0_AUDIENCE,
    scope: '',
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
  };

  const response = await fetch(`${process.env.AUTH0_ISSUER}oauth/token`, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

  const { access_token } = await response.json();

  return { access_token };
};

export { getTestUserAccessToken };
