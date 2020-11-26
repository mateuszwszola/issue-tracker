import { isEmpty } from 'lodash';
import { User } from '../user/user.model';
import fetch from 'node-fetch';
import config from '../../config';
import { ErrorHandler } from '../../utils/error';

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

const loginUser = async (req, res, next) => {
  const { sub } = req.user;
  const token = req.headers?.authorization?.split(' ')[1];

  if (!sub || !token) {
    return next(new ErrorHandler(401, 'Unauthorized'));
  }

  let user = await User.query().findOne({ sub });

  if (user && !isEmpty(user)) {
    return res.status(200).json({ user });
  } else {
    // fetch user profile from auth0
    const profile = await fetchUserProfile({ token });

    const { email, picture, nickname } = profile;
    const name = nickname && profile.name === email ? nickname : profile.name;
    // Read user roles from the access token
    let assignedRoles = req.user[`${config.auth0.audience}/roles`];
    if (assignedRoles && typeof assignedRoles === 'string') {
      assignedRoles = [assignedRoles];
    }
    // If there is no assigned roles in the access token, check for admin based on the email
    const isAdmin = Array.isArray(assignedRoles)
      ? assignedRoles.includes('Admin')
      : email === config.adminUserEmail;

    const newUserData = { sub, name, email, picture, is_admin: isAdmin };

    const userByEmail = await User.query().findOne({ email });

    if (!userByEmail || isEmpty(userByEmail)) {
      user = await User.query().insert(newUserData).returning('*');
      res.status(201).json({ user });
    } else {
      // update existing user
      user = await User.query()
        .findById(userByEmail.id)
        .patch({
          sub,
          name,
          picture,
          is_admin: userByEmail.is_admin || isAdmin,
        })
        .returning('*');

      res.status(200).json({ user });
    }
  }
};

export { loginUser };
