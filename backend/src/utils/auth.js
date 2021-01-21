import fetch from 'node-fetch';
import config from '../config';

async function fetchUserProfile({ token }) {
  const response = await fetch(`${config.auth0.issuer}userinfo`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    return Promise.reject(data);
  } else {
    return data;
  }
}

function formatUserProfile(user, rawProfile) {
  const { email, picture, name, nickname } = rawProfile;

  return {
    sub: user.sub,
    name: name === email && nickname ? nickname : name,
    email,
    picture,
    is_admin: getUserRoles(user).includes('ADMIN'),
  };
}

function getUserRoles(user) {
  let roles = user[`${config.auth0.audience}/roles`] || [];

  if (typeof roles === 'string') {
    roles = [roles];
  }

  roles = roles.map((role) => role.toUpperCase());

  return roles;
}

export { fetchUserProfile, formatUserProfile, getUserRoles };
