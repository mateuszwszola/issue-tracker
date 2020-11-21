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
 * @route /api/v1/users
 */
router.use('/', authorize(ROLES.admin));

router.get('/', [
  parsePageQueryParam(),
  validateOrderByParam(validUserOrders),
  controllers.getUsers,
]);

router.post('/', createUserSchema, controllers.createUser);

/**
 * @route /api/v1/users/:userId
 */
router.use('/:userId', [
  (req, res, next) => {
    const { userId } = req.params;
    preloadUser({ userId, required: true })(req, res, next);
  },
  checkOwner,
]);

router
  .route('/:userId')
  .get(authorize(ROLES.admin, ROLES.owner), controllers.getUserById)
  .patch(
    authorize(ROLES.admin, ROLES.owner),
    updateUserSchema,
    controllers.updateUser
  )
  .delete(authorize(ROLES.admin), controllers.deleteUser);

function checkOwner(req, res, next) {
  const { api_user, preloaded_user } = req;
  if (api_user.id && preloaded_user.id && api_user.id === preloaded_user.id) {
    api_user.role = ROLES.owner;
  }

  next();
}

export default router;
