import { Router } from 'express';
import * as controllers from './user.controller';
import { checkJwt, isAdmin } from '../../middlewares/auth';
const router = Router();

router.use(checkJwt(), isAdmin());

// /api/v1/users
router.route('/').get(controllers.getUsers).post(controllers.createUser);

// /api/v1/users/:id
router
  .route('/:id')
  .get(controllers.getUserById)
  .put(controllers.updateUser)
  .delete(controllers.deleteUser);

export default router;
