import { Schema, model } from 'mongoose';

export enum PAYMENT_STATUS {
  PENDING = 'pending',
  PAID = 'paid',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

export interface IPayment {
  userId: string;
  amount: number;
  afterBalance: number;
  beforeBalance: number;
  currency: string;
  status: PAYMENT_STATUS;
  paymentId?: string;
  orderId?: string;
  totalAmount?: any;
  nowpayments_payment_id?: string;
  nowpayments_payment_url?: string;
  invoiceId?: string;
  
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {ref:'Users' , type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    invoiceId: { type: String, required: true  },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    paymentId: { type: String },
    nowpayments_payment_id: { type: String },
    nowpayments_payment_url: { type: String },
    
    orderId: { type: String },
    totalAmount: { type: Number },
    afterBalance: { type: Number },
    beforeBalance: { type: Number },
  },
  { timestamps: true },
);

export const Payment = model<IPayment>('Payment', paymentSchema);
