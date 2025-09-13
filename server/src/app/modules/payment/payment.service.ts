import { User } from '../Auth/auth.model';

/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builder/QueryBuilder';
import { IMyRequest } from '../../utils/decoded';
import { conflict } from '../../utils/errorfunc';
import { Payment, PAYMENT_STATUS } from './payment.model';
import axios from 'axios';
import config from '../../config';
import { PaymentGateway } from '../payment.getwaye/payment.gateway.model';

const getSinglePaymentByUrl = async (url: string) => {
  const payment = await Payment.findOne({ nowpayments_payment_url: url });

  return payment;
};

const createOrUpdatePayment = async (req: any) => {

  const result = await PaymentGateway.findOne({_id : "68b7e2225656130ec54b32be"});
  
  const userId = req?.user?.id;

  const { amount, currency, orderId } = req.body;

  const lastPayment = await Payment.findOne({
    userId,
    status: PAYMENT_STATUS.CONFIRMED,
  }).sort({ createdAt: -1 });

  if (!lastPayment && amount <= 49) {
    throw conflict('First time minimum deposit is $50');
  } else if (amount <= 14) {
    throw conflict('Any time minimum deposit is $15');
  }

  const totalAmount = (lastPayment ? lastPayment.amount : 0) + amount;

  try {
    await axios.post(
      `${config.now_payment_url}/auth`,
      {
        email: result?.email,
        password: result?.password,
      },
      {
        headers: {
          'x-api-key': result?.apiKey,
          'Content-Type': 'application/json',
        },
      },
    );

    const nowPaymentRes = await axios.post(
      `${config.now_payment_url}/payment`,
      {
        price_amount: amount,
        price_currency: 'USD',
        pay_currency: 'TRX',
        order_id: orderId,
        ipn_callback_url: 'http://localhost:5000/api/nowpayments/ipn',
      },
      {
        headers: {
          'x-api-key': result?.apiKey,
          'Content-Type': 'application/json',
        },
      },
    );
    const paymentIdForRedirect = nowPaymentRes?.data.payment_id;
    console.log('paymentIdForRedirect', paymentIdForRedirect);
    const invoiceData = {
      price_amount: amount,
      price_currency: 'usd',
      order_id: paymentIdForRedirect,
      order_description: 'Apple Macbook Pro 2019 x 1',
      ipn_callback_url: `${config.server_url}/api/nowpayments/ipn`,
      // Pass NP_id (NOWPayments payment_id) so frontend success page can read it
      success_url: `${config.client_url}/payment/success?NP_id=${paymentIdForRedirect}`,
      cancel_url: `${config.client_url}/payment/cancel?NP_id=${paymentIdForRedirect}`,
    };

    const invoice = await axios.post(
      `${config.now_payment_url}/invoice`,
      invoiceData,
      {
        headers: {
          'x-api-key': result?.apiKey,
          'Content-Type': 'application/json',
        },
      },
    );

    const payment = await Payment.create({
      userId,
      amount,
      currency,
      orderId: paymentIdForRedirect,
      status: PAYMENT_STATUS.PENDING,
      beforeBalance: lastPayment?.totalAmount,
      afterBalance: totalAmount,
      invoiceId: invoice.data?.id,
      nowpayments_payment_id: nowPaymentRes.data.payment_id,
      nowpayments_payment_url:
        nowPaymentRes.data.pay_address || nowPaymentRes.data.payment_url,
    });

    return payment;
  } catch (err: any) {
    throw conflict(
      'NOWPayments error: ' + (err?.response?.data?.message || err.message),
    );
  }
};

const progressPayment = async (payment_url: string) => {
  
  const payment = await Payment.findOne({ nowpayments_payment_url: payment_url });
  if (!payment) throw conflict('Payment not found');
  return payment;
};

const confirmPayment = async (payment_url: string) => {
  
  const payment = await Payment.findOne({ orderId: payment_url });
  if (!payment) throw conflict('Payment not found');

  payment.status = PAYMENT_STATUS.CONFIRMED;
  payment.totalAmount = payment.afterBalance;
  await payment.save();
  return payment;
};
// const confirmPayment = async (nowpayments_payment_url: string) => {
//   const payment = await Payment.findOne({ nowpayments_payment_url });

//   if (!payment) throw conflict('Payment not found');

//   payment.status = PAYMENT_STATUS.CONFIRMED;
//   payment.totalAmount = payment.afterBalance;
//   await payment.save();
//   return payment;
// };

const getPaymentHistory = async (userId: string, req: IMyRequest) => {
  const queryBuilder = new QueryBuilder(Payment.find({ userId }), req.query)
    .cleanQuery()
    .search(['firstName', 'lastName', 'city', 'state', 'zip', 'country'])
    .filter()
    .sort('-createdAt')
    .paginate()
    .fields();
  const data = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();

  return {
    meta,
    data,
  };
};

const getPaymentHistoryByAdmin = async (req: IMyRequest) => {
  const queryBuilder = new QueryBuilder(Payment.find(), req.query)
    .cleanQuery()
    .search(['firstName', 'lastName', 'city', 'state', 'zip', 'country'])
    .filter()
    .sort('-createdAt')
    .paginate()
    .fields()
    .populate('userId', 'name email');
  const data = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();

  return {
    meta,
    data,
  };
};

// Admin creates payment for any user by email
const createPaymentByAdmin = async ({
  email,
  amount,
  invoiceId,
}: {
  email: string;
  amount: number;
  invoiceId: string;
}) => {
  const user = await User.findOne({ email });
  if (!user) throw conflict('User not found with this email');

  const lastPayment = await Payment.findOne({ userId: user._id }).sort({
    createdAt: -1,
  });

  console.log('lastPayment', lastPayment);
  const totalAmount = (lastPayment ? lastPayment.amount : 0) + amount;

  // Create payment (no external API call, just DB)
  const payment = await Payment.create({
    userId: user._id,
    amount,
    currency: 'USD',
    totalAmount,
    status: PAYMENT_STATUS.CONFIRMED,
    beforeBalance: lastPayment?.totalAmount,
    afterBalance: totalAmount,
    invoiceId,
  });
  return payment;
};

// Admin: Change payment status
const adminChangePaymentStatus = async (paymentId: string, status: string) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw conflict('Payment not found');
  payment.status = status as PAYMENT_STATUS;
  await payment.save();
  return payment;
};

export const paymentServices = {
  createOrUpdatePayment,
  getPaymentHistory,
  confirmPayment,
  getSinglePaymentByUrl,
  getPaymentHistoryByAdmin,
  createPaymentByAdmin,
  adminChangePaymentStatus,
  progressPayment
};
