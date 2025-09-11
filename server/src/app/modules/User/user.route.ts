import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.schema';

const router = express.Router();

// Create a new user
// This route is typically used for admin to create users
// or for user registration
router.post('/create-user', UserControllers.createUser);

// Get all users
router.get(
  '/users',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserControllers.getUsers,
);

// Update user status
router.patch(
  '/:id/status',
  auth(USER_ROLE.ADMIN),
  UserControllers.updateUserStatus,
);

// Update user status
router.post(
  '/telegram',
  auth(USER_ROLE.ADMIN),
  UserControllers.updateTelegram,
);

// Update user status
router.get(
  '/telegram',
  UserControllers.telegram,
);

export const userRoutes = router;
