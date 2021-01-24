import { Router } from 'express';
import { ROLES } from '../../constants/roles';
import { validUserOrders } from '../../constants/user';
import { authenticate, authorize, checkAdmin } from '../../middlewares/auth';
import {
  parsePageQueryParam,
  validateOrderByParam,
} from '../../middlewares/queryParams';
import { preloadUser } from '../../middlewares/user';
import { updateUserSchema } from '../../utils/user';
import * as controllers from './user.controller';

const router = Router();

router.use(...authenticate(), checkAdmin());

/**
 * @route GET /api/users
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
 * @route /api/users/:userId
 */
router.use(
  '/:userId',
  (req, res, next) => {
    const { userId } = req.params;
    preloadUser({ userId })(req, res, next);
  },
  (req, _res, next) => {
    const { api_user, preloaded_user } = req;

    if (api_user && preloaded_user && api_user.id === preloaded_user.id) {
      api_user.role = ROLES.owner;
    }

    next();
  }
);

/**
 * @route GET /api/users/:userId
 * @desc Get a user by Id
 * @access Admin, Profile Owner
 */
router.get(
  '/:userId',
  authorize(ROLES.admin, ROLES.owner),
  controllers.getUserById
);

/**
 * @route PATCH /api/users/:userId
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
 * @route DELETE /api/users/:userId
 * @desc Delete account
 * @access Profile Owner
 */
router.delete('/', authorize(ROLES.owner), controllers.deleteUser);

export default router;
