import { Router } from 'express';
import * as controllers from './user.controller';
import { checkJwt, isAdmin } from '../../middlewares/auth';
import { parsePaginationQueryParams } from '../../middlewares/queryParams';
const router = Router();

router.use(checkJwt(), isAdmin());

// /api/v1/users
router
  .route('/')
  .get(parsePaginationQueryParams(), controllers.getUsers)
  .post(controllers.createUser);

// /api/v1/users/:id
router
  .route('/:userId')
  .get(controllers.getUserById)
  .put(controllers.updateUser)
  .delete(controllers.deleteUser);

export default router;
