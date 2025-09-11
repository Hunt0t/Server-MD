import { z } from 'zod';

export enum PAYMENT_STATUS {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export const paymentSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: 'User ID is required.' }),
    amount: z.number({ required_error: 'Amount is required.' }),
    currency: z.string({ required_error: 'Currency is required.' }),
    status: z
      .enum([
        PAYMENT_STATUS.PENDING,
        PAYMENT_STATUS.PAID,
        PAYMENT_STATUS.FAILED,
      ])
      .optional(),
    paymentId: z.string().optional(),
    orderId: z.string().optional(),
    totalAmount: z.any().optional(),
  }),
});

export type TPaymentStatus = `${PAYMENT_STATUS}`;
export type TPayment = z.infer<typeof paymentSchema.shape.body>;

export const PaymentValidation = {
  paymentSchema,
};
