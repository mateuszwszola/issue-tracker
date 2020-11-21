import { Router } from 'express';
import * as controllers from './user.controller';
import { isAdmin } from '../../middlewares/auth';
import {
  parsePageQueryParam,
  validateOrderByParam,
} from '../../middlewares/queryParams';
import { validUserOrders } from '../../constants/user';
import { createUserSchema, updateUserSchema } from '../../utils/user';
const router = Router();

router.use(isAdmin());

/**
 * @route /api/v1/users
 */
router
  .route('/')
  .get(
    parsePageQueryParam(),
    validateOrderByParam(validUserOrders),
    controllers.getUsers
  )
  .post(createUserSchema, controllers.createUser);

/**
 * @route /api/v1/users/:userId
 */
router
  .route('/:userId')
  .get(controllers.getUserById)
  .patch(updateUserSchema, controllers.updateUser)
  .delete(controllers.deleteUser);

export default router;
