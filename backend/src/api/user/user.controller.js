import { User } from './user.model';
import { isEmpty } from 'lodash';
import { ErrorHandler } from '../../utils/error';

const getUsers = async (req, res) => {
  const { skip, limit, select, orderBy = 'id' } = req.query;

  const query = User.query().offset(skip).limit(limit).orderBy(orderBy);

  if (select) {
    query.select(select);
  }

  res.status(200).json({ users: await query });
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  const { select } = req.query;

  const query = User.query().findById(userId);

  if (select) {
    query.select(select);
  }

  const user = await query;

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

  let user = await User.query().findById(userId);

  if (!user) {
    throw new ErrorHandler(404, 'User not found');
  }

  if (!isEmpty(newUserData)) {
    user = user.$query.patch(newUserData).returning('*');
  }

  return res.status(200).json({ user });
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.query().findById(userId).returning('*').delete();

  return res.status(200).json({ user });
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
