import { Router } from 'express';
import * as controllers from './user.controller';
import { checkJwt } from '../../middlewares/auth';
const router = Router();

// /api/v1/users
router
  .route('/')
  .get(checkJwt(), controllers.getUsers)
  .post(checkJwt(), controllers.createUser);

// /api/v1/users/:id
router
  .route('/:id')
  .get(checkJwt(), controllers.getUserById)
  .put(checkJwt(), controllers.updateUser)
  .delete(checkJwt(), controllers.deleteUser);

export default router;
