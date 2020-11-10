import { Router } from 'express';
import * as controllers from './auth.controller';
import { checkJwt } from '../../middlewares/auth';
const router = Router();

/*
  @route /api/v1/auth/login
  @desc Return user if exists, if not - create one fetching profile information
*/
router.post('/login', checkJwt(), controllers.loginUser);

export default router;
