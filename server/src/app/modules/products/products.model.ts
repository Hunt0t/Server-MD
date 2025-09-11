import { Schema, model } from 'mongoose';
import { PRODUCT_STATUS, TProduct } from './products.schema';

const productSchema = new Schema<TProduct>(
  {
    orderId: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      // required: [true, 'Phone is required'],
      trim: true,
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zip: {
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
    country: {
      type: String,
      trim: true,
    },
    fileName: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      default: 0.25,
    },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.ACTIVE,
      trim: true,
    },
  },

  {
    timestamps: true,
  },
);

export const Product = model<TProduct>('Product', productSchema);
