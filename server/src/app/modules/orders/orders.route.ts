import express from 'express';
import { orderControllers } from './orders.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.schema';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Create orders (multiple at once)
router.post(
  '/create',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  orderControllers.createOrders,
);

// Get all orders for a user
router.get(
  '/orders',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  orderControllers.getOrders,
);

// Delete order by id
router.delete(
  '/:id',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  orderControllers.deleteOrder,
);


export const orderRoutes = router;
