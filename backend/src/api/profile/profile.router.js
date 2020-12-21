import { Router } from 'express';
import { validProfileOrders } from '../../constants/user';
import {
  parsePageQueryParam,
  validateOrderByParam,
} from '../../middlewares/queryParams';
import * as controllers from './profile.controller';
const router = Router();

/**
 * @route /api/profiles
 * @desc Get user profiles
 */
router.get(
  '/',
  parsePageQueryParam(),
  validateOrderByParam(validProfileOrders),
  controllers.getUserProfiles
);

/**
 * @route /api/profiles/:userId
 * @desc Get a user profile
 */
router.get('/:userId', controllers.getUserProfile);

export default router;
