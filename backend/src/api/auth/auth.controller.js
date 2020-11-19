import { isEmpty } from 'lodash';
import { User } from '../user/user.model';
import fetch from 'node-fetch';
import config from '../../config';
import { ErrorHandler } from '../../utils/error';

const loginUser = async (req, res) => {
  const { sub } = req.user;
  const token = req.headers?.authorization?.split(' ')[1];

  if (!sub || !token) {
    throw new ErrorHandler(401, 'Unauthorized');
  }

  let user = await User.query().findOne({ sub });

  if (user && !isEmpty(user)) {
    res.status(200).json({ user });
  } else {
    // fetch user profile from auth0
    const response = await fetch(`${config.auth0.issuer}userinfo`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new ErrorHandler(
        500,
        'Something went wrong with fetching profile information'
      );
    }

    const profile = await response.json();

    const { email, picture, nickname } = profile;

    const name = profile.name === email && nickname ? nickname : profile.name;
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
