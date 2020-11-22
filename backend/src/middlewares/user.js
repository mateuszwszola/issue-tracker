import { User } from '../api/user/user.model';
import { ErrorHandler } from '../utils/error';
import { isEmpty } from 'lodash';

const preloadApiUser = () => async (req, res, next) => {
  const { sub } = req.user;

  const user = await User.query().findOne({ sub });

  if (!user || isEmpty(user)) {
    return next(new ErrorHandler(401, 'Unauthorized'));
  }

  req.api_user = user;

  next();
};

const preloadUser = ({ userId, required }) => async (req, res, next) => {
  if (!userId && required) {
    return next(new ErrorHandler(400, 'User id is required'));
  }

  let user;

  if (userId) {
    user = await User.query().findById(userId);
  }

  if (!user && required) {
    return next(new ErrorHandler(404, `User with ${userId} id not found`));
  }

  req.preloaded_user = user;

  next();
};

export { preloadApiUser, preloadUser };
