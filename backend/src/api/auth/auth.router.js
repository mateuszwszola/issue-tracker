import { Router } from 'express';
import * as controllers from './auth.controller';
import { checkJwt } from '../../middlewares/auth';
const router = Router();

// /api/v1/auth/login
router.post('/login', checkJwt(), controllers.loginUser);

export default router;
