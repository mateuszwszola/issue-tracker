import db from '../../db';
import tableNames from '../../constants/tableNames';

const getUsers = async (req, res) => {
  const results = await db.select('*').from(tableNames.user).limit(100);

  res.status(200).json({ users: results });
};

const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);

  const results = await db.select('*').from(tableNames.user).where('id', id);

  return res.status(200).json({ user: results });
};

const createUser = async (req, res) => {
  const { name, email } = req.body;

  const user = await db(tableNames.user).returning('*').insert({ name, email });

  return res.status(201).json({ user });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const id = parseInt(req.params.id);

  const user = await db(tableNames.user)
    .returning('*')
    .where('id', id)
    .update({ name, email });

  return res.status(200).json({ user });
};

const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);

  const user = await db(tableNames.user)
    .where('id', id)
    .returning('*')
    .delete();

  return res.status(200).json({ user });
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
