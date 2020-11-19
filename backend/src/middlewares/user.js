import { User } from '../api/user/user.model';
import { ErrorHandler } from '../utils/error';
import { isEmpty } from 'lodash';

const preloadApiUser = () => async (req, res, next) => {
  const { sub } = req.user;

  const user = await User.query().findOne({ sub });

  if (!user || isEmpty(user)) {
    throw new ErrorHandler(401, 'Unauthorized');
  }

  req.api_user = user;

  next();
};

export { preloadApiUser };
