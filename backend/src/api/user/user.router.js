import { Router } from 'express';
import * as controllers from './user.controller';
import { authenticate, authorize, checkAdmin } from '../../middlewares/auth';
import {
  parsePageQueryParam,
  validateOrderByParam,
} from '../../middlewares/queryParams';
import { validUserOrders } from '../../constants/user';
import { createUserSchema, updateUserSchema } from '../../utils/user';
import { ROLES } from '../../constants/roles';
import { preloadUser } from '../../middlewares/user';
const router = Router();

router.use(...authenticate(), checkAdmin());

/**
 * @route GET /api/v1/users
 * @desc Get list of users
 */
router.get(
  '/',
  authorize(ROLES.admin),
  parsePageQueryParam(),
  validateOrderByParam(validUserOrders),
  controllers.getUsers
);

/**
 * @route POST /api/v1/users
 * @desc Create a user
 */
router.post(
  '/',
  authorize(ROLES.admin),
  createUserSchema,
  controllers.createUser
);

/**
 * @route /api/v1/users/:userId
 */
router.use('/:userId', [
  (req, res, next) => {
    const { userId } = req.params;
    preloadUser({ userId })(req, res, next);
  },
  (req, res, next) => {
    const { api_user, preloaded_user } = req;

    if (api_user && preloaded_user && api_user.id === preloaded_user.id) {
      api_user.role = ROLES.owner;
    }

    next();
  },
]);

/**
 * @route GET /api/v1/users/:userId
 * @desc Get a user by Id
 * @access Admin, Profile Owner
 */
router.get(
  '/:userId',
  authorize(ROLES.admin, ROLES.owner),
  controllers.getUserById
);

/**
 * @route PATCH /api/v1/users/:userId
 * @desc Update a user
 * @access Admin, Profile Owner
 */
router.patch(
  '/:userId',
  authorize(ROLES.admin, ROLES.owner),
  updateUserSchema,
  controllers.updateUser
);

/**
 * @route DELETE /api/v1/users/:userId
 * @desc Delete a user
 * @access Admin
 */
router.delete('/:userId', authorize(ROLES.admin), controllers.deleteUser);

export default router;
