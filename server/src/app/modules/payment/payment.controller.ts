
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { paymentServices } from './payment.service';
import { IMyRequest } from '../../utils/decoded';
import { USER_ROLE } from '../Auth/auth.schema';

const getSinglePaymentByUrl = catchAsync(async (req, res) => {
  const url = req?.query?.url;

  const payment = await paymentServices.getSinglePaymentByUrl(url as string);
  if (!payment) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Payment not found',
      data: null,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment found.',
    data: payment,
  });
});

// Create or update payment (add to previous unpaid if exists)
const createOrUpdatePayment = catchAsync(async (req, res) => {
  const payment = await paymentServices.createOrUpdatePayment(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment created or updated.',
    data: payment,
  });
});

// Get payment history for a user (with pagination)
const getPaymentHistory = catchAsync(async (req: any, res) => {
  const userId = req?.user?.id;

  if (req?.user?.role === USER_ROLE.ADMIN) {
    const history = await paymentServices.getPaymentHistoryByAdmin(req as any);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment history loaded.',
      data: history.data,
      meta: history.meta,
    });
  } else {
    const history = await paymentServices.getPaymentHistory(userId, req as any);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment history loaded.',
      data: history.data,
      meta: history.meta,
    });
  }
});

// Confirm payment (for IPN or manual call)
const confirmPayment = catchAsync(async (req, res) => {
  const { url } = req.query;
  const payment = await paymentServices.confirmPayment(url as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment confirmed.',
    data: payment,
  });
});
// Confirm payment (for IPN or manual call)
const progressPayment = catchAsync(async (req, res) => {
  const { url } = req.query;
  console.log('url', url)
  const payment = await paymentServices.progressPayment(url as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment confirmed.',
    data: payment,
  });
});


// Create payment by admin for any user (by email)
const createPaymentByAdmin = catchAsync(async (req, res) => {
  // expects: { email, amount, currency }
  const { email, amount, invoiceId } = req.body;
  if (!email || !amount || !invoiceId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Email, amount, and currency are required.',
      data: null,
    });
  }
  const payment = await paymentServices.createPaymentByAdmin({ email, amount, invoiceId });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment created by admin.',
    data: payment,
  });
});

// Admin: Change payment status
const adminChangePaymentStatus = catchAsync(async (req, res) => {
  const { paymentId, status } = req.body;
  if (!paymentId || !status) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'paymentId and status are required.',
      data: null,
    });
  }
  const payment = await paymentServices.adminChangePaymentStatus(paymentId, status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment status updated.',
    data: payment,
  });
});


export const paymentControllers = {
  createOrUpdatePayment,
  getPaymentHistory,
  confirmPayment,
  getSinglePaymentByUrl,
  createPaymentByAdmin,
  adminChangePaymentStatus,
  progressPayment,
};
