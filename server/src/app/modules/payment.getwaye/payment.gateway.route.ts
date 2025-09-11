import express from 'express';
import { paymentGatewayController } from './payment.gateway.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.schema';

const router = express.Router();

// Get all payment gateways (admin and user)
router.get(
  '/gateways',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  paymentGatewayController.getPaymentGateways,
);

// Update a payment gateway (admin only)
router.patch(
  '/',
  auth(USER_ROLE.ADMIN),
  paymentGatewayController.updatePaymentGateway,
);

// Update only payment gateway status (admin only)
router.patch(
  '/:id/status',
  auth(USER_ROLE.ADMIN),
  paymentGatewayController.updatePaymentGatewayStatus,
);

export const paymentGatewayRoutes = router;
