import { User } from '../user/user.model';

const loginUser = async (req, res, next) => {
  const { auth0_user_id, name, email, picture } = req.body;

  const user = await User.query().findOne({ auth0_user_id });

  if (user) {
    return res
      .status(200)
      .json({ api_user_id: user.id, is_admin: user.is_admin });
  } else {
    const newUser = await User.query()
      .returning('*')
      .insert({ name, email, picture, auth0_user_id });

    return res
      .status(200)
      .json({ api_user_id: newUser.id, is_admin: newUser.is_admin });
  }
};

export default { loginUser };
