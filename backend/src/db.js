const { Pool } = require('pg');
const {
  db: { user, host, database, password, port },
} = require('./config');

const pool = new Pool({
  user,
  host,
  database,
  password,
  port,
});

module.exports = pool;
