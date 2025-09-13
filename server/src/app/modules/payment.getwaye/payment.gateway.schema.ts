import { z } from 'zod';
import { BaseType } from '../../utils/utils.interface';

const productGateWaySchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Gateway name is required.' }),
    details: z.string().optional(),
    apiKey: z.string().optional(),
    isActive: z.boolean().default(false),
    wallet: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(1).optional(),
  }),
});

export type TPaymentGateway = BaseType &
  z.infer<typeof productGateWaySchema.shape.body>;

export const ProductGatewayValidation = {
  productGateWaySchema,
};
