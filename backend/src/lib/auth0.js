import { ManagementClient } from 'auth0';

const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_MANAGEMENT_API_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_API_CLIENT_SECRET,
  scope: 'read:users update:users delete:users',
});

export function deleteUser(userId) {
  return auth0.deleteUser({ id: userId });
}

export default auth0;
