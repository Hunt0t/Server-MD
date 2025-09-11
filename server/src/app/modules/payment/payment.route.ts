
import express from 'express';
import { paymentControllers } from './payment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.schema';

const router = express.Router();



// Create or update payment
router.post(
  '/create',
  auth(USER_ROLE.USER),
  paymentControllers.createOrUpdatePayment,
);

// Get payment history for a user
router.get(
  '/history',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  paymentControllers.getPaymentHistory,
);

// Confirm payment (for IPN or manual call)
router.post('/confirm', paymentControllers.confirmPayment);
router.post('/progress', paymentControllers.progressPayment);

// Get single payment by nowpayments_payment_url
router.get('/payment-by-url', paymentControllers.getSinglePaymentByUrl);
router.post('/payment-by-admin', auth(USER_ROLE.ADMIN),  paymentControllers.createPaymentByAdmin);

// Admin change payment status
router.post('/admin-status-change', auth(USER_ROLE.ADMIN), paymentControllers.adminChangePaymentStatus);

export const paymentRoutes = router;
