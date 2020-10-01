const express = require('express');
const controllers = require('./user.controller');
const router = express.Router();

// /api/users
router.route('/').get(controllers.getUsers);

// /api/users/:id
router.route('/:id').get(controllers.getUserById);

module.exports = router;
