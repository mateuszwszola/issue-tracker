import { Router } from 'express';
import * as controllers from './auth.controller';
import { authenticate, checkJwt } from '../../middlewares/auth';

const router = Router();

/**
 @route /api/auth/user
 @desc Return authenticated user if exists
 */
router.get('/user', ...authenticate(), controllers.getAuthUser);

/**
 @route /api/auth/login
 @desc Return user if exists, if not - create one fetching profile information from Auth0
 */
router.post('/login', checkJwt, controllers.loginUser);

export default router;
