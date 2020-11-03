import { isEmpty } from 'lodash';
import { User } from '../user/user.model';

const loginUser = async (req, res, next) => {
  const { sub } = req.user;
  const { name, email, picture } = req.body;

  let user = await User.query().findOne({ sub });

  if (!user || isEmpty(user)) {
    user = await User.query()
      .returning('*')
      .insert({ sub, name, email, picture });
  }

  return res
    .status(200)
    .json({ api_user_id: user.id, is_admin: user.is_admin });
};

export { loginUser };
