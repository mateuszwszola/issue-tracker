import { Router } from 'express';
import controllers from './user.controller';
const router = Router();

// /api/users
router.route('/').get(controllers.getUsers).post(controllers.createUser);

// /api/users/:id
router
  .route('/:id')
  .get(controllers.getUserById)
  .put(controllers.updateUser)
  .delete(controllers.deleteUser);

export default router;
