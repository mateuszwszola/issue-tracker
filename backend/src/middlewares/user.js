import { User } from '../api/user/user.model';
import { ErrorHandler } from '../utils/error';
import { isEmpty } from 'lodash';

const preloadApiUser = () => async (req, res, next) => {
  try {
    const { sub } = req.user;

    const user = await User.query().findOne({ sub });

    if (!user || isEmpty(user)) {
      return next(new ErrorHandler(401, 'Unauthorized'));
    }

    req.api_user = user;
    next();
  } catch (err) {
    next(new ErrorHandler(401, 'Unauthorized'));
  }
};

const preloadUser = ({ userId }) => async (req, res, next) => {
  try {
    if (!userId) {
      return next(new ErrorHandler(400, 'User id is required'));
    }

    const user = await User.query().findById(userId);

    if (!user) {
      return next(new ErrorHandler(404, `User with ${userId} id not found`));
    }

    req.preloaded_user = user;
    next();
  } catch (err) {
    next(new ErrorHandler(404, `User with ${userId} id not found`));
  }
};

export { preloadApiUser, preloadUser };
