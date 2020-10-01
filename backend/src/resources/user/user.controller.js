const pool = require('../../db');

const getUsers = async (req, res) => {
  const results = await pool.query('SELECT * FROM users ORDER BY id ASC');

  res.status(200).json({ users: results.rows });
};

const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);

  const results = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

  return res.status(200).json({ user: results.rows[0] });
};

module.exports = {
  getUsers,
  getUserById,
};
