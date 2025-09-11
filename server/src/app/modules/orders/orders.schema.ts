import { z } from 'zod';
import { BaseType } from '../../utils/utils.interface';
import { Schema } from 'mongoose';

export const orderSchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    productIds: z.array(
      z.string({ required_error: 'Product ID is required.' }),
    ),
    totalCost: z.number().optional(),
  }),
});


export type TOrder = BaseType & {
  productId: Schema.Types.ObjectId;
  paymentId: Schema.Types.ObjectId;
  price: number;
  firstName?: string;
  orderId?: string;
  lastName?: string;
  city?: string;
  phone?: string;
  ssn?: string;
  mail?: string;
  address?: string;
  dob?: string;
  state?: string;
  gender?: string;
  zip?: string;
  country?: string;
  year?: number;
  status?: string;
} & z.infer<typeof orderSchema.shape.body>;

export const OrderValidation = {
  orderSchema,
};
