import { Schema, model } from 'mongoose';
import { TPaymentGateway } from './payment.gateway.schema';

const paymentGatewaySchema = new Schema<TPaymentGateway>({
  name: { type: String, required: true },
  details: { type: String },
  apiKey: { type: String },
  isActive: { type: Boolean, default: false }, 
}, { timestamps: true });

export const PaymentGateway = model<TPaymentGateway>('PaymentGateway', paymentGatewaySchema);
