import { Router } from 'express';
import * as controllers from './auth.controller';
import { checkJwt } from '../../middlewares/auth';
const router = Router();

/* 
  This endpoint will be called, after successful sign in, through the Auth0 rule.
  The request will contain user sub and basic user profile information.
  The controller job is to first check if a user with user sub already exists.
    1. If it exists - eventually update the user info in the local db, and send back local db user id (api_user_id), and is_admin property.
    2. If not exists - create the user and send api_user_id and is_admin property.
*/

// /api/v1/auth
router.post('/', checkJwt(), controllers.loginUser);

export default router;