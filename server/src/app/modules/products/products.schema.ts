/* eslint-disable no-unused-vars */
import { z } from 'zod';
import { BaseType } from '../../utils/utils.interface';

export enum PRODUCT_STATUS {
  ACTIVE = 'active',
  DELETE = 'delete',
  LATE = 'late',
}

// Product create schema
const productSchema = z.object({
  body: z.object({
    orderId: z.string().optional(),
    firstName: z.string().optional(),
    fileName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    gender: z.string().optional(),
    dob: z.date().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    mail: z.string().optional(),
    ssn: z.string().optional(),
    country: z.string().optional(),
    price: z.number().optional(),
    status: z
      .enum([PRODUCT_STATUS.ACTIVE, PRODUCT_STATUS.DELETE, PRODUCT_STATUS.LATE])
      .optional()
      .default(PRODUCT_STATUS.ACTIVE),
  }),
});


export type TProductStatus = `${PRODUCT_STATUS}`;
export type TProduct = BaseType & z.infer<typeof productSchema.shape.body>;

export const ProductValidation = {
  productSchema,
};
