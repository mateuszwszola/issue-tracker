import db from '../../db';

const getUsers = async (req, res) => {
  const results = await db.query('SELECT * FROM users ORDER BY id ASC');

  res.status(200).json({ users: results.rows });
};

const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);

  const results = await db.query('SELECT * FROM users WHERE id = $1', [id]);

  return res.status(200).json({ user: results.rows[0] });
};

const createUser = async (req, res) => {
  const { name, email } = req.body;

  await db.query('INSERT INTO users (name, email) VALUES ($1, $2)', [
    name,
    email,
  ]);

  return res.status(201).json({ message: 'User created' });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const id = parseInt(req.params.id);

  const results = await db.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id]
  );

  console.log(results);

  return res.status(200).json({ message: 'User successfully updated' });
};

const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);

  const results = await db.query('DELETE FROM users WHERE id = $1', [id]);

  console.log(results);

  return res.status(200).json({ message: 'User successfully deleted' });
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
