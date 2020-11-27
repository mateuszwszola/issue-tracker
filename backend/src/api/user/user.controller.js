import { User } from './user.model';

const getUsers = async (req, res) => {
  const { page, limit, orderBy } = req.query;

  const users = await User.query().page(page, limit).orderBy(orderBy);

  res.status(200).json({ users });
};

const getUserById = async (req, res) => {
  const { preloaded_user } = req;

  return res.status(200).json({ user: preloaded_user });
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

  return res.status(200).json({ user });
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.query().findById(userId).returning('*').delete();

  return res.status(200).json({ user });
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
