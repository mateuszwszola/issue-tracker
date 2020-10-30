import { isEmpty } from 'lodash';
import { User } from '../user/user.model';

const loginUser = async (req, res, next) => {
  const { auth0_user_id, name, email, picture } = req.body;

  let user = await User.query().findOne({ auth0_user_id });

  if (!user || isEmpty(user)) {
    user = await User.query()
      .returning('*')
      .insert({ auth0_user_id, name, email, picture });
  }

  return res
    .status(200)
    .json({ api_user_id: user.id, is_admin: user.is_admin });
};

export { loginUser };
