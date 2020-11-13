import { User } from '../api/user/user.model';

const preloadApiUser = () => async (req, res, next) => {
  const { sub } = req.user;

  const user = await User.query().findOne({ sub });

  req.api_user = user;

  next();
};

export { preloadApiUser };
