import { User } from './user.model';
import { deleteUser as deleteUserFromAuth0 } from '../../lib/auth0';
import { ErrorHandler } from '../../utils/error';

const getUsers = async (req, res) => {
  const { skip, limit, orderBy } = req.query;

  const users = await User.query().offset(skip).limit(limit).orderBy(orderBy);

  res.status(200).json({ users });
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  const user = await User.query().findById(userId);

  if (!user) {
    throw new ErrorHandler(404, `User with ${userId} id not found`);
  }

  return res.status(200).json({ user });
};

const createUser = async (req, res) => {
  const userData = req.body;

  const user = await User.query().returning('*').insert(userData);

  return res.status(201).json({ user });
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const newUserData = req.body;

  const user = await User.query()
    .findById(userId)
    .patch(newUserData)
    .returning('*');

  if (!user) {
    throw new ErrorHandler(404, `User with ${userId} id not found`);
  }

  return res.status(200).json({ user });
};

const deleteUser = async (req, res) => {
  const { id, sub } = req.api_user;

  await deleteUserFromAuth0(sub);

  const user = await User.query().findById(id).delete().returning('*');

  return res.status(200).json({ user });
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
