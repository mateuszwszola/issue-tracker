import { Router } from 'express';
import * as controllers from './profile.controller';
const router = Router();

/**
 * @route /api/profiles/:userId
 * @desc Get a user profile
 */
router.get('/:userId', controllers.getUserProfile);

export default router;
