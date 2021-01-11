import { isEmpty } from 'lodash';
import { User } from '../user/user.model';
import { ErrorHandler } from '../../utils/error';
import { fetchUserProfile, formatUserProfile } from '../../utils/auth';

const loginUser = async (req, res, next) => {
  const { sub } = req.user;
  const token = req.headers?.authorization?.split(' ')[1];

  if (!sub || !token) {
    return next(new ErrorHandler(401, 'Unauthorized'));
  }

  const user = await User.query().findOne({ sub });

  if (!isEmpty(user)) {
    // User exists - return it
    return res.status(200).json({ user });
  } else {
    // User does not exists, fetch user profile from Auth0 and create a new user
    const rawProfile = await fetchUserProfile({ token });

    const profile = formatUserProfile(req.user, rawProfile);

    const newUser = await User.query()
      .insert({ ...profile })
      .returning('*');

    return res.status(201).json({ user: newUser });
  }
};

const getAuthUser = (req, res, _next) => {
  const { api_user: user } = req;

  return res.status(200).json({ user });
};

export { loginUser, getAuthUser };
