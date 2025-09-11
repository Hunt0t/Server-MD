import { Schema, model } from 'mongoose';
import { TOrder } from './orders.schema';

const orderSchema = new Schema<TOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },

    firstName: { type: String },
    orderId: { type: String },
    lastName: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
    year: { type: Number },
    status: { type: String },

    phone: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
      trim: true,
    },

    mail: {
      type: String,
      trim: true,
    },
    ssn: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,

      trim: true,
    },
   
  },
  {
    timestamps: true,
  },
);

export const Orders = model('Orders', orderSchema);
