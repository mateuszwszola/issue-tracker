import { User } from './user.model';
import { isEmpty } from 'lodash';
import { ErrorHandler } from '../../utils/error';

const getUsers = async (req, res) => {
  const { cursor = 0, limit = 100, select, orderBy } = req.query;

  const query = User.query().offset(parseInt(cursor)).limit(parseInt(limit));

  if (select) {
    query.select(select);
  }

  if (orderBy) {
    query.orderBy(orderBy);
  }

  res.status(200).json({ users: await query });
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const { select } = req.query;

  const query = User.query().findById(id);

  if (select) {
    query.select(select);
  }

  const user = await query;

  if (isEmpty(user)) {
    throw new ErrorHandler(404, 'User not found');
  }

  return res.status(200).json({ user });
};

const createUser = async (req, res) => {
  const { name, email } = req.body;

  const user = await User.query().returning('*').insert({ name, email });

  return res.status(201).json({ user });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const { id } = req.query;

  const user = await User.query()
    .findById(id)
    .returning('*')
    .patch({ name, email });

  return res.status(200).json({ user });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.query().findById(id).returning('*').delete();

  return res.status(200).json({ user });
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
