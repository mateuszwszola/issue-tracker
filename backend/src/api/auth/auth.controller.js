import { isEmpty } from 'lodash';
import { User } from '../user/user.model';
import fetch from 'node-fetch';
import config from '../../config';
import { ErrorHandler } from '../../utils/error';

const loginUser = async (req, res, next) => {
  const { sub } = req.user;
  const token = req.headers?.authorization?.split(' ')[1];

  if (!sub || !token) {
    throw new ErrorHandler(401, 'Unauthorized');
  }

  let user = await User.query().findOne({ sub });

  if (!user || isEmpty(user)) {
    // fetch user profile
    const response = await fetch(`${config.auth0.issuer}userinfo`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new ErrorHandler(500, 'Something went wrong. Sorry...');
    }

    const profile = await response.json();

    const { email, picture, nickname } = profile;

    const name = profile.name === email && nickname ? nickname : profile.name;
    // Read user roles which comes from the access_token
    const assignedRoles = req.user[`${config.auth0.audience}/roles`];
    // If there is no assignedRoles in the access_token, check for admin based on the email
    const isAdmin = Array.isArray(assignedRoles)
      ? assignedRoles.includes('Admin')
      : email === config.adminUserEmail;

    const newUserData = { sub, name, email, picture, is_admin: isAdmin };

    user = await User.query().insert(newUserData).returning('*');

    return res.status(201).json({ user });
  }

  res.status(200).json({ user });
};

export { loginUser };
