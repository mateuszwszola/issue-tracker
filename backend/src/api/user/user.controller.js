import { User } from './user.model';
import { isEmpty } from 'lodash';
import { ErrorHandler } from '../../utils/error';
import { validUserOrders } from '../../utils/user';
import { pickExistingProperties } from '../../utils/helpers';

const getUsers = async (req, res) => {
  const { cursor, limit, select } = req.query;
  let { orderBy } = req.query;

  orderBy = orderBy ? String(orderBy).toLowerCase() : 'id';

  if (!validUserOrders.has(orderBy)) {
    throw new ErrorHandler(400, 'Invalid orderBy param');
  }

  const query = User.query().offset(cursor).limit(limit).orderBy(orderBy);

  if (select) {
    query.select(select);
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
  const { userId } = req.params;

  const newUserData = pickExistingProperties(
    ['name', 'email', 'sub', 'picture'],
    {
      ...req.body,
    }
  );

  let query = User.query().findById(userId);

  if (!isEmpty(newUserData)) {
    query = query.patch(newUserData).returning('*');
  }

  return res.status(200).json({ user: await query });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.query().findById(id).returning('*').delete();

  return res.status(200).json({ user });
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
