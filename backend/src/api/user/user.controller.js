import { User } from './user.model';
import { ErrorHandler } from '../../utils/error';

const getUsers = async (req, res) => {
  const { skip, limit, orderBy = 'id' } = req.query;

  const users = await User.query().offset(skip).limit(limit).orderBy(orderBy);

  res.status(200).json({ users });
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  const user = await User.query().findById(userId);

  if (!user) {
    throw new ErrorHandler(404, 'User not found');
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
    throw new ErrorHandler(404, 'User not found');
  }

  return res.status(200).json({ user });
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.query().findById(userId).returning('*').delete();

  if (!user) {
    throw new ErrorHandler(404, 'User not found');
  }

  return res.status(200).json({ user });
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
